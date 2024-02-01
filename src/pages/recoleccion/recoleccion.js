import { getCollecionRecolector, getDetailRecolection, getNameLoteID, getNameRecolector, getPayTotal, getPriceRecolection } from "../../components/getUserData";
import { userID } from "../home/user-home";

const titleName = document.getElementById("titleName");
const titleHarverst = document.getElementById("titleHarverst");
const titlePay = document.getElementById("titlePay");
const cardSelect = document.getElementById("select-recolector");
const imgHarverst = document.getElementById("imgRecolection")
const txtCardSelect = document.getElementById("txtNotReclector");
const header = document.getElementById("header");

const getNameRecolectors = await getNameRecolector(userID);

generateRecolectorElement();

async function generateRecolectorElement() {
  var contenedor = document.getElementById('cardRecolector');
  contenedor.innerHTML = '';

  getNameRecolectors.forEach(async (doc) => {
    try {
      var recolectorData = doc.data();
      var recolectorID = doc.id

      const querySnapshot = await getCollecionRecolector(userID, recolectorID);
      const totalPay = await getPayTotal(userID, recolectorID)

      let nuevoDiv = document.createElement('div');
      nuevoDiv.innerHTML = `  
              <div class="card recolectors">
                <div class="card-header recolection-header">
                  <img src="/src/assets/images/icons/ic_recolector.svg" alt="recolector" class="name_recolector">
                  <h2 id="recolectorName">${recolectorData.recolector_name}</h2>
                </div>
                <div class="card-body recolection-body">
                  <div class="card-left" id="${recolectorID}">
                      <img src="/src/assets/images/icons/bolsa-de-cafe.png" alt="granos-de-cafe" width="45px">
                      <p>Detalle</p>
                  </div>
                  <div class="card-right">
                      <p>${querySnapshot} KG</p>
                      <h3>Recolectado</h3>
                  </div>
                </div>
              </div>`;
      contenedor.appendChild(nuevoDiv);

      const detail = document.getElementById(`${recolectorID}`)

      detail.addEventListener('click', function () {
        userInformation(recolectorData, querySnapshot, totalPay)
        showRecolection(recolectorID);
      });

    } catch (error) { console.error('Error al obtener datos de recolecciones:', error); }
  });
}

function userInformation(data, totalKg, totalPay) {
  titleName.textContent = `Informacion del recolector ${data.recolector_name}`;
  titleHarverst.textContent = `Total Recolectado: ${totalKg} KG`
  titlePay.textContent = `Total a pagar: $${totalPay}`
}

async function showRecolection(recolectorID) {
  const contenedor = document.getElementById("information-recolector");
  contenedor.innerHTML = '<h1> Recoleciones registradas</h1>';

  const dataRecolection = await getDetailRecolection(userID, recolectorID);

  if (dataRecolection.empty) {
    updateUI(dataRecolection, contenedor);
  } else {
    renderRecolectionCards(contenedor, dataRecolection);
    updateUI(dataRecolection, contenedor)
  }
};

function updateUI(dateRecolection, contenedor) {
  const isEmpty = dateRecolection.empty;

  header.style.display = isEmpty ? "none" : "block";
  contenedor.style.display = isEmpty ? "none" : "block";
  cardSelect.style.display = isEmpty ? "flex" : "none";

  if (isEmpty) {
    imgHarverst.src = "/src/assets/images/icons/ic_not_recolection.png";
    txtCardSelect.textContent = "No se encontraron recolecciones en este trabajador";
    console.log("vacia")
  } else {
    console.log("no es vacia")
  }
}

function renderRecolectionCards(contenedor, recolectionData) {
  recolectionData.forEach(async (doc) => {
    const getDataRecolection = doc.data();
    const getNameLote = await getNameLoteID(userID, getDataRecolection.lote_id);
    const getSettings = await getPriceRecolection(userID, getDataRecolection.settings_id);

    const cardHTML = createRecolectionCard(getDataRecolection, getNameLote, getSettings);

    const newDiv = document.createElement('div');
    newDiv.innerHTML = cardHTML;

    contenedor.appendChild(newDiv);
  });
}

function createRecolectionCard(data, getNameLote, getSettings) {
  return `
  <div class="card recoleccion">
    <div class="card-header recolection-header">
      <img src="/src/assets/images/icons/bolsa-de-cafe-white.png" alt="recolector" class="name_recolector">
      <h2 id="recolectorName">${data.date}</h2>
    </div>
    <div class="card-body recolection-body">
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
    </div>
  </div> `;
}
