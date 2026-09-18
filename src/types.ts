export interface Comment {
  author: string;
  text: string;
  date: string;
  authorRole?: "user" | "admin" | "authority" | "ai";
}

export interface IssueActivity {
  id: string;
  type: "reported" | "status" | "comment" | "vote";
  title: string;
  detail?: string;
  actor: string;
  createdAt: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: "Road Infrastructure" | "Sewage & Water" | "Electricity" | "Garbage & Waste" | "Traffic & Transit" | "Health & Sanitation";
  severity: "Critical" | "Medium" | "Low";
  department: string;
  status: "Reported" | "In Progress" | "Resolved";
  address: string;
  lat: number;
  lng: number;
  reporterName: string;
  reporterEmail: string;
  votes: number;
  comments: Comment[];
  activity?: IssueActivity[];
  createdAt: string;
  slaTime: string;
  karmaPoints: number;
  ward: string;
  state?: string;
  city?: string;
  image?: string | null;
  imageURL?: string | null;
  voice?: string | null;
}

export interface User {
  uid: string;
  role: "user" | "admin";
  name: string;
  email: string;
  photoURL?: string;
  ward?: string;
  city?: string;
  state?: string;
  karmaPoints: number;
  streak: number;
  reportedCount: number;
}

export interface Squad {
  id: string;
  name: string;
  city: string;
  memberCount: number;
  points: number;
  completedTasks: number;
  description: string;
}
