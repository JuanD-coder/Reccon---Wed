import { lotes, Recolectores, settings } from "../../components/getUserData";
import { userID } from "../home/user-home";

/* ID HTML */
const titleName = document.getElementById("titleName");
const titleHarverst = document.getElementById("titleHarverst");
const titlePay = document.getElementById("titlePay");
const cardSelect = document.getElementById("select-recolector");
const imgHarverst = document.getElementById("imgRecolection");
const txtCardSelect = document.getElementById("txtNotReclector");
const header = document.getElementById("header");
const cardInfo = document.getElementById('card-info');

const recolector = new Recolectores(userID)
const getNameRecolectors = await recolector.getRecolectores();
const lote = new lotes(userID);
const settingsInfo = new settings(userID)

cardInfo.style.visibility = "visible"

generateRecolectorElement();

async function generateRecolectorElement() {
  try {

    const recolectorElements = [];
    const contenedor = document.getElementById('cardRecolector');
    const getRecolector = await recolectorInformation()

    contenedor.innerHTML = '';

    getRecolector.map(async (element) => {
      let recolectorID = element.recolectorID

      if (element.state === true) {
        const newDiv = document.createElement('div');

        newDiv.classList.add('card');
        newDiv.innerHTML = createRecolectionCard(element.name, recolectorID)

        recolectorElements.push({
          recolectorID,
          element: newDiv
        });
      }
    })

    await Promise.all(recolectorElements.map(async ({ recolectorID, element }) => {
      const dataRecolection = await recolector.getHarverst(recolectorID);
      const recolectorData = getNameRecolectors.docs.find(doc => doc.id === recolectorID).data();

      const detail = element.querySelector(`#${recolectorID}`);
      detail.addEventListener('click', () => {
        showRecolection(dataRecolection);
        userInformation(recolectorData, dataRecolection.totalKg, dataRecolection.totalPay);
      });

      const cardRight = element.querySelector('.card-right');
      cardRight.innerHTML = `
          <p>${dataRecolection.totalKg} KG</p>
          <h3>Recolectado</h3>`;
    }));

    contenedor.append(...recolectorElements.map(({ element }) => element));

  } catch (error) { console.error('Error al obtener datos de recolecciones:', error); }
}

async function recolectorInformation() {
  let recolectorInfo = []

  for (const doc of getNameRecolectors.docs) {
    const recolectorData = doc.data();
    const recolectorID = doc.id

    recolectorInfo.push({
      name: recolectorData.recolector_name,
      state: recolectorData.state,
      recolectorID: recolectorID
    })
  }

  return recolectorInfo
}

async function showRecolection(dataRecolection) {
  const recolectionData = dataRecolection.recolecciones.docs
  const contenedor = document.getElementById("information-recolector");
  contenedor.innerHTML = '<h1> Recoleciones registradas</h1>';

  updateUI(dataRecolection, contenedor)

  if (!dataRecolection.empty) {
    renderRecolectionCards(contenedor, recolectionData);
  }
}

async function renderRecolectionCards(contenedor, recolectionData) {
  const recolectionCards = [];

  for (const doc of recolectionData) {
    const getDataRecolection = doc.data();
    const getNameLote = await lote.getNameLote(getDataRecolection.lote_id);
    const getSettings = await settingsInfo.getPriceRecolection(getDataRecolection.settings_id);

    const cardHTML = createRecolectionCardDetail(getDataRecolection, getNameLote, getSettings);

    const newDiv = document.createElement('div');
    newDiv.classList.add('card');
    newDiv.innerHTML = cardHTML;

    recolectionCards.push(newDiv);
  };

  contenedor.append(...recolectionCards);
}

function updateUI(dateRecolection, contenedor) {
  const isEmpty = dateRecolection.empty;

  header.style.display = isEmpty ? "none" : "block";
  contenedor.style.display = isEmpty ? "none" : "block";
  cardSelect.style.display = isEmpty ? "flex" : "none";

  if (isEmpty) {
    imgHarverst.src = "/src/assets/images/icons/ic_not_recolection.png";
    txtCardSelect.textContent = "No se encontraron recolecciones en este trabajador";
  }
}

function userInformation(data, totalKg, totalPay) {
  titleName.textContent = `Informacion del recolector ${data.recolector_name}`;
  titleHarverst.textContent = `Total Recolectado: ${totalKg} KG`
  titlePay.textContent = `Total a pagar: $${totalPay}`
}

function createRecolectionCardDetail(data, getNameLote, getSettings) {
  let stringDate = data.date.split("Hora: ")
  return `
    <div class="card-header">
      <img src="/src/assets/images/icons/bolsa-de-cafe-white.png" alt="recolector" class="name_recolector" loading="lazy">
      <h3 id="recolectorName">${stringDate[0].trim()}</h3>
    </div>
    <div class="card-body">
      <div class="card-left left">
        <p>Lote: ${getNameLote.trim()}</p>
        <p>Hora: ${stringDate[1].trim()}</p>
        <p>Alimentación: ${getSettings.type.trim()}</p>
        <p>Precio: $${getSettings.price}</p>
      </div>
      <div class="card-right">
        <p>${data.total} KG</>
        <h3>Recolectado</h3>
      </div>
    </div>`;
}

function createRecolectionCard(recolectorName, id) {
  return `  
    <div class="card-header">
      <img src="/src/assets/images/icons/ic_recolector.svg" alt="recolector" class="name_recolector" loading="lazy">
      <h2 id="recolectorName">${recolectorName}</h2>
    </div>
    <div class="card-body ">
      <div class="card-left" id="${id}">
        <img src="/src/assets/images/icons/bolsa-de-cafe.png" alt="granos-de-cafe" width="45px" loading="lazy">
        <p>Detalle</p>
      </div>
      <div class="card-right">
        <p>Loading...</p>
        <h3>Recolectado</h3>
      </div>
    </div> `;
}
