import { getApps, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig, isFirebaseConfigured } from '../firebase/config';
import { Todo } from '../types';

const app = isFirebaseConfigured ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;
const auth = app ? getAuth(app) : null;
const firestore = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

export function isFirebaseReady() {
  return isFirebaseConfigured && auth !== null && firestore !== null && storage !== null;
}

export async function firebaseLogin(email: string, password: string) {
  if (!auth) {
    throw new Error('Firebase no está configurado');
  }
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function firebaseRegister(email: string, password: string) {
  if (!auth) {
    throw new Error('Firebase no está configurado');
  }
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function firebaseLogout() {
  if (!auth) {
    throw new Error('Firebase no está configurado');
  }
  await signOut(auth);
}

export async function syncTaskToFirebase(task: Todo) {
  if (!firestore) {
    throw new Error('Firebase Firestore no está disponible');
  }

  const taskRef = doc(collection(firestore, 'tasks'), task.id);
  const payload = {
    ...task,
    updatedAt: serverTimestamp(),
  };

  await setDoc(taskRef, payload, { merge: true });
  return task.id;
}

export async function uploadAttachmentToFirebase(taskId: string, userId: string, uri: string) {
  if (!storage) {
    throw new Error('Firebase Storage no está disponible');
  }

  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `task_attachments/${userId}/${taskId}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}
