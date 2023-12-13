import { signOut } from "firebase/auth";
import { auth } from "../login";

/* ID HTML */
const logout = document.getElementById("singOut");

/* Sing Out */
document.addEventListener("DOMContentLoaded", function () {
  logout.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "../login/index.html";
      console.log("Sign Out");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  });
}); 

