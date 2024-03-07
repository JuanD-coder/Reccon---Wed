import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase/firebaseConfig";
import { getUserData } from "../../components/getUserData";

export const auth = getAuth(app);

const signUpForm = document.querySelector("#sigup-form");
const errorMessage = document.getElementById("error-message");
const container = document.querySelector("#container");
const registerBtn = document.querySelector("#register");
const loginBtn = document.querySelector("#login");

if(!registerBtn && loginBtn){
  registerBtn.addEventListener("click", () => {
    container.classList.add("active");
  });
  
  loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
  });
}
 
/* User Autentication */
const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user;

    window.location.href = "../home/user-home.html";
    return user;

  } catch (error) {
    const errorCode = error.code;
    const errorMessageText = handleAuthError(errorCode);
    
    errorMessage.style.display = "block";
    return errorMessage.textContent = errorMessageText;
  }
};

/* Manejar Errores */
const handleAuthError = (error) => {

  switch (error) {
    case 'auth/invalid-credential':
      return "Correo o Contraseña es incorrecta";

    case 'auth/invalid-email':
      return "Email Invalido"

    case 'auth/wrong-password':
      return "Contraseña incorrecta"

    case 'auth/user-disabled':
      return "Cuenta baneada";

    case 'auth/user-not-found':
      return "No se Encontro el email";

    case 'auth/network-request-failed':
      return "Problema de conexion";

    case 'auth/too-many-requests':
      return "Muchos intentos fallidos";

    default:
      return `Error: ${errorCode}, Mensaje: ${errorMessage}`;
  }
};

/* funcion para verificar el estado de autenticacion */
export const checkAuthState = async () => {
  const user = await new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
  });

  const isLoggedIn = user !== null;
  const currentPage = window.location.pathname.split('/').pop();

  if (isLoggedIn && currentPage == 'index.html') {
    const uid = user.uid;
    console.log("Usuario encontrado:", uid);
    await getUserData(uid);

    window.location.href = "../home/user-home.html";
  }

  if (!isLoggedIn && currentPage !== 'index.html') {
    console.log("Usuario no autenticado o no encontrado");
    window.location.href = "../login/index.html";
  }

  return user.uid;
};

/* Manejar envio y evento del Login */
if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signUpForm['sigup-email'].value //document.querySelector("#sigup-email").value;
    const password = signUpForm['sigup-password'].value; //document.querySelector("#sigup-password").value;

    await handleSignIn(email, password);
  });
}

/* Verificar el estado del usuario */
checkAuthState();
