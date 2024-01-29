import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../api/firebase'
import {
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth'
import {setDoc, doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext({ user: null, signUp: null, logIn: null, logOut: null }); // createContext의 기본값 설정

export function AuthContextProvider({children}) {
  const [user, setUser] = useState(null); // 초기 상태를 null로 설정

  async function signUp(email, password, authority) {
    const {user} = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', user.uid), { // Use user uid instead of email
      email: email,
      authority: authority,
      savedShows: []
    });
  }
  
  async function logIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password); 
    console.log(userCredential.user.email); // 로그인 성공 시 이메일 출력
    const user = userCredential.user;
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUser({ ...user, ...docSnap.data() });
      } else {
        console.log('No such document!');
      }
    }
  }
  
  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUser({ ...currentUser, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } else {
        setUser(null); // 로그아웃한 경우, user 상태를 null로 설정
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = { signUp, logIn, logOut, user };

  return (
    <AuthContext.Provider value={value}>
     {children}
    </AuthContext.Provider>
  )
}

export function UserAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) { // context가 undefined일 경우 에러 발생
    throw new Error('useAuth must be used within a AuthContextProvider');
  }
  return context;
}
