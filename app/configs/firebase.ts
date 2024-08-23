import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyByIoZqQx4cPa-BU6H1bAFsCMBC6U7KMrQ",
  authDomain: "kanban-board-ad650.firebaseapp.com",
  projectId: "kanban-board-ad650",
  storageBucket: "kanban-board-ad650.appspot.com",
  messagingSenderId: "1005242560703",
  appId: "1:1005242560703:web:d70f15b6250afea779160a"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, database, storage, db, auth };