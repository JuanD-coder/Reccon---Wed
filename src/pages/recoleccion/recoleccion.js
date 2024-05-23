import { Lotes, Recolectores, Settings } from "../../components/getUserData";
import { userID } from "../home/user-home";

const recolector = new Recolectores(userID)
const lote = new Lotes(userID);
const settingsInfo = new Settings(userID)

const cardInfo = document.getElementById('card-info');
cardInfo.style.visibility = "visible"

generateRecolectorElement();

async function recolectorInformation() {
  const getNameRecolectors = await recolector.getRecolectores();
  let recolectorInfo = []

  for (const doc of getNameRecolectors.docs) {
    const recolectorData = doc.data();

    recolectorInfo.push({
      name: recolectorData.name,
      state: recolectorData.state,
      recolectorID: recolectorData.id
    })
  }

  return recolectorInfo
}

async function generateRecolectorElement() {
  try {
    const contenedor = document.getElementById('cardRecolector');
    const getRecolector = await recolectorInformation()
    const recolectorElements = [];
    contenedor.innerHTML = '';

    getRecolector.map(async (element) => {
      let recolectorID = element.recolectorID

      if (element.state === "active") {
        const newDiv = document.createElement('div');
        newDiv.classList.add('card');
        newDiv.innerHTML = createRecolectionCard(element.name, recolectorID)

        recolectorElements.push({
          recolectorID,
          name: element.name,
          element: newDiv
        });
      }
    })

    await Promise.all(recolectorElements.map(async ({ recolectorID, name, element }) => {
      const dataRecolection = await recolector.getHarverst(recolectorID);

      const detail = element.querySelector(`#element${recolectorID}`);
      detail.addEventListener('click', () => {
        showRecolection(dataRecolection, name);
        userInformation(dataRecolection.totalKg, dataRecolection.totalPay, name);
      });

      const cardRight = element.querySelector('.card-right');
      cardRight.innerHTML = `
          <p>${dataRecolection.totalKg} KG</p>
          <h3>Recolectado</h3>`;
    }));

    contenedor.append(...recolectorElements.map(({ element }) => element));

  } catch (error) { console.error('Error al obtener datos de recolecciones:', error); }
}

async function showRecolection(dataRecolection, nameRecolector) {
  const recolectionData = dataRecolection.recolecciones.docs
  const contenedor = document.getElementById("information-recolector");
  contenedor.innerHTML = '<h1>Recoleciones registradas</h1>';

  updateUI(dataRecolection, contenedor)

  if (!dataRecolection.empty) {
    renderRecolectionCards(contenedor, recolectionData, nameRecolector);
  }
}

async function renderRecolectionCards(contenedor, recolectionData, nameRecolector) {
  const recolectionCards = [];

  for (const doc of recolectionData) {
    const getDataRecolection = doc.data();
    console.log(getDataRecolection)
    const getNameLote = await lote.getNameLote(getDataRecolection.lote);
    const getSettings = await settingsInfo.getPriceRecolection(getDataRecolection.configuracion);

    const newDiv = document.createElement('div');
    newDiv.classList.add('card');
    newDiv.innerHTML = createRecolectionCardDetail(getDataRecolection, getNameLote, getSettings, nameRecolector);

    recolectionCards.push(newDiv);
  };

  contenedor.append(...recolectionCards);
}

function updateUI(dateRecolection, contenedor) {
  const cardSelect = document.getElementById("select-recolector");
  const txtCardSelect = document.getElementById("txtNotReclector");
  const imgHarverst = document.getElementById("imgRecolection");
  const header = document.getElementById("header");
  const isEmpty = dateRecolection.empty;

  header.style.display = isEmpty ? "none" : "block";
  contenedor.style.display = isEmpty ? "none" : "block";
  cardSelect.style.display = isEmpty ? "flex" : "none";

  if (isEmpty) {
    imgHarverst.src = "/src/assets/images/icons/ic_not_recolection.png";
    txtCardSelect.textContent = "No se encontraron recolecciones en este trabajador";
  }
}

function userInformation(totalKg, totalPay, name) {
  const titleName = document.getElementById("titleName");
  const titleHarverst = document.getElementById("titleHarverst");
  const titlePay = document.getElementById("titlePay");

  titleName.textContent = `Información del recolector ${name}`;
  titleHarverst.textContent = `Total Recolectado: ${totalKg} KG`
  titlePay.textContent = `Total a pagar: $${totalPay}`
}

function createRecolectionCardDetail(data, getNameLote, getSettings, getNameRecolector) {
  let getStringDate = () => {
    if ('fecha' in data) {
      return data.fecha.split("Hora: ");
    } else {
      return [getNameRecolector, 'No definido'];
    }
  };
  const dateParts = getStringDate();

  return `
    <div class="card-header">
      <img src="/src/assets/images/icons/bolsa-de-cafe-white.png" alt="recolector" class="name_recolector" loading="lazy">
      <h3 id="recolectorName">${dateParts[0].trim()}</h3>
    </div>
    <div class="card-body">
      <div class="card-left left">
        <p>Lote: ${getNameLote.trim()}</p>
        <p>Hora: ${dateParts[1].trim()}</p>
        <p>Alimentación: ${getSettings.type.trim()}</p>
        <p>Precio: $${getSettings.price}</p>
      </div>
      <div class="card-right">
        <p>${data.cantidad} KG</>
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
      <div class="card-left" id="element${id}">
        <img src="/src/assets/images/icons/bolsa-de-cafe.png" alt="granos-de-cafe" width="45px" loading="lazy">
        <p>Detalle</p>
      </div>
      <div class="card-right">
        <p>Loading...</p>
        <h3>Recolectado</h3>
      </div>
    </div> `;
}
