import { db, auth, storage } from "/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
    getDoc,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";



//--------------------------Sistema de logueo--------------------------

document.getElementById("signIn").addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailIniciarSesion = document.getElementById("correoSignIn").value;
    const passwordIniciarSesion = document.getElementById("contraseñaSignIn").value;

    try {
        const credentials = await signInWithEmailAndPassword(auth, emailIniciarSesion, passwordIniciarSesion);
        console.log("Logueado!");
        location.href = "index.html";

        //-------------Pasar cuenta de usuario al index------------
        document.getElementById("iniciarSesion").addEventListener("click", function () {
            const cuenta = document.getElementById("signIn").value
            localStorage.setItem("signIn", cuenta)

        })
    } catch (error) {
        console.log(error.code);
    }
})


//------------------------------Logueo con Google------------------------------

document.getElementById("googleBoton").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();

    try {
        const credentials = await signInWithPopup(auth, provider);
        const user = credentials.user;

        const userDocRef = await doc(db, "usuarios", user.uid);
        const userDoc = await getDoc(userDocRef);
        


        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                nombres: user.displayName,
                email: user.email,
                avatarURL: user.photoURL
            });
            location.reload(true);
        }
        
        const cuenta = document.getElementById("signIn").value
        localStorage.setItem("signIn", cuenta)
    
        location.href = "index.html";
        


    } catch (error) {
        console.log(error.code)
    }
})
/*
//-------------Pasar cuenta de usuario al index------------
document.getElementById("iniciarSesion").addEventListener("click", function () {
    const cuenta = document.getElementById("signIn").value
    localStorage.setItem("signIn", cuenta)

})*/