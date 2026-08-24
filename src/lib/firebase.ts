import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCn81BcBqZV-gimjdZmwswSYWunyPx02rw',
  authDomain: 'lifehubcentral.firebaseapp.com',
  projectId: 'lifehubcentral',
  storageBucket: 'lifehubcentral.firebasestorage.app',
  messagingSenderId: '123507221251',
  appId: '1:123507221251:web:d76e49b06fb83964dd7f36',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged, signOut };

export type ToolkitBackup = {
  version: 1;
  exportedAt: string;
  localStorage: Record<string, string>;
};

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  return result.user;
}

export function collectToolkitBackup(): ToolkitBackup {
  const localStorageData: Record<string, string> = {};
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith('safespace_')) {
      const value = window.localStorage.getItem(key);
      if (value !== null) localStorageData[key] = value;
    }
  }
  return { version: 1, exportedAt: new Date().toISOString(), localStorage: localStorageData };
}

export async function backupToolkit(userId: string): Promise<void> {
  await setDoc(doc(db, 'users', userId, 'mental_health_toolkit', 'backup'), collectToolkitBackup());
}

export async function restoreToolkitBackup(userId: string): Promise<boolean> {
  const snapshot = await getDoc(doc(db, 'users', userId, 'mental_health_toolkit', 'backup'));
  const backup = snapshot.data() as ToolkitBackup | undefined;
  if (!backup?.localStorage) return false;
  Object.entries(backup.localStorage).forEach(([key, value]) => window.localStorage.setItem(key, value));
  return true;
}
