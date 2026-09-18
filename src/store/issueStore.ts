import { CivicIssue, Comment } from "../types";
import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, query, orderBy, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../utils/firestoreErrorHandler";
import { notificationStore } from "./notificationStore";

let currentListeners: (() => void)[] = [];

export const issueStore = {
  issues: [] as CivicIssue[],
  loading: false,
  error: null as string | null,
  unsubscribeSync: null as (() => void) | null,

  subscribe(listener: () => void) {
    currentListeners.push(listener);
    return () => {
      currentListeners = currentListeners.filter(l => l !== listener);
    };
  },

  notify() {
    currentListeners.forEach(listener => listener());
  },

  async fetchIssues() {
    this.loading = true;
    this.error = null;
    this.notify();

    try {
      // Try to fetch from Firebase first
      let list: CivicIssue[] = [];
      let firebaseAvailable = false;
      
      try {
        const querySnapshot = await Promise.race<QuerySnapshot<DocumentData>>([
          getDocs(query(collection(db, "issues"), orderBy("createdAt", "desc"))),
          new Promise<QuerySnapshot<DocumentData>>((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), 3000))
        ]);
        
        querySnapshot.forEach((doc) => {
          list.push(doc.data() as CivicIssue);
        });
        firebaseAvailable = true;
        
        // If Firebase has data, seed it to local issues
        if (list.length > 0) {
          this.issues = list;
          this.notify();
        }
      } catch (err: any) {
        console.warn("Firestore unavailable, using API fallback:", err.message);
      }

      // If Firebase is empty or failed, fetch from API and seed both
      if (list.length === 0) {
        try {
          const response = await fetch("/api/issues");
          const json = await response.json();
          if (json.success && json.data && json.data.length > 0) {
            list = json.data as CivicIssue[];
            this.issues = list;
            this.notify();
            
            // Seed Firebase in background (non-blocking)
            if (firebaseAvailable) {
              list.forEach((s) => {
                setDoc(doc(db, "issues", s.id), s).catch((err) => {
                  console.warn("Error seeding issue to Firebase:", s.id, err);
                });
              });
            }
          }
        } catch (apiErr) {
          console.error("Error fetching from API:", apiErr);
          this.error = "Failed to load civic issues. Please check your connection.";
        }
      }

      // Setup real-time listener for Firebase updates (non-blocking)
      if (!this.unsubscribeSync && firebaseAvailable) {
        try {
          const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
          this.unsubscribeSync = onSnapshot(q, (snapshot) => {
            const updatedList: CivicIssue[] = [];
            snapshot.forEach((doc) => {
              updatedList.push(doc.data() as CivicIssue);
            });
            if (updatedList.length > 0) {
              this.issues = updatedList;
              this.notify();
            }
          }, (err) => {
            console.warn("Real-time Firebase sync error:", err);
          });
        } catch (err) {
          console.warn("Could not set up Firebase listener:", err);
        }
      }
    } catch (err: any) {
      console.error("fetchIssues error:", err);
      this.error = "Failed to load issues";
    } finally {
      this.loading = false;
      this.notify();
    }
  },

  async reportIssue(payload: Partial<CivicIssue>) {
    this.loading = true;
    this.notify();

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (json.success) {
        const newIssue = json.data as CivicIssue;
        
        // Save to Firestore!
        try {
          await setDoc(doc(db, "issues", newIssue.id), newIssue);
        } catch (fsErr) {
          console.error("Firestore save error on report:", fsErr);
          handleFirestoreError(fsErr, OperationType.WRITE, "issues/" + newIssue.id);
        }

        this.issues.unshift(newIssue);
        return { success: true, data: newIssue };
      } else {
        throw new Error(json.message || "Failed to submit civic report");
      }
    } catch (err: any) {
      console.error("reportIssue error:", err);
      return { success: false, error: err.message };
    } finally {
      this.loading = false;
      this.notify();
    }
  },

  async voteIssue(id: string) {
    try {
      const response = await fetch(`/api/issues/${id}/vote`, { method: "POST" });
      const json = await response.json();
      if (json.success) {
        this.issues = this.issues.map(issue => {
          if (issue.id === id) {
            const updatedIssue = {
              ...issue,
              votes: json.votes,
              karmaPoints: json.karmaPoints
            };

            // Sync with Firestore
            setDoc(doc(db, "issues", id), updatedIssue, { merge: true })
              .catch(err => {
                console.error("Firestore vote update error:", err);
                handleFirestoreError(err, OperationType.WRITE, "issues/" + id);
              });

            return updatedIssue;
          }
          return issue;
        });
        this.notify();
        return true;
      }
    } catch (err) {
      console.error("voteIssue error:", err);
    }
    return false;
  },

  async addComment(id: string, author: string, text: string) {
    try {
      const response = await fetch(`/api/issues/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, text })
      });
      const json = await response.json();
      if (json.success) {
        this.issues = this.issues.map(issue => {
          if (issue.id === id) {
            const updatedIssue = {
              ...issue,
              comments: [...issue.comments, json.data]
            };

            // Sync with Firestore
            setDoc(doc(db, "issues", id), updatedIssue, { merge: true })
              .catch(err => {
                console.error("Firestore comment update error:", err);
                handleFirestoreError(err, OperationType.WRITE, "issues/" + id);
              });

            return updatedIssue;
          }
          return issue;
        });
        notificationStore.add({ type: "status", title: `Issue status: ${status}`, detail: json.data?.title || "A tracked civic issue changed status." });
        this.notify();
        return true;
      }
    } catch (err) {
      console.error("addComment error:", err);
    }
    return false;
  },

  async updateStatus(id: string, status: "Reported" | "In Progress" | "Resolved", remarks?: string) {
    try {
      const response = await fetch(`/api/issues/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, remarks })
      });
      const json = await response.json();
      if (json.success) {
        this.issues = this.issues.map(issue => {
          if (issue.id === id) {
            const updatedIssue = json.data;

            // Sync with Firestore
            setDoc(doc(db, "issues", id), updatedIssue)
              .catch(err => {
                console.error("Firestore status update error:", err);
                handleFirestoreError(err, OperationType.WRITE, "issues/" + id);
              });

            return updatedIssue;
          }
          return issue;
        });
        this.notify();
        return true;
      }
    } catch (err) {
      console.error("updateStatus error:", err);
    }
    return false;
  }
};

import { useState, useEffect } from "react";

export function useIssueStore() {
  const [issues, setIssues] = useState<CivicIssue[]>(issueStore.issues);
  const [loading, setLoading] = useState<boolean>(issueStore.loading);
  const [error, setError] = useState<string | null>(issueStore.error);

  useEffect(() => {
    const unsubscribe = issueStore.subscribe(() => {
      setIssues([...issueStore.issues]);
      setLoading(issueStore.loading);
      setError(issueStore.error);
    });

    // Auto-fetch if empty
    if (issueStore.issues.length === 0) {
      issueStore.fetchIssues();
    }

    return unsubscribe;
  }, []);

  return {
    issues,
    loading,
    error,
    fetchIssues: () => issueStore.fetchIssues(),
    reportIssue: (payload: Partial<CivicIssue>) => issueStore.reportIssue(payload),
    voteIssue: (id: string) => issueStore.voteIssue(id),
    addComment: (id: string, author: string, text: string) => issueStore.addComment(id, author, text),
    updateStatus: (id: string, status: "Reported" | "In Progress" | "Resolved", remarks?: string) => issueStore.updateStatus(id, status, remarks)
  };
}
