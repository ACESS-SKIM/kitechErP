import { doc, getDoc } from 'firebase/firestore';
import { db } from '../api/firebase';

export async function getItemsByUser(user, collectionName) {
  console.log(collectionName);
  const userDocRef = doc(db, collectionName, user.uid);
  const docSnapshot = await getDoc(userDocRef);

  if (docSnapshot.exists()) {
    return docSnapshot.data();
  } else {
    return null; // 혹은 적절한 에러 처리
  }
}