import {auth} from "./firebase.js"
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import{signOut} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";



onAuthStateChanged(auth, async (user) => {
    const outlinks=document.querySelectorAll(".logged-out");
  const inlinks=document.querySelectorAll(".logged-in");

  console.log(outlinks);
  console.log(inlinks);

  if(user){
    outlinks.forEach(link=>link.style.display="none");
    inlinks.forEach(link=>link.style.display="block");
  }else{
    inlinks.forEach(link=>link.style.display="none");
    outlinks.forEach(link=>link.style.display="block");
  }
})

//---------------Sistema de deslogueo index---------------

document.getElementById("logout").addEventListener("click", async()=>{
  await signOut(auth);
  console.log("cerró sesión")
})