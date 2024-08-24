import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const storage = getStorage();
const auth = getAuth();


export const uploadUserImage = async (file:File) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const userId = user.uid;
  const storageRef = ref(storage, `users/${userId}/avatar.jpg`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};


export const getUserImageURL = async (userId: string) => {
  const storageRef = ref(storage, `users/${userId}/avatar.jpg`);
  try {
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'storage/object-not-found') {
        console.log('Image does not exist.');
      } else {
        console.error('There was an error fetching the image:', error.message);
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }
    return null;
  }
};