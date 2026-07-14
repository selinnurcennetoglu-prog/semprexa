/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "firebase/auth" {
  interface FirebaseUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    phoneNumber: string | null;
  }
  export function getAuth(app?: any): any;
  export function onAuthStateChanged(auth: any, callback: (user: FirebaseUser | null) => void): () => void;
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<{ user: FirebaseUser }>;
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<{ user: FirebaseUser }>;
  export function signOut(auth: any): Promise<void>;
  export function updateProfile(user: any, profile: { displayName?: string }): Promise<void>;
  export function sendPasswordResetEmail(auth: any, email: string): Promise<void>;
  export const browserLocalPersistence: any;
  export function setPersistence(auth: any, persistence: any): Promise<void>;
}

declare module "firebase/firestore" {
  export function getFirestore(app?: any): any;
  export function collection(db: any, path: string, ...pathSegments: string[]): any;
  export function doc(db: any, path: string, ...pathSegments: string[]): any;
  export function addDoc(collectionRef: any, data: any): Promise<{ id: string }>;
  export function setDoc(docRef: any, data: any, options?: any): Promise<void>;
  export function getDoc(docRef: any): Promise<{ exists: () => boolean; data: () => any; id: string }>;
  export function getDocs(query: any): Promise<{ docs: Array<{ id: string; data: () => any }>; empty: boolean }>;
  export function updateDoc(docRef: any, data: any): Promise<void>;
  export function deleteDoc(docRef: any): Promise<void>;
  export function query(collectionRef: any, ...constraints: any[]): any;
  export function where(field: string, op: string, value: any): any;
  export function orderBy(field: string, direction?: string): any;
  export function onSnapshot(query: any, callback: (snapshot: { docs: Array<{ id: string; data: () => any }> }) => void): () => void;
  export function serverTimestamp(): any;
  export class Timestamp {
    seconds: number;
    nanoseconds: number;
  }
}

declare module "firebase/app" {
  export function initializeApp(config: any): any;
  export function getApps(): any[];
}
