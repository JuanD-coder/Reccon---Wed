import { userID } from "../home/user-home";
import { lotes, settings, recolectores } from "../../components/getUserData";
import { createPdfInforme } from "../../components/DocumentPdf";
import { getDownloadURL, list, listAll, ref } from "firebase/storage";
import { storege } from "../../firebase/firebaseConfig";

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
generateInforme.addEventListener('click', async () => {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.style.display = 'block'

  const filePath = await createPdfInforme();
  const pdfURL = URL.createObjectURL(filePath)

  window.open(pdfURL, '_blank')
});

optionSelect.forEach(item => {
  item.addEventListener('click', () => {
    selectText.innerText = item.textContent;
    optionMenu.classList.remove("active")
  });
})

async function initDOMVariables(cardInfoHTML) {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = "none";

  cardInfoHTML.classList.add('green');
  await getDateActual();
  await showHistorialInformes();
};

async function getDateActual() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  await showRecolection(day, month, year)
}

async function showHistorialInformes() {
  try {

    let ruta = `/${userID}/Informes/`
    const reference = ref(storege, ruta)

    const listPdf = await listAll(reference)
    const containerList = document.getElementById('card-list-pdf')

    listPdf.items.forEach(async (item) => {
      const url = await getDownloadURL(item)
      let nuevoDiv = document.createElement('div');

      nuevoDiv.innerHTML = cardListPDFHistory(item.name)
      containerList.appendChild(nuevoDiv)

      nuevoDiv.addEventListener('click', () => {
        window.open(url, '_blank')
      })

    })

  } catch (error) {
    console.error("Error al listar archivos:", error);
    throw error;
  }
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
    const totalKg = doc.recoleccion_total

    const [nameLotes, settings] = await Promise.all([
      loteInfo.getNameLote(doc.recoleccion.lote_id),
      settingsInfo.getPriceRecolection(doc.recoleccion.settings_id)
    ]);

    return { nameRecolector, nameLotes, settings, total, totalPay, totalKg };
  });

  const results = await Promise.all(promises)
  const fragment = document.createDocumentFragment();

  results.forEach(({ nameRecolector, nameLotes, settings, total, totalPay, totalKg }) => {
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

    fragment.appendChild(nuevoDiv);
  });

  viewCalendar.appendChild(fragment)
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

const cardListPDFHistory = (name) => {
  return `
  <div class="cardHistorialInfome">
    <img src="/src/assets/images/icons/informe-white.png" alt="infome" width="100px" loading="lazy">
    <div class="column-info">
      <h3>${name}</h3>
      <div class="informe-info">
        <p><b>Tipo:</b> Infome {tipo}</p>
      </div>
    </div>
  </div>
  `
}

