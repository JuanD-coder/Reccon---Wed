import { getDoc, doc, collection, getDocs, } from "firebase/firestore";
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

export class recolectores {
  constructor(userId) {
    this.userId = userId
    this.settings = new settings(userId)
    this.recoleciones = 'recoleciones'
    this.recolectores = 'recolectores'
  }

  /* Obtener los recolectores */
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

      for (const recoletorDoc of recolecciones.docs) {
        const hasvertsData = recoletorDoc.data();
        const price = await this.settings.getPriceRecolection(hasvertsData.settings_id);

        totalKg += hasvertsData.total;
        totalPay += hasvertsData.total * price.price
      };

      return { recolecciones, totalKg, totalPay }

    } catch (error) {
      console.error(`Error en recolecion consulta ${error}`);
      throw error;
    }
  };

  async getHarverstDate(Date) {
    try {
      const recolector = await FirestoreCollection.getCollecionRef(this.userId, this.recolectores);
      const recoleccion = [];
      let totalPay = 0;
      let totalharvest = 0;

      for (const recoletorDoc of recolector.docs) {
        const recolectorData = recoletorDoc.data();

        const recoleccionesRef = collection(recoletorDoc.ref, this.recoleciones);
        const recolecionesSnapshot = await getDocs(recoleccionesRef);

        const filteredRecolecciones = recolecionesSnapshot.docs
          .filter(recoleccionDoc => recoleccionDoc.data().date === Date);

        for (const recoleccionDoc of filteredRecolecciones) {
          const recolectionData = recoleccionDoc.data();
          const total = await this.settings.getPriceRecolection(recolectionData.settings_id);

          recoleccion.push({
            recoleccion: recolectionData,
            recolector_name: recolectorData.recolector_name,
            recoleccion_total: totalPay += recolectionData.total,
            recoleccion_pay: totalharvest += recolectionData.total * total.price
          });

        }
      }

      const recolecciones = await Promise.all(recoleccion);

      return recolecciones;
    } catch (error) {
      console.error(error);
      return [];
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
      return  FirestoreCollection.getCollecionRef(this.userId, this.lote);;
    } catch (error) {
      console.error(`Error de lotes: ${error}`)
      throw error;
    }
  }

  async getNameLote(lotesId) {
    try {
      const querySnapshot = await FirestoreCollection.getCollecionRef(this.userId, this.lote)
      let nameLote = ""

      querySnapshot.forEach((doc) => {
        let dataLote = doc.data();
        let id = doc.id

        if (id === lotesId) {
          nameLote = dataLote.lote_name;
        }
      });

      return nameLote;

    } catch (error) {
      console.log(`Error al obtener el nombre del lote ${error}`)
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

