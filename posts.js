import {
    getDocs,
    getDoc,
    collection,
    doc,
    addDoc,      //Agrega un documento a la colección
    onSnapshot,  
    deleteDoc,   //Elimina un documento de una colección
    updateDoc   //Actualiza un documento de una colección
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { db, auth, storage } from "./firebase.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { 
    ref,    //Guardar la referencia de la carpeta donde se subira la imagen
    uploadBytes,    //Sube la imagen a la referencia indicada
    getDownloadURL,    //Consigue la URL del archivo subido
    deleteObject,    //Elimina un archivo de una ubicacion con su
 } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";
 import { resizeImage, formatoFechaHora } from "./utilitarios.js";


 //---------------------Cargar posts al autenticarse-----------------------

 const listaPost = document.getElementById("posts");
 const listaPostOtros = document.getElementById("posts-otros")
 let id = "";
 let downloadURL = "";
 let userEmail = "";
 let usuarioId = "";

 onAuthStateChanged(auth, async (user) => {

    const docUser = await getDoc(doc(db, "usuarios", user.uid));
    const usuario = docUser.data();
    usuarioId = docUser.id;
    document.getElementById("fotoUsuario").src = usuario.avatarURL;

    if(user){
        const docUser = await getDoc(doc(db,"usuarios", user.uid));
        const usuario = docUser.data();
        usuarioId = docUser.id;
        document.getElementById("fotoUsuario").src = usuario.avatarURL;

        userEmail = user.email;

        await onSnapshot(collection(db, "posts"), async(Querysnapshot)=>{
            var documentos = Querysnapshot.docs;

            //Columna Mis Posts
            let misPosts = documentos.filter(function(doc){return user.email== doc.data().userEmail});
            pintarPost(misPosts);

            //Columna Otros Posts
            let otrosPosts = documentos.filter(function(doc){return user.email !== doc.data().userEmail});
            pintarPostOtros(otrosPosts);
        })
    }
 })