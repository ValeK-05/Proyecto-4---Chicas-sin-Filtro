import{db,auth,storage} from "./firebase.js";
import{createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import{onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import{signOut} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js"; 
import{signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { 
    ref,    //Guardar la referencia de la carpeta donde se subira la imagen
    uploadBytes,    //Sube la imagen a la referencia indicada
    getDownloadURL,    //Consigue la URL del archivo subido
  } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";
  import {
    getDoc,
    doc,
    setDoc
  } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
  import { resizeImage } from "./utilitarios.js";

  //Variable global

  let avatarURL = "";

//---------------------------Evento Sign Up---------------------------

document.getElementById("signUp").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("contraseña").value;
    const pais = document.getElementById("paisInput").value;
    const descripcionUsuario = document.getElementById("descripcionUsuario").value;

    try{
        const credentials = await createUserWithEmailAndPassword(auth,email,password);
        const user = credentials.user;
        
        await setDoc(doc(db,"usuarios",user.uid),{
            email: email,
            password: password,
            pais: pais,
            descripcionUsuario: descripcionUsuario,
            avatarURL: avatarURL
        });
        console.log("creado");
        location.href = "index.html";

        //-------------Pasar cuenta de usuario al index------------
        document.getElementById("registrarse").addEventListener("click", function(){
          const cuenta = document.getElementById("signUp").value
          localStorage.setItem("signUp", cuenta)
          
        })
    }catch(error){
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("ERROR!")

        //------Tratamiento de errores------
        if(error.code==="auth/email-already-in-use"){
            alert("Este usuario ya existe!")
          }else if(error.code==="auth/weak-password"){
            alert("Su contraseña debe contener como minimo seis caracteres")
          }else if(error.code==="auth/invalid-email"){
            alert("El email debe ser valido!")
          }
    }
});

//------------------------------Subir imagen de avatar------------------------------

document.getElementById("signup-avatar").addEventListener('change', async (e) => {
    const file = e.target.files[0];

    if(file){
        const resizedAvatar = await resizeImage(file, 150, 150);
        const avatarPatch = `avatars/${resizedAvatar.name}`
        await uploadBytes(ref(storage, avatarPatch),resizedAvatar);
        avatarURL = await getDownloadURL(ref(storage,avatarPatch));
        document.getElementById('uploaded-avatar').innerHTML = `<img src="${avatarURL}" alt="imagen subida" style="width:100px">`
    }else{
        alert("Por favor, seleccione un archivo");
    }
});


//--------------------------Sistema de deslogueo--------------------------

document.getElementById("logout").addEventListener("click", async()=>{
  await signOut(auth);
  console.log("cerró sesión")
})





