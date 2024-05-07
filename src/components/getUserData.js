import { getDoc, doc, collection, getDocs, query, where, } from "firebase/firestore";
import { database } from "../firebase/firebaseConfig";

class FirestoreCollection {
  static getCollecionRef = async (id, subcollectionName) => {
    const userRef = doc(database, 'Usuario', id);
    const subCollecion = collection(userRef, subcollectionName);

    return await getDocs(subCollecion)
  }

  static getSubCollecionRef = async (id, collectionName, collectionID, subcollectionName) => {
    const userRef = doc(database, 'Usuario', id);
    const collectionRef = collection(userRef, collectionName);
    const collectionDocRef = doc(collectionRef, collectionID)
    const subCollectionRef = collection(collectionDocRef, subcollectionName);

    return await getDocs(subCollectionRef);
  }
}

export class Recolectores {
  constructor(userId) {
    this.userId = userId
    this.settings = new settings(userId)
    this.recoleciones = 'recoleciones'
    this.recolectores = 'recolectores'
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
  async getHarverst(recolectorId) {
    try {
      const recolecciones = await FirestoreCollection.getSubCollecionRef(this.userId, this.recolectores, recolectorId, this.recoleciones);
      let totalPay = 0;
      let totalKg = 0;

      for (const recoleccion of recolecciones.docs) {
        const hasvertsData = recoleccion.data();
        const price = await this.settings.getPriceRecolection(hasvertsData.settings_id);

        totalKg += hasvertsData.total;
        totalPay += hasvertsData.total * price.price
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
      const recolector = await FirestoreCollection.getCollecionRef(this.userId, this.recolectores);
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

      for (const recolectorDoc of recolector.docs) {
        const q = query(collection(recolectorDoc.ref, this.recoleciones));
        const recolecionesSnapshot = await getDocs(q);

        const data = recolecionesSnapshot.docs
          .filter(doc => filterByDate(doc.data().date))
          .map(doc => this.getInfomationDate(doc.data(), recolectorDoc));

        recolecciones.push(...await Promise.all(data));
      }

      return recolecciones;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getInfomationDate(data, doc) {
    let totalPay = 0;
    let totalharvest = 0;

    const total = await this.settings.getPriceRecolection(data.settings_id);

    return {
      recoleccion: data,
      recolector_name: doc.data().recolector_name,
      recoleccion_total: totalPay += data.total,
      recoleccion_pay: totalharvest += data.total * total.price
    }

  }

};

export class lotes {
  constructor(userId) {
    this.userId = userId
    this.lote = 'lotes'
  }

  /* Obtener los lotes */
  async getLotesData() {
    try {
      return FirestoreCollection.getCollecionRef(this.userId, this.lote);;
    } catch (error) {
      console.error(`Error de lotes: ${error}`)
      throw error;
    }
  }

  async getNameLote(lotesId) {
    try {
      const querySnapshot = await FirestoreCollection.getCollecionRef(this.userId, this.lote)
      let loteName = ""

      querySnapshot.forEach((doc) => {
        if (doc.id === lotesId) {
          loteName += doc.data().lote_name;
        }
      });

      return loteName;

    } catch (error) {
      console.log(`Error al obtener el nombre del lote ${error}`)
      throw error
    }
  }
}

export class settings {
  constructor(userId) {
    this.userId = userId;
    this.settings = 'Settings'
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
        const id = doc.id;

        if (id === settingsID) {
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
      console.error(`Error al obtener presios ${error}`)
    }

  }
}

/* Obtener datos del usuario */
export async function getUserData(userID) {
  try {
    const userRef = doc(database, 'Usuario', userID);
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

