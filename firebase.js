 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
  import {getFirestore} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
  import {getStorage} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";
 // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDmNqpkJO590cNAKbwFuDRTxOMvhVgAB5w",
    authDomain: "proyecto4-chicassinfiltro.firebaseapp.com",
    projectId: "proyecto4-chicassinfiltro",
    storageBucket: "proyecto4-chicassinfiltro.appspot.com",
    messagingSenderId: "598842697266",
    appId: "1:598842697266:web:f3a9c68c5da408908abe2b",
    measurementId: "G-BEJNJ7F8L9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

//Inicializar Autenticación
export const auth = getAuth(app);

//Inicializar firestore
export const db = getFirestore(app);

//Inicializar storage
export const storage = getStorage(app);


