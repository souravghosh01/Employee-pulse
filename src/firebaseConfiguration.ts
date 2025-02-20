import { FirebaseError, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  connectAuthEmulator,
} from 'firebase/auth';
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import firebaseEmulatorConfig from '../firebase.json';

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_API_KEY ||
    'AIzaSyD1Y1Jb33a-DecxVe64bcIymPTpK-rzA7g',
  authDomain:
    process.env.NEXT_PUBLIC_AUTH_DOMAIN ||
    'employee-pulse-b2d2e.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || 'employee-pulse-b2d2e',
  storageBucket:
    process.env.NEXT_PUBLIC_STORAGE_BUCKET ||
    'employee-pulse-b2d2e.appspot.com',
  messagingSenderId:
    process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID || '964138853453',
  appId:
    process.env.NEXT_PUBLIC_APP_ID ||
    '1:964138853453:web:b5de62a8a7053f09e52804',
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID || 'G-J4KXG6KY31',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  connectAuthEmulator(
    auth,
    `http://localhost:${firebaseEmulatorConfig.emulators.auth.port}`
  );
  connectFirestoreEmulator(
    db,
    'localhost',
    firebaseEmulatorConfig.emulators.firestore.port
  );
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const docs = await getDoc(doc(db, 'users', user.uid));
    if (!docs.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      });
    }
  } catch (err) {
    if (
      err instanceof FirebaseError &&
      err.code === 'auth/account-exists-with-different-credential'
    ) {
      toast.error('The account already exists for that email.');
    } else {
      toast.error('Authentication failed!');
    }
  }
};

const signInWithGithub = async () => {
  try {
    const res = await signInWithPopup(auth, githubProvider);
    const user = res.user;
    const docs = await getDoc(doc(db, 'users', user.uid));

    if (!docs.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'github',
        email: user.email,
      });
    }
  } catch (err) {
    if (
      err instanceof FirebaseError &&
      err.code === 'auth/account-exists-with-different-credential'
    ) {
      toast.error('The account already exists for that email.');
    } else {
      toast.error('Authentication failed!');
    }
  }
};

const logInWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (err instanceof Error) toast.error('Authentication failed!');
  }
};

const registerWithEmailAndPassword = async ({
  name,
  email,
  password,
  changeDisplayName,
}: {
  name: string;
  email: string;
  password: string;
  changeDisplayName: (userName: string) => void;
}) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    changeDisplayName(name);

    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      authProvider: 'email',
      email,
    });
  } catch (err) {
    if (
      err instanceof FirebaseError &&
      err.code === 'auth/email-already-in-use'
    ) {
      toast.error('The account already exists for that email.');
    } else {
      toast.error('Registration failed!');
    }
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset link sent!');
  } catch (err) {
    if (err instanceof Error) toast.error('Password reset failed!');
  }
};

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  signInWithGoogle,
  signInWithGithub,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
