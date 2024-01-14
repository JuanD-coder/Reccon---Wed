import { signOut } from "firebase/auth";

import { auth, checkAuthState } from "../login";
import { consultarDatosLotes, getUserData, getDataSettings, getNameRecolector, getCollecionRecolector } from "../../components/getUserData";

/* ID HTML */
const logout = document.getElementById("singOut");
const textUser = document.getElementById("userName");
const priceFeed = document.getElementById("yesFeeding");
const priceNotFeed = document.getElementById("notFeeding");

const userID = await checkAuthState();
const getData = await getUserData(userID);
const getUserSettings = await getDataSettings(userID);
const getNameRecolectors = await getNameRecolector(userID);


textUser.textContent = getData.user_name
/* obtenerIDsDocumentosLotes(userID) */
consultarDatosLotes(userID)

/* Sing Out */
logout.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../login/index.html";
    console.log("Sign Out");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});

/* Recorrer los documentos de la subcolección */
getUserSettings.forEach((doc) => {
  const userData = doc.data()

  if (userData.state == "active") {
    if (userData.aliment == "yes") {
      priceFeed.textContent = `$${userData.price}`
    } else {
      priceNotFeed.textContent = `$${userData.price}`
    }
  }

});

async function generaraElemento() {
  var contenedor = document.getElementById('cardRecolector');
  contenedor.innerHTML = '';

  getNameRecolectors.forEach(async (doc) => {
    var recolectorData = doc.data();
    var recolectorID = doc.id

    try {
      const querySnapshot = await getCollecionRecolector(userID, recolectorID);
      let totalKG = 0

      let nuevoDiv = document.createElement('div');
        nuevoDiv.innerHTML = `  
        <div class="card recolectors">
          <div class="card-header recolection-header">
            <img src="/src/assets/images/icons/ic_recolector.svg" alt="recolector" class="name_recolector">
            <h2 id="recolectorName">${recolectorData.recolector_name}</h2>
          </div>
          <div class="card-body recolection-body">
            <div class="card-left">
                <!-- <a href="https://www.flaticon.es/iconos-gratis/granos-de-cafe" title="granos-de-cafe iconos">Granos-de-cafe iconos creados por Freepik - Flaticon</a> -->
                <img src="/src/assets/images/icons/bolsa-de-cafe.png" alt="granos-de-cafe" width="45px">
                <p>Detalle</p>
            </div>
            <div class="card-right">
                <h1>${querySnapshot} KG</h1>
                <p>Total Recolectado</p>
            </div>
          </div>
        </div>`;
        contenedor.appendChild(nuevoDiv);
        
    } catch (error) { console.error('Error al obtener datos de recolecciones:', error); }
  });
}

generaraElemento();

