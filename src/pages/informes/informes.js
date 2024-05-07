import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storege } from "../../firebase/firebaseConfig";
import { userID } from "../home/user-home";
import { lotes, settings, Recolectores } from "../../components/getUserData";
import { createPdfInforme } from "../../components/DocumentPdf";

const loteInfo = new lotes(userID)
const settingsInfo = new settings(userID)
const getRecolector = new Recolectores(userID)

const cardInfo = document.getElementById("card-info");
const viewCalendar = document.getElementById("recolector-calendar");

const optionMenu = document.querySelector(".dropdown");
const menuSelect = document.querySelector('.dropdown-select');
const optionSelect = document.querySelectorAll(".dropdown-list__item");
const selectText = document.querySelector(".select");
let tipoInforme

document.addEventListener("DOMContentLoaded", await initDOMVariables(cardInfo));
document.addEventListener('recolectionClicked', async (event) => {
  const { today, month, year } = event.detail;
  await showRecolection(today, month, year)
});

menuSelect.addEventListener("click", () => optionMenu.classList.toggle("active"));

optionSelect.forEach(item => {
  item.addEventListener('click', () => {
    selectText.innerText = item.textContent;
    tipoInforme = item.textContent
    optionMenu.classList.remove("active")
  });
})

async function initDOMVariables(cardInfoHTML) {
  const btnGenerateInforme = document.getElementById('btn-informe');
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = "none";

  cardInfoHTML.classList.add('green');
  await getDateActual();
  await showHistorialInformes();

  btnGenerateInforme.addEventListener('click', generateInformePDF);
};

async function generateInformePDF() {

  if (selectText.innerText === "Tipo informe") {
    window.alert("Selecione un tipo de Informe")
    return;
  }

  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.style.display = 'block'

  try {
    const filePath = await createPdfInforme(selectText.innerText);
    window.open(filePath, '_blank')

  } catch (e) {
    console.error("Error al generar el PDF:", error);
    window.alert("Hubo un error al generar el PDF. Por favor, inténtelo de nuevo.");
  } finally {
    loadingScreen.style.display = 'none'
  }

}

async function getDateActual() {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth();
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
  const day = today ? parseInt(today.textContent) || today : today;
  const pad2 = (num) => num.toString().padStart(2, '0')

  let date = new Date(year, month, day)
  let nameDay = date.toLocaleDateString('es-ES', { weekday: 'long' }).split(' ');
  month = date.toLocaleDateString('es-ES', { month: 'long' }).split(' ');

  const fechaFormateada = `${nameDay} ${month} ${pad2(day)} del ${year}`;
  const dateRecolection = await getRecolector.getHarverstDateCalendar(fechaFormateada)

  if (Array.isArray(dateRecolection) && dateRecolection.length !== 0) {
    if (today?.classList) today.classList.remove('current-date-color')
    if (today?.classList) today.classList.add('current-date')

    updateUI(dateRecolection);
    await calendarDayHarvest(dateRecolection);

  } else {
    updateUI(dateRecolection)
  }
}

function updateUI(dateRecolection) {
  const cardSelect = document.getElementById("select-recolector");
  const recolectorInfoCard = document.getElementById('header');

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

  const infoRecolector = dateRecolection.map(async (doc) => {
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

  const results = await Promise.all(infoRecolector)
  const fragment = document.createDocumentFragment();

  results.forEach(({ nameRecolector, nameLotes, settings, total, totalPay, totalKg }) => {
    const totalCollection = document.getElementById("recolectado");
    const totalPayText = document.getElementById("pagar");

    totalCollection.textContent = `Total recolectado: ${totalKg} Kg`;
    totalPayText.textContent = `Total a pagar: $${totalPay}`

    let nuevoDiv = document.createElement('div');
    nuevoDiv.innerHTML = cardRecolectorHTML(
      nameRecolector,
      nameLotes,
      settings.type, /* Alimentacion */
      settings.price, /* Precio de la alimentacion */
      total
    );

    fragment.appendChild(nuevoDiv);
  });

  viewCalendar.appendChild(fragment)
};

function cardRecolectorHTML(name, nameLote, feeding, price, total) {
  return `
  <div class="card recolector-calendar">
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

function cardListPDFHistory(name) {
  const type = name.split(' ')
  return `
  <div class="cardHistorialInfome">
    <img src="/src/assets/images/icons/informe-white.png" alt="infome" width="100px" loading="lazy">
    <div class="column-info center">
      <h3>${name}</h3>
      <div class="informe-info">
        <p><b>Tipo:</b> Infome ${type[1]}</p>
      </div>
    </div>
  </div> `
}

