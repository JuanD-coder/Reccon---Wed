import { signOut } from "firebase/auth";
import { auth, checkAuthState } from "../login";
import { getUserData, lotes, settings } from "../../components/getUserData";

/* ID HTML */
const logout = document.getElementById("singOut");
const textUser = document.getElementById("userName");
const priceFeed = document.getElementById("yesFeeding");
const priceNotFeed = document.getElementById("notFeeding");
const cardReport = document.getElementById("card-informe");
const cardHarvest = document.getElementById("card-recoleccion");
const toggleBtn = document.getElementById("toggle-btn");
const toggleBtnIcon = document.getElementById("toggle-btn i");
const dropDownMenu = document.getElementById("dropdown-menu");
const contenedor = document.getElementById('container-lotes');

export const userID = await checkAuthState();
const lotesInfo = new lotes(userID);
const settingsInfo = new settings(userID)
const getData = await getUserData(userID);
const getUserSettings = await settingsInfo.getSettings(userID);
const getNameLotes = await lotesInfo.getLotesData();

/* Show Lotes */
getNameLotes.forEach((doc) => {
  let lotes = doc.data();
  let nameLoteDiv = document.createElement('div')
  nameLoteDiv.classList.add('show-lotes')
  nameLoteDiv.innerHTML = `
  <div class="right">
    <p>${lotes.lote_name}</p>
    <span><b>Variedad: </b>${lotes.type}</span>  
  </div>
    <img src="/src/assets/images/icons/granja.png" alt="lotes" width="45px">`

  if (contenedor) contenedor.appendChild(nameLoteDiv);
})

if (textUser) textUser.textContent = getData.user_name

if (cardReport) cardReport.addEventListener('click', function () {
  window.location.href = '../informes/informes.html';
});

if (cardHarvest) cardHarvest.addEventListener('click', function () {
  window.location.href = '../recoleccion/recoleccion.html'
});

/* Sing Out */
if (logout) logout.addEventListener("click", async () => {
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
      if (!!priceFeed) priceFeed.textContent = `$${userData.price}`
    } else {
      if (!!priceNotFeed) priceNotFeed.textContent = `$${userData.price}`
    }
  }

});

/* Menu desplegable */
if (toggleBtn) toggleBtn.addEventListener('click', function () {
  dropDownMenu.classList.toggle('open');
  const isOpen = dropDownMenu.classList.contains('open');

  toggleBtnIcon.classList = isOpen
    ? 'fa-solid fa-xmark'
    : 'fa-solid fa-bars'
});