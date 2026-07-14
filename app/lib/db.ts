import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Listing {
  id: string;
  title: string;
  type: string;
  company: string;
  ciro: string;
  price: string;
  phone: string;
  desc: string;
  date: string;
  aiApproved: boolean;
  ownerUid: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: Timestamp;
}

export interface ChatMessage {
  id?: string;
  fromUid: string;
  fromName: string;
  text: string;
  time: string;
  createdAt: Timestamp;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  participantNames: string[];
  listingId: string;
  listingTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  updatedAt: Timestamp;
}

export async function createListing(data: Omit<Listing, "id" | "createdAt" | "aiApproved" | "date">): Promise<string> {
  const docRef = await addDoc(collection(db, "listings"), {
    ...data,
    aiApproved: true,
    date: new Date().toLocaleDateString("tr-TR"),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getListings(filters?: { type?: string; search?: string }): Promise<Listing[]> {
  let q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
  if (filters?.type && filters.type !== "Tümü") {
    q = query(q, where("type", "==", filters.type));
  }
  const snap = await getDocs(q);
  let results = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Listing));
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    results = results.filter(
      (l) => l.title.toLowerCase().includes(s) || l.company.toLowerCase().includes(s)
    );
  }
  return results;
}

export async function getListing(id: string): Promise<Listing | null> {
  const snap = await getDoc(doc(db, "listings", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Listing) : null;
}

export async function getOrCreateChatRoom(
  user1Uid: string,
  user1Name: string,
  user2Uid: string,
  user2Name: string,
  listingId: string,
  listingTitle: string
): Promise<string> {
  const chatId = [user1Uid, user2Uid].sort().join("_");
  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      id: chatId,
      participants: [user1Uid, user2Uid],
      participantNames: [user1Name, user2Name],
      listingId,
      listingTitle,
      lastMessage: "",
      lastMessageTime: "",
      updatedAt: serverTimestamp(),
    });
  }
  return chatId;
}

export async function sendMessage(chatId: string, msg: Omit<ChatMessage, "id" | "createdAt">): Promise<void> {
  const msgRef = await addDoc(collection(db, "chats", chatId, "messages"), {
    ...msg,
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, "chats", chatId), {
    lastMessage: msg.text,
    lastMessageTime: msg.time,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export function subscribeToMessages(
  chatId: string,
  callback: (msgs: ChatMessage[]) => void
): () => void {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage));
    callback(msgs);
  });
}

export async function getUserChats(uid: string): Promise<ChatRoom[]> {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatRoom));
}
