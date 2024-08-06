import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const saveUserData = async (userId: string, data: any) => {
  try {
    await firebase.firestore().collection('users').doc(userId).set(data, { merge: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserData = async (userId: string) => {
  try {
    const userDoc = await firebase.firestore().collection('users').doc(userId).get();
    return userDoc.exists ? userDoc.data() : null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
