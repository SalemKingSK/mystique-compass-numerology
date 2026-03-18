import { initializeFirebase } from '@/firebase';

const firebaseServices = initializeFirebase();

export const db = firebaseServices.firestore;
export const auth = firebaseServices.auth;
export const app = firebaseServices.firebaseApp;
