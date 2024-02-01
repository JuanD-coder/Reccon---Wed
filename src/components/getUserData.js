import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { database } from "../firebase/firebaseConfig";

/* Obtener datos del usuario */
export async function getUserData(userID) {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const docSnapshot = await getDoc(userRef)

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      console.log('Datos del usuario:', userData);

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

/* Obtener los lotes */
export const consultarDatosLotes = async (userID) => {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const subcollectionRef = collection(userRef, 'lotes');

    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(subcollectionRef);

    return querySnapshot;

  } catch (error) {
    console.error('Error al obtener los datos de la subcolección:', error);
  }
};

/*  Obtener Informacion de las conficuraciones */
export const getDataSettings = async (userID) => {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const subcollectionRef = collection(userRef, 'Settings');

    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(subcollectionRef);

    return querySnapshot;

  } catch (error) {
    console.error('Error al obtener los datos de la subcolección:', error);
  }
};

/* Obtener los recolectores */
export const getNameRecolector = async (userID) => {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const subcollectionRef = collection(userRef, 'recolectores');

    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(subcollectionRef);

    return querySnapshot;

  } catch (error) {
    console.error('Error al obtener los datos de la subcolección:', error);
  }
};

/* Obtener recoleccion */
export const getDetailRecolection = async (userID, recolectorID) => {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const recolectoresRef = collection(userRef, 'recolectores');
    const recolectorDocRef = doc(recolectoresRef, recolectorID)
    const recoleccionesRef = collection(recolectorDocRef, 'recoleciones');

    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(recoleccionesRef);

    return querySnapshot;

  } catch (error) {
    console.error('Error al obtener los datos de la subcolección RECOLECIONES:', error);
  }
};

/*  Obtener total recolectodo */
export const getCollecionRecolector = async (userID, recolectorID) => {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const recolectoresRef = collection(userRef, 'recolectores');
    const recolectorDocRef = doc(recolectoresRef, recolectorID)
    const recoleccionesRef = collection(recolectorDocRef, 'recoleciones');

    let sumaTotalKg = 0;

    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(recoleccionesRef);

    querySnapshot.forEach(async (doc) => {
      const recolectionData = doc.data()
      sumaTotalKg += recolectionData.total;
    });

    return sumaTotalKg;

  } catch (error) {
    console.error('Error al obtener los datos de la subcolección:', error);
  }
};

/* Obtener Detalle total del recolector */
export const getPayTotal = async (userID, recolectorID) => {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const recolectoresRef = collection(userRef, 'recolectores');
    const recolectorDocRef = doc(recolectoresRef, recolectorID)
    const recoleccionesRef = collection(recolectorDocRef, 'recoleciones');

    let totalPay = 0;

    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(recoleccionesRef);

    for (let doc of querySnapshot.docs) {
      const recolectionData = doc.data()
      const settingsID = await getDataSettingsID(userID, recolectionData.settings_id)

      totalPay += recolectionData.total * settingsID
    };

    return totalPay;

  } catch (error) {
    console.error('Error al obtener los datos de la subcolección:', error);
  }
}

/*  Obtener precio */
const getDataSettingsID = async (userID, settingsID) => {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const subcollectionRef = collection(userRef, 'Settings');
    let id = 0
    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(subcollectionRef);

    for (let doc of querySnapshot.docs) {
      const data = doc.data();
      const settings = doc.id;
      
      if (settings === settingsID) {
        id = data.price;
        break;
      }
    }

    return id;

  } catch (error) {
    console.error('Error al obtener los datos de la subcolección:', error);
    throw error;
  }
};

/* Obtener Nombre del Lote ID */
export const getNameLoteID = async (userID, loteID) => {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const subcollectionRef = collection(userRef, 'lotes');
    let nameLote = ""
    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(subcollectionRef);

    for (let doc of querySnapshot.docs) {
      const data = doc.data();
      const lote = doc.id;

      if (lote == loteID) {
        nameLote = data.lote_name;
        break;
      }
    }
    
    return nameLote;

  } catch (error) {
    console.error('Error al obtener los datos de la subcolección:', error);
  }
};

export async function getPriceRecolection(userID, settingsID) {
  try {
    const userRef = doc(database, 'Usuario', userID);
    const subcollectionRef = collection(userRef, 'Settings');
    let price = 0;
    let type = ""

    // Obtener los documentos de la subcolección
    const querySnapshot = await getDocs(subcollectionRef);

    for (let doc of querySnapshot.docs) {
      const data  = doc.data();
      const id = doc.id;

      if(id === settingsID) {
        price = data.price

        if (data.aliment === "yes"){
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
    console.error('Error al obtener los datos de la subcolección:', error);
  }
};

