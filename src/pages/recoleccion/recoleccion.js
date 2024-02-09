import { lotes, recolectores, settings } from "../../components/getUserData";
import { userID } from "../home/user-home";

/* ID HTML */
const titleName = document.getElementById("titleName");
const titleHarverst = document.getElementById("titleHarverst");
const titlePay = document.getElementById("titlePay");
const cardSelect = document.getElementById("select-recolector");
const imgHarverst = document.getElementById("imgRecolection");
const txtCardSelect = document.getElementById("txtNotReclector");
const header = document.getElementById("header");
const contenedor = document.getElementById('cardRecolector');
const cardInfo = document.getElementById('card-info');
const recolector = new recolectores(userID)
const lote = new lotes(userID);
const settingsInfo = new settings(userID)

cardInfo.style.visibility = "visible"

generateRecolectorElement();

async function generateRecolectorElement() {
  try {

    const recolectorElements = [];
    contenedor.innerHTML = '';

    const getNameRecolectors = await recolector.getRecolectores();

    getNameRecolectors.forEach(async (doc) => {
      const recolectorData = doc.data();
      const recolectorID = doc.id

      const newDiv = document.createElement('div');
      newDiv.classList.add('card');
      newDiv.innerHTML = `  
                <div class="card-header">
                  <img src="/src/assets/images/icons/ic_recolector.svg" alt="recolector" class="name_recolector">
                  <h2 id="recolectorName">${recolectorData.recolector_name}</h2>
                </div>
                <div class="card-body ">
                  <div class="card-left" id="${recolectorID}">
                      <img src="/src/assets/images/icons/bolsa-de-cafe.png" alt="granos-de-cafe" width="45px">
                      <p>Detalle</p>
                  </div>
                  <div class="card-right">
                      <p>Loading...</p>
                      <h3>Recolectado</h3>
                  </div>
                </div>`;
      recolectorElements.push({
        recolectorID,
        element: newDiv
      });

      contenedor.append(...recolectorElements.map(({ element }) => element));

      await Promise.all(recolectorElements.map(async ({ recolectorID, element }) => {
        const total = await recolector.getHarverst(recolectorID);

        const detail = element.querySelector(`#${recolectorID}`);
        detail.addEventListener('click', () => {
          showRecolection(recolectorID);
          userInformation(recolectorData, total.totalKg, total.totalPay);
        });

        const cardRight = element.querySelector('.card-right');
        cardRight.innerHTML = `
          <p>${total.totalKg} KG</p>
          <h3>Recolectado</h3>`;
      }));

    });
  } catch (error) { console.error('Error al obtener datos de recolecciones:', error); }
}

function userInformation(data, totalKg, totalPay) {
  titleName.textContent = `Informacion del recolector ${data.recolector_name}`;
  titleHarverst.textContent = `Total Recolectado: ${totalKg} KG`
  titlePay.textContent = `Total a pagar: $${totalPay}`
}

async function showRecolection(recolectorID) {
  const contenedor = document.getElementById("information-recolector");
  contenedor.innerHTML = '<h1> Recoleciones registradas</h1>';

  const dataRecolection = await recolector.getHarverst(recolectorID);
  const recolectionData = dataRecolection.recolecion.docs

  updateUI(dataRecolection, contenedor)

  if (!dataRecolection.empty) {
    renderRecolectionCards(contenedor, recolectionData);
  }
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

async function renderRecolectionCards(contenedor, recolectionData) {
  const recolectionCards = [];

  for (const doc of recolectionData) {
    const getDataRecolection = doc.data();
    const getNameLote = await lote.getNameLote(getDataRecolection.lote_id);
    const getSettings = await settingsInfo.getPriceRecolection(getDataRecolection.settings_id);

    const cardHTML = createRecolectionCard(getDataRecolection, getNameLote, getSettings);

    const newDiv = document.createElement('div');
    newDiv.classList.add('card');
    newDiv.innerHTML = cardHTML;

    recolectionCards.push(newDiv);
  };

  contenedor.append(...recolectionCards);
}

function createRecolectionCard(data, getNameLote, getSettings) {
  return `
    <div class="card-header">
      <img src="/src/assets/images/icons/bolsa-de-cafe-white.png" alt="recolector" class="name_recolector">
      <h2 id="recolectorName">${data.date}</h2>
    </div>
    <div class="card-body">
      <div class="card-left left">
        <p>Lote: ${getNameLote}</p>
        <p>Hora: 07:25</p>
        <p>Alimentacion: ${getSettings.type}</p>
        <p>Precio: $${getSettings.price}</p>
      </div>
      <div class="card-right">
        <p>${data.total} KG</>
        <h3>Recolectado</h3>
      </div>
    </div>`;
}
