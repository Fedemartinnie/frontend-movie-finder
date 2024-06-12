import { Favorite } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Config {
    headers?: {
        [key: string]: string
    }
    // Agrega otras propiedades relevantes según sea necesario
}

// const URI = 'http://192.168.0.73:8000' //! ip fede
// const URI = 'http://192.168.1.6:8000'     //! ip jere
const URI = 'http://18.221.46.103:8000' //* AWS ip


//*TODO


//* FAVORITES
//* ADD
export const addFavorite = async(movieId: string, poster: string) => { 
    console.log(movieId)
    console.log(poster)
    try{
        const token = await AsyncStorage.getItem('authToken')
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }
        console.log('TOKEN ---> ', token)
        const response = await fetch(`${URI}/users/favorites`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify({
                id: movieId,
                poster: poster
            })
        })
        return response
    } catch (error){
        throw new Error('no se puedo calificar la pelicula')
    }
}

//* REMOVE FAVORITE
export const removeFavorite = async(movieId: string) => {
    try{
        const token = await AsyncStorage.getItem('authToken')
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }
        const response = await fetch(`${URI}/users/favorites/${movieId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        return response
    }catch (error){ 
        throw new Error('no se pudo eliminar la película de favoritos ')
    }
}

//* GET ALL FAVORITES
export const getFavorites = async(): Promise<Favorite[]> => {
    try{
        const token = await AsyncStorage.getItem('authToken')
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }
        const response = await fetch(`${URI}/users/favorites`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de favoritos')
        }
        const json = await response.json()
        const favorites = json.data
        if(favorites){
            return favorites
        }
        else{
            throw new Error ('no se pudo obtener las peliculas')
        }
    }catch{
        throw new Error('no se pudo obtener lista de favoritos')
    }
}
