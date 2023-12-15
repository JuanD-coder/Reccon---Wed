import { getDoc, doc } from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";

export async function getUserData(userID) {
    try {
        const userRef = doc(database, 'User', userID);
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
}