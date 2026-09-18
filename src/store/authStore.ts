import { User } from "../types";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut as firebaseSignOut, getIdTokenResult, type User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

// Helper to load state from localStorage
const getStoredUser = (): User | null => {
  const stored = localStorage.getItem("civic_admin") || localStorage.getItem("civic_user");
  if (stored) {
    try {
      return { role: "user", ...JSON.parse(stored) };
    } catch {
      return null;
    }
  }
  return null;
};

let currentListeners: (() => void)[] = [];

function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Firestore request timed out")), timeoutMs);
    })
  ]);
}

async function hydrateFirebaseSession(firebaseUser: FirebaseUser) {
  try {
    const tokenResult = await getIdTokenResult(firebaseUser);
    const roleFromClaim = tokenResult.claims.role === "admin" || tokenResult.claims.admin === true;
    const configuredAdmins = (import.meta.env.VITE_ADMIN_EMAILS || "")
      .split(",")
      .map((email: string) => email.trim().toLowerCase())
      .filter(Boolean);
    const adminByEmail = configuredAdmins.includes((firebaseUser.email || "").toLowerCase());

    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userSnapshot = await withTimeout(getDoc(userDocRef));
    const existingUser = userSnapshot.exists() ? (userSnapshot.data() as Partial<User>) : null;

    const mergedUser: User = {
      uid: firebaseUser.uid,
      role: roleFromClaim || adminByEmail || existingUser?.role === "admin" ? "admin" : "user",
      name: existingUser?.name || firebaseUser.displayName || "Civic Hero",
      email: existingUser?.email || firebaseUser.email || "",
      photoURL: existingUser?.photoURL || firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.displayName || "Hero")}`,
      ward: existingUser?.ward || "General Ward",
      state: existingUser?.state || "Karnataka",
      city: existingUser?.city || "Bengaluru",
      karmaPoints: existingUser?.karmaPoints ?? 100,
      streak: existingUser?.streak ?? 1,
      reportedCount: existingUser?.reportedCount ?? 0
    };

    authStore.user = mergedUser;
    if (mergedUser.role === "admin") {
      localStorage.setItem("civic_admin", JSON.stringify(mergedUser));
      localStorage.removeItem("civic_user");
    } else {
      localStorage.removeItem("civic_admin");
      localStorage.setItem("civic_user", JSON.stringify(mergedUser));
    }

    await withTimeout(setDoc(userDocRef, { ...mergedUser, role: mergedUser.role }, { merge: true }));
    authStore.notify();
    return mergedUser;
  } catch (error) {
    console.error("Error hydrating Firebase auth session:", error);
    return null;
  }
}

if (typeof window !== "undefined") {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      await hydrateFirebaseSession(firebaseUser);
      return;
    }

    authStore.user = null;
    localStorage.removeItem("civic_user");
    localStorage.removeItem("civic_admin");
    authStore.notify();
  });
}

export const authStore = {
  user: getStoredUser(),

  subscribe(listener: () => void) {
    currentListeners.push(listener);
    return () => {
      currentListeners = currentListeners.filter(l => l !== listener);
    };
  },

  notify() {
    currentListeners.forEach(listener => listener());
  },

  async signIn(name: string, email: string, state: string, city: string, ward: string, uid?: string, photoURL?: string) {
    let userId = uid;
    let existingUser: User | null = null;

    // If no stable uid is provided but an email is, look up by email first to keep data persistent across devices!
    if (!userId && email) {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          userId = docSnap.id;
          existingUser = docSnap.data() as User;
        }
      } catch (e) {
        console.error("Error looking up user by email in Firestore:", e);
      }
    }

    if (!userId) {
      userId = "user-" + Date.now();
    }

    try {
      const userDocRef = doc(db, "users", userId);
      const userSnapshot = await withTimeout(getDoc(userDocRef));
      if (userSnapshot.exists()) {
        existingUser = userSnapshot.data() as User;
      }
    } catch (e) {
      console.error("Error reading user from firestore:", e);
    }

    const finalUser: User = {
      uid: userId,
      role: "user",
      name: name || existingUser?.name || "Civic Hero",
      email: email || existingUser?.email || "",
      photoURL: photoURL || existingUser?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || "Hero")}`,
      ward: ward || existingUser?.ward || "General Ward",
      state: state || existingUser?.state || "Karnataka",
      city: city || existingUser?.city || "Mumbai",
      karmaPoints: existingUser?.karmaPoints !== undefined ? existingUser.karmaPoints : 100,
      streak: existingUser?.streak !== undefined ? existingUser.streak : 1,
      reportedCount: existingUser?.reportedCount !== undefined ? existingUser.reportedCount : 0
    };

    this.user = finalUser;
    localStorage.removeItem("civic_admin");
    localStorage.setItem("civic_user", JSON.stringify(finalUser));

    try {
      const userDocRef = doc(db, "users", userId);
      await withTimeout(setDoc(userDocRef, finalUser, { merge: true }));
    } catch (e) {
      console.error("Error writing user to firestore:", e);
    }

    this.notify();
    return finalUser;
  },

  signInAdmin(uid: string, email: string) {
    const adminUser: User = {
      uid,
      role: "admin",
      name: "Municipal Administrator",
      email,
      city: "Bengaluru",
      ward: "Administration",
      karmaPoints: 0,
      streak: 0,
      reportedCount: 0
    };

    this.user = adminUser;
    localStorage.removeItem("civic_user");
    localStorage.setItem("civic_admin", JSON.stringify(adminUser));
    this.notify();
    return adminUser;
  },

  async signOut() {
    this.user = null;
    localStorage.removeItem("civic_user");
    localStorage.removeItem("civic_admin");
    await firebaseSignOut(auth).catch(error => console.warn("Firebase sign-out failed:", error));
    this.notify();
  },

  async addKarma(points: number) {
    if (this.user) {
      this.user.karmaPoints += points;
      localStorage.setItem("civic_user", JSON.stringify(this.user));
      this.notify();

      try {
        const userDocRef = doc(db, "users", this.user.uid);
        await updateDoc(userDocRef, { karmaPoints: this.user.karmaPoints });
      } catch (e) {
        console.error("Error updating karma in Firestore:", e);
      }
    }
  },

  async incrementReports() {
    if (this.user) {
      this.user.reportedCount += 1;
      this.user.karmaPoints += 50; // reward for reporting
      this.user.streak += 1; // boost streak
      localStorage.setItem("civic_user", JSON.stringify(this.user));
      this.notify();

      try {
        const userDocRef = doc(db, "users", this.user.uid);
        await setDoc(userDocRef, {
          reportedCount: this.user.reportedCount,
          karmaPoints: this.user.karmaPoints,
          streak: this.user.streak
        }, { merge: true });
      } catch (e) {
        console.error("Error updating reports in Firestore:", e);
      }
    }
  }
};

// React hook to use the auth store easily
import { useState, useEffect } from "react";

export function useAuthStore() {
  const [user, setUser] = useState<User | null>(authStore.user);

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setUser(authStore.user);
    });
    return unsubscribe;
  }, []);

  return {
    user,
    userData: user,
    signInUser: (name: string, email: string, state: string, city: string, ward: string, uid?: string, photoURL?: string) => authStore.signIn(name, email, state, city, ward, uid, photoURL),
    signInAdmin: (uid: string, email: string) => authStore.signInAdmin(uid, email),
    signOutUser: () => authStore.signOut(),
    addKarma: (points: number) => authStore.addKarma(points),
    incrementReports: () => authStore.incrementReports()
  };
}
