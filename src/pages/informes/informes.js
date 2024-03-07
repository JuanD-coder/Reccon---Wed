import { userID } from "../home/user-home";
import { lotes, settings, recolectores } from "../../components/getUserData";
import { createPdfInforme } from "../../components/DocumentPdf";

const loteInfo = new lotes(userID)
const settingsInfo = new settings(userID)
const getRecolector = new recolectores(userID)

const totalCollection = document.getElementById("recolectado");
const totalPayText = document.getElementById("pagar");
const cardSelect = document.getElementById("select-recolector");
const cardInfo = document.getElementById("card-info");
const recolectorInfoCard = document.getElementById('header');
const viewCalendar = document.getElementById("recolector-calendar");
const generateInforme = document.getElementById('btn-informe');

const optionMenu = document.querySelector(".dropdown");
const menuSelect = document.querySelector('.dropdown-select');
const optionSelect = document.querySelectorAll(".dropdown-list__item");
const selectText = document.querySelector(".select");

document.addEventListener("DOMContentLoaded", await initDOMVariables(cardInfo));
document.addEventListener('recolectionClicked', async (event) => {
  const { today, month, year } = event.detail;
  await showRecolection(today, month, year)
});

menuSelect.addEventListener("click", () => optionMenu.classList.toggle("active"));
generateInforme.addEventListener('click', () => createPdfInforme());

optionSelect.forEach(item => {
  item.addEventListener('click', () => {
    selectText.innerText = item.textContent;
    optionMenu.classList.remove("active")
  });
})

async function initDOMVariables(cardInfoHTML) {
  await getDateActual()
  cardInfoHTML.classList.add('green');
};

async function getDateActual() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  await showRecolection(day, month, year)
}

async function showRecolection(today, month, year) {
  const pad2 = (num) => num.toString().padStart(2, '0');
  const day = String(today.innerHTML).padStart(2, '0');
  const fechaFormateada = `${pad2(month + 1)}-${day}-${year}`;

  const dateRecolection = await getRecolector.getHarverstDate(fechaFormateada)

  if (Array.isArray(dateRecolection) && dateRecolection.length !== 0) {

    today.classList.remove('current-date-color')
    today.classList.add('current-date')

    updateUI(dateRecolection);
    calendarDayHarvest(dateRecolection);
  } else {
    updateUI(dateRecolection)
  }
}

function updateUI(dateRecolection) {
  let isEmpty = dateRecolection.length !== 0;
  let displayStyle = isEmpty ? "block" : "none";
  let flexStyle = isEmpty ? "none" : "flex";

  cardInfo.style.display = flexStyle;
  recolectorInfoCard.style.display = displayStyle;
  viewCalendar.style.display = displayStyle;
  cardSelect.style.display = flexStyle;
};

async function calendarDayHarvest(dateRecolection) {
  viewCalendar.innerHTML = '<h1>Recolectores</h1>'

  const promises = dateRecolection.map(async (doc) => {
    const nameRecolector = doc.recolector_name
    const total = doc.recoleccion.total
    const totalPay = doc.recoleccion_pay
    const toatalKg = doc.recoleccion_total

    const nameLotes = await loteInfo.getNameLote(doc.recoleccion.lote_id)
    const settings = await settingsInfo.getPriceRecolection(doc.recoleccion.settings_id)

    return Promise.all([nameRecolector, nameLotes, settings, total, totalPay, toatalKg])
  });

  const results = await Promise.all(promises)

  results.forEach(async ([nameRecolector, nameLotes, settings, total, totalPay, totalKg]) => {
    try {
      totalCollection.textContent = `Total recolectado: ${totalKg} Kg`;
      totalPayText.textContent = `Total a pagar: $${totalPay}`

      let nuevoDiv = document.createElement('div');
      nuevoDiv.innerHTML = cardRecolectorHTML(
        nameRecolector,
        nameLotes,
        settings.type,
        settings.price,
        total
      );
      viewCalendar.appendChild(nuevoDiv)

    } catch (error) {
      console.error("Error al cargar la recolecion", error)
    }
  })
};

const cardRecolectorHTML = (name, nameLote, feeding, price, total) => {
  return `
  <div class="card">
    <div class="card-header">
      <img src="/src/assets/images/icons/ic_recolector.svg" alt="recolector" loading="lazy">
      <h2 id="recolectorName">${name}</h2>
    </div>
    <div class="card-body">
      <div class="card-left">
        <p>Lote: ${nameLote}</p>
        <p>Hora: 07:25</p>
        <p>Alimentacion: ${feeding}</p>
        <p>Precio: $${price}</p>
    </div>
    <div class="card-right">
      <p> ${total}KG</p>
      <h3>Recolectado</h3>
      </div>
    </div>
  </div> `
}

