import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const singnUpForm = document.querySelector('#sigup-form')
singnUpForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = singnUpForm.email.value
  const password = singnUpForm.password.value

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("user logge in: ", user)
    // ...
  })
  .catch((error) => {
    /* const errorCode = */
    console.log("user logge in: ",error.code);
    /* const errorMessage = */ 
    console.log("user logge in: ", error.message);
  });

})