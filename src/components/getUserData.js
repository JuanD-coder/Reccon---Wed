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

/* export const obtenerIDsDocumentosLotes = async (userID) => {
    try {
        // Referencia a la colección del usuario
        const userCollectionRef = collection(database, 'User', userID, "Lotes");

        // Realizar consulta para obtener los documentos
        const querySnapshot = await getDocs(userCollectionRef);

        // Recorrer los documentos y obtener sus IDs 
        const idsDocumentos = querySnapshot.docs.map((doc) => doc.id);
        console.log('IDs de los documentos:', idsDocumentos);

        return idsDocumentos;

    } catch (error) {
        console.error('Error al obtener IDs de documentos:', error);
    }
}; */

export const consultarDatosLotes = async (userID) => {
    try {
        const userRef = doc(database, 'Usuario', userID);
        const subcollectionRef = collection(userRef, 'lotes');

        // Obtener los documentos de la subcolección
        const querySnapshot = await getDocs(subcollectionRef);

        // Recorrer los documentos de la subcolección
        querySnapshot.forEach((doc) => {
            console.log('ID del documento:', doc.id);
            console.log('Datos del documento:', doc.data());
            // Hacer algo con los datos del documento aquí
        });
    } catch (error) {
        console.error('Error al obtener los datos de la subcolección:', error);
    }
};

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