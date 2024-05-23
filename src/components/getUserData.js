import { getDoc, getDocs, doc, collection, query, where } from "firebase/firestore";
import { database } from "../firebase/firebaseConfig";

const COLLECTION_NAME = 'Finca'
const COLLECTION_LOTE = 'Lotes'
const COLLECTION_SETTINGS = 'Settings'
const COLLECTION_RECOLECTORES = 'Recolectores'
const COLLECTION_RECOLECCION = 'Recoleccion'

class FirestoreCollection {
  static getCollecionRef = async (id, collectionName) => {
    const userRef = doc(database, COLLECTION_NAME, id);
    const subCollecion = collection(userRef, collectionName);

    return await getDocs(subCollecion)
  }

  static getSubCollecionRef = async (id, collectionName, campo, campoID) => {
    const userRef = doc(database, COLLECTION_NAME, id);
    const collectionRef = collection(userRef, collectionName);
    const q = query(collectionRef, where(campo, "==", campoID))

    return await getDocs(q);
  }
}

export class Recolectores {
  constructor(userId) {
    this.userId = userId
    this.settings = new Settings(userId)
    this.recoleciones = COLLECTION_RECOLECCION
    this.recolectores = COLLECTION_RECOLECTORES
  }

  async getRecolectores() {
    try {
      return await FirestoreCollection.getCollecionRef(this.userId, this.recolectores);
    } catch (error) {
      console.error(`Error al obtener los datos de la subcolección: ${error}`);
      throw error;
    };
  }

  /* Obtener Detalle, total de kg y a pagar del recolector */
  async getHarverst(recolectorID) {
    try {
      const recolecciones = await FirestoreCollection.getSubCollecionRef(this.userId, this.recoleciones, "recolector", recolectorID);
      let totalPay = 0;
      let totalKg = 0;

      for (const recoleccion of recolecciones.docs) {
        const hasvertsData = recoleccion.data();
        const settings = await this.settings.getPriceRecolection(hasvertsData.configuracion);

        totalKg += hasvertsData.cantidad;
        totalPay += hasvertsData.cantidad * settings.price
      };

      return { recolecciones, totalKg, totalPay }

    } catch (error) {
      console.error(`Error en recolecion consulta ${error}`);
      throw error;
    }
  }

  getHarverstDateWeek(weekDays) {
    return this.getHarvestByYearAndMonth(weekDays)
  }

  getHarverstDateCalendar(Date) {
    return this.getHarvestByYearAndMonth(Date);
  }

  getHarverstDateMonth(month, year) {
    return this.getHarvestByYearAndMonth(year, month)
  }

  getHarverstDateYear(year) {
    return this.getHarvestByYearAndMonth(year)
  }

  async getHarvestByYearAndMonth(yearOrWeekDays, month = null) {
    try {
      const recolector = await FirestoreCollection.getCollecionRef(this.userId, this.recoleciones);
      const recolecciones = [];

      const filterByDate = (fecha) => {
        if (Array.isArray(yearOrWeekDays)) {  /* Si se obtienen los dias de la semana actual */
          return yearOrWeekDays.some(day => fecha.includes(day));
        }

        if (month !== null) { /* se obtine el mes del año */
          return fecha.includes(yearOrWeekDays) && fecha.includes(month);
        }

        return fecha.includes(yearOrWeekDays); /* solo se obtine solo el año */
      };

      const data = recolector.docs
        .filter(doc => filterByDate(doc.data().fecha || ''))
        .map(doc => this.getInfomationDate(doc.data()));

      recolecciones.push(...await Promise.all(data));

      return recolecciones;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getInfomationDate(data) {
    const recolector = await FirestoreCollection.getSubCollecionRef(this.userId, this.recolectores, "id", data.recolector);
    let totalharvest = 0;
    let totalPay = 0;

    const total = await this.settings.getPriceRecolection(data.configuracion);
    const recolectorName = recolector.docs.map(doc => doc.data().name)

    return {
      recoleccion: data,
      recolector_name: recolectorName,
      recoleccion_total: totalPay += data.cantidad,
      recoleccion_pay: totalharvest += data.cantidad * total.price
    }

  }

};

export class Lotes {
  constructor(userId) {
    this.userId = userId
    this.lote = COLLECTION_LOTE
  }

  /* Obtener los lotes */
  async getLotesData() {
    try {
      return FirestoreCollection.getCollecionRef(this.userId, this.lote);
    } catch (error) {
      console.error(`Error de lotes: ${error}`)
      throw error;
    }
  }

  async getNameLote(lotesId) {
    try {
      const querySnapshot = await FirestoreCollection.getSubCollecionRef(this.userId, this.lote, "id", lotesId)
      const loteNames = querySnapshot.docs.map(doc => doc.data().name);
      const loteName = loteNames.join(', ');

      return loteName;
    } catch (error) {
      console.error(`Error al obtener el nombre del lote ${error}`)
      throw error
    }
  }
}

export class Settings {
  constructor(userId) {
    this.userId = userId;
    this.settings = COLLECTION_SETTINGS
  }

  /*  Obtener las conficuraciones */
  async getSettings() {
    try {
      return await FirestoreCollection.getCollecionRef(this.userId, this.settings);
    } catch (error) {
      console.error(`Error al obtener las configuraciones ${error}`)
      throw error;
    }
  }

  /*  Obtener el tipo y el presion de las configuracion ID */
  async getPriceRecolection(settingsID) {
    try {
      const settingsRef = await FirestoreCollection.getCollecionRef(this.userId, this.settings)
      let price = 0;
      let type = ""

      for (let doc of settingsRef.docs) {
        const data = doc.data();

        if (data.id === settingsID) {
          price = data.price

          if (data.aliment === "yes") {
            type = "Si"
          } else {
            type = "No"
          }

          break;
        }
      }

      if (price === 0) {
        throw new Error(`No se encontró un documento con ID ${settingsID}`);
      }

      return { price, type };
    } catch (error) {
      console.error(`Error al obtener precios ${error}`)
    }

  }
}

/* Obtener datos del usuario */
export async function getUserData(userID) {
  try {
    const userRef = doc(database, COLLECTION_NAME, userID);
    const docSnapshot = await getDoc(userRef)

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      return userData;
    } else {
      console.log('No se encontraron datos para el usuario con el ID:', userID);
      return null
    }

  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    throw error;
  }
};

