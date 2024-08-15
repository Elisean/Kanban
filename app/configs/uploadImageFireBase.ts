import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

async function uploadImage(file: File) {
  const storageRef = ref(storage, file.name);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export default uploadImage;