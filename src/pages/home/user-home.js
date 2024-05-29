import { signOut } from "firebase/auth";
import { auth, checkAuthState } from "../login";
import { getUserData, Lotes, Settings } from "../../components/getUserData";

import '../../styles/navegation-bar.css';
import './user-home.css';

export const userID = await checkAuthState();
const getData = await getUserData(userID);
const settingsInfo = new Settings(userID)
const lotesInfo = new Lotes(userID);

/* Show Lotes */
const contenedor = document.getElementById('container-lotes');
const getNameLotes = await lotesInfo.getLotesData();
getNameLotes.forEach((doc) => {
  let lotes = doc.data();
  let nameLoteDiv = document.createElement('div')

  nameLoteDiv.classList.add('show-lotes')
  nameLoteDiv.innerHTML = `
  <div class="right">
    <p>${lotes.name}</p>
    <span><b>Variedad: </b>${lotes.type}</span>  
  </div>
    <img src="${require('../../assets/images/icons/granja.png')}" alt="lotes" width="45px" loading="lazy">`

  if (contenedor) contenedor.appendChild(nameLoteDiv);
})

const getPrices = await getActivesPrices()
const priceFeed = document.getElementById("yesFeeding");
const priceNotFeed = document.getElementById("notFeeding");

if (!!priceFeed) priceFeed.textContent = `$${getPrices.activePriceData.yesAliment}`
if (!!priceNotFeed) priceNotFeed.textContent = `$${getPrices.activePriceData.notAliment}`

const userName = document.getElementById("userName");
if (userName) userName.textContent = getData.userName

const cardReport = document.getElementById("card-informe");
const cardHarvest = document.getElementById("card-recoleccion");
if (cardReport) cardReport.addEventListener('click', function () {
  window.location.href = '../informes/informes.html';
});

if (cardHarvest) cardHarvest.addEventListener('click', function () {
  window.location.href = '../recoleccion/recoleccion.html'
});

/* Sing Out */
const logout = document.getElementById("singOut");

if (logout) logout.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../login/index.html";
    console.log("Sign Out");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});

/* Menu desplegable */
const toggleBtn = document.getElementById("toggle-btn");

if (toggleBtn) toggleBtn.addEventListener('click', function () {
  const dropDownMenu = document.getElementById("dropdown-menu");
  const toggleBtnIcon = document.getElementById("toggle-btn i");

  dropDownMenu.classList.toggle('open');
  const isOpen = dropDownMenu.classList.contains('open');

  toggleBtnIcon.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'
});

export async function getActivesPrices() {
  const getUserSettings = await settingsInfo.getSettings(userID);
  let activePriceData = {}
  let priceData = []

  getUserSettings.forEach(async (doc) => {
    const userData = doc.data()

    if (userData.state === "active") {
      if (userData.aliment === "yes") {
        activePriceData.yesAliment = userData.price
      } else {
        activePriceData.notAliment = userData.price
      }
    }

    if (userData.state === "save") {
      priceData.push({ alimentacion: userData.aliment, price: userData.price })
    }
  });

  return { activePriceData, priceData };
}