import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase/firebaseConfig";

export const auth = getAuth(app);

/* ID HTML */
const singnUpForm = document.querySelector("#sigup-form");

/* User Autentication */
if (singnUpForm) {
  singnUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = singnUpForm['sigup-email'].value //document.querySelector("#sigup-email").value;
    const password = singnUpForm['sigup-password'].value; //document.querySelector("#sigup-password").value;

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("user logge in: ", user);
        window.location.href = "../home/user-home.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case 'auth/invalid-credential':
            console.log("COrreo o COntraseña es incorrecta")
            break;

          case 'auth/invalid-email':
            console.log("Email Invalido");
            break;

          case 'auth/wrong-password':
            console.log("contraseña incorrecta");
            break;

          case 'auth/user-disabled':
            console.log("Cuenta baneada");
            break;

          case 'auth/user-not-found':
            console.log("No se Encontro el email");
            break;

          case 'auth/network-request-failed':
            console.log("Problema de conexion");
            break;

          case 'auth/too-many-requests':
            console.log("Muchos intentos fallidos");
            break;

          default:
            console.log(`Error: ${errorCode}, Mensaje: ${errorMessage}`);
        }
      });

  });
} else console.log("No se encontro el id");

/* Verificacion de Inicio de seseion */
await onAuthStateChanged(auth, async (user) => {
  let isLoggedIn = user !== null;
  let currentPage = window.location.pathname.split('/').pop();

  if (isLoggedIn && currentPage !== 'user-home.html') {
    const uid = user.uid;

    console.log("Usuario encontrado: ", user);
    window.location.href = "../home/user-home.html";
  }

  if (!isLoggedIn && currentPage !== 'index.html') {
    console.log("usuario no encontrado o autenticado");
    window.location.href = "../login/index.html";
  }

});
