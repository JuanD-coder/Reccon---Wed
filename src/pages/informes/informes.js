import { lotes, settings } from "../../components/getUserData"
import { userID } from "../home/user-home"

const loteInfo = new lotes(userID)
const settingsInfo = new settings(userID)
let totalCollection, totalPay, cardSelect, cardInfo, recolectorInfo, viewCalendar;

function initDOMVariables() {
  totalCollection = document.getElementById("recolectado");
  totalPay = document.getElementById("pagar");
  cardSelect = document.getElementById("select-recolector");
  cardInfo = document.getElementById("card-info");
  recolectorInfo = document.getElementById('header');
  viewCalendar = document.getElementById("recolector-calendar");

  cardInfo.classList.add('green')
};

document.addEventListener("DOMContentLoaded", initDOMVariables);

export async function calendarDayHarvest(dateRecolection) {

  if (!totalCollection) {
    initDOMVariables();
  }

  viewCalendar.innerHTML = '<h1>Recolectores</h1>'

  dateRecolection.forEach(async (doc) => {
    try {
      const nameLotes = await loteInfo.getNameLote(doc.recoleccion.lote_id)
      const settings = await settingsInfo.getPriceRecolection(doc.recoleccion.settings_id)

      totalCollection.textContent = `Total recolectado: ${doc.recoleccion_total} Kg`;
      totalPay.textContent = `Total a pagar: $${doc.recoleccion_pay}`

      let nuevoDiv = document.createElement('div');
      nuevoDiv.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <img src="/src/assets/images/icons/ic_recolector.svg" alt="recolector">
                    <h2 id="recolectorName">${doc.recolector_name}</h2>
                </div>
                <div class="card-body">
                    <div class="card-left">
                        <p>Lote: ${nameLotes}</p>
                        <p>Hora: 07:25</p>
                        <p>Alimentacion: ${settings.type}</p>
                        <p>Precio: $${settings.price}</p>
                    </div>
                    <div class="card-right">
                        <p> ${doc.recoleccion_total}KG</p>
                        <h3>Recolectado</h3>
                    </div>
                </div>
            </div> `

      viewCalendar.appendChild(nuevoDiv)

    } catch (error) {
      console.error("Error al cargar la recolecion", error)
    }
  })
};

export async function updateUI(dateRecolection) {
  if (!totalCollection) {
    initDOMVariables();
  }

  let isEmpty = dateRecolection.length !== 0

  cardInfo.style.display = isEmpty ? "none" : "block";
  recolectorInfo.style.display = isEmpty ? "block" : "none";
  viewCalendar.style.display = isEmpty ? "block" : "none";
  cardSelect.style.display = isEmpty ? "none" : "flex";

}




