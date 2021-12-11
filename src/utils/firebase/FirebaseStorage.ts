import { FirebaseApp } from '@firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import initializeFirebase from './InitializeFirebase';
import fs from 'fs';
import { Sounds } from '../sounds';
import { join } from 'path';
// Get a reference to the storage service, which is used to create references in your storage bucket

const app: FirebaseApp = initializeFirebase();
const storage = getStorage(app);

Sounds.forEach(async (clip) => {
  let soundFile: Blob | ArrayBuffer;
  try {
    soundFile = fs.readFileSync(join(__dirname + '/../../assets/', clip.filename));
  } catch (error) {
    throw new Error(`Could not import sounds file, Error: ${error}`);
  }

  try {
    const storageRef = ref(storage, `clips/${clip.filename}`);
    await uploadBytes(storageRef, soundFile);
    console.log(`Successfully uploaded ${clip.filename} to Firebase`);
  } catch (error) {
    throw new Error(`Could not upload file to firebase storage, Error: ${error}`);
  }
});
