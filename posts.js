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
 import { resizeImage, formatoFechaHora} from "./utilitarios.js";


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

            
            //------------------------------Eliminar Post---------------------------------
            const btnsDelete = document.querySelectorAll(".btn-delete");

            btnsDelete.forEach((btn)=>{
                btn.addEventListener("click", async (e) => {
                    try{
                        await deletePost(e.target.dataset.id)
                    }catch(error){
                        alert(error.code)
                    }
                } )
            })


            //----------------------------Editar Post------------------------------
            const btnsEdit = document.querySelectorAll(".btn-edit");

            btnsEdit.forEach((btn) => {
                btn.addEventListener("click", async (e) => {
                    id = e.target.dataset.id;
                    const doc = await getPost(id);
                    const post = doc.data();

                    const titulo = post.titulo;
                    const contenido = post.contenido;

                    //-------------Mostrar el modal-------------
                    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-editPost"))
                    modal.show();

                    //-----------Contenido del modal-----------

                    document.getElementById("editPost-titulo").value = titulo;
                    document.getElementById("editPost-description").value = contenido;

                    document.getElementById("editImage").innerHTML = `<img style="width:100%" src="${downloadURL}`;

                })
            })

             //----------------------------Likear Post-----------------------------

            const btnsLike = document.querySelectorAll(".btn-like");

            btnsLike.forEach((btn) => {
                btn.addEventListener("click", async(e) => {
                    let id = btn.getAttribute("data-id");

                    const doc = await getPost(id);
                    const post = doc.data();

                    //------------------Dislike--------------------

                    if(post.personasLiked.includes(userEmail)){
                        post.personasLiked = post.personasLiked.filter(email => email != userEmail);

                    }else{
                        post.personasLiked.push(userEmail);
                    }

                    updatePost(id,post);

                })
            })
        })
    }else{
        listaPost.innerHTML = "Debes loguearte para ver los posts"
    }
 })


 //----------------------Pintar Post en el html--------------------

 function pintarPost(datos){
    if(datos.length){
        let html = "";
        datos.forEach(doc => {
            const post = doc.data()
            let iconoLike = "";

            if(post.personasLiked.includes(userEmail)){
                iconoLike = `<i class="bi bi-suit-heart-fill"></i>`
            }else{
                iconoLike = `<i class="bi bi-suit-heart"></i>`
            }

            

            const li = `
                <li class="list-group-item list-group-item-action list-group-item-dark">
                <h5>${post.userEmail} posteó: </h5>
                <p>${formatoFechaHora(post.fecha.toDate())}</p>
                <h5>${post.titulo}</h5>
                <p>${post.contenido}</p>
                <img src="${post.imagenURL}" style="width:100%" />
                <button class="btn-delete" data-id="${doc.id}">Borrar</button>
                <button class="btn-edit" data-id="${doc.id}">Editar</button>
                <button class="btn-like" data-id="${doc.id}">${iconoLike}</button>
                <p>A ${post.personasLiked.length} les gusta esto</p>
                </li>
            `
            html += li
        })
        listaPost.innerHTML = html
    }else{
        listaPost.innerHTML = `<h1>Aun no hay posts que mostrar</h1>`
    }
 }

 //-------------------------------Pintar post de otros usuarios en html--------------------------------------

 function pintarPostOtros(datos){
    if(datos.length){
        let html = "";
        datos.forEach(doc => {
            const post = doc.data()
            let iconoLike = "";

            if(post.personasLiked.includes(userEmail)){
                iconoLike = `<i class="bi bi-suit-heart-fill"></i>`
            }else{
                iconoLike = `<i class="bi bi-suit-heart"></i>`
            }

            const li = `
                <li class="list-group-item list-group-item-action list-group-item-dark">
                <h5>${post.userEmail} posteó: </h5>
                <p>${formatoFechaHora(post.fecha.toDate())}</p>
                <h5>${post.titulo}</h5>
                <p>${post.contenido}</p>
                <img src="${post.imagenURL}" style="width:100%"/>
                <button class="btn-delete" data-id="${doc.id}">Borrar</button>
                <button class="btn-edit" data-id="${doc.id}">Editar</button>
                <button class="btn-like" data-id="${doc.id}>${iconoLike}</button>
                <p>A ${post.personasLiked.length} les gusta esto</p>
                </li>
            `
            html += li
        })
        listaPostOtros.innerHTML = html
    }else{
        listaPostOtros.innerHTML = `<h1>Aun no hay posts que mostrar</h1>`
    }
 }


 //-----------------------------Crear Post----------------------------------

 const postForm = document.getElementById("createPost")
 postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("createPost-titulo").value;
    const contenido = document.getElementById("createPost-description").value;
    const imagenURL = downloadURL;
    const fecha = new Date();
    const personasLiked=[];


    savePost(titulo, contenido, imagenURL, fecha, userEmail, personasLiked);

    postForm.reset();
    document.getElementById("uploadedImage").innerHTML= "";

    const modal = bootstrap.Modal.getInstance(document.getElementById("modal-crearPost"));
    modal.hide();
 })

 //---------------------------Funcion savePost--------------------------------

 const savePost = (titulo,contenido, imagenURL, fecha, userEmail, personasLiked) =>{
    addDoc(collection(db, "posts"), {titulo, contenido, imagenURL, fecha, userEmail, personasLiked})
 }

 //--------------------------Funcion eliminar Post------------------------------------

 const deletePost = (id) => deleteDoc(doc(db, "posts", id))
 const getPost = (id) => getDoc(doc(db, "posts", id))

 //---------------------------Funcion actualizar Post--------------------------------

 const updatePost = (id, newFields) => updateDoc(doc(db, "posts", id), newFields);

 //---------------------------Actualizar Post-----------------------------------------

 const editarPostForm = document.getElementById("editPost");

 editarPostForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("editPost-titulo").value;
    const contenido = document.getElementById("editPost-description").value;
    const imagenURL = downloadURL;

    updatePost(id,{titulo, contenido, imagenURL});

    editarPostForm.reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById("modal-editPost"));
    modal.hide();
 })


 //-----------------------------Subir imagen (Crear Post)---------------------------------------

 document.getElementById("fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if(file){
        try{
            downloadURL = await uploadImage(file);
            document.getElementById("uploadedImage").innerHTML = `
            <img src="${downloadURL}" alt="imagen subida" style="width:100%">
            `
        }catch(error){
            console.log("Error de carga:", error);
        }
    }else{
        alert("Por favor, seleccione un archivo");
    }
 });
 async function uploadImage(file){
    const resizedImage = await resizeImage(file, 500, 500);
    const storageRef = ref(storage, `images/${file.name}`);

    await uploadBytes(storageRef, resizedImage);

    return getDownloadURL(storageRef);
 }

 //----------------------------------Subir Imagen (Editar Post)---------------------------------------

 document.getElementById("fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if(file){
        try{
            downloadURL =  await uploadImage(file);  //Se optiene la url de la imagen
            document.getElementById("editImage").innerHTML = `
                <img src="${downloadURL}" alt="imagen subida" style="width:100%">
            `
        }catch(error){
            console.error("Error de carga:", error);
        }
    }else{
        alert("Por favor, selecciona un archivo");
    }
});
 
 