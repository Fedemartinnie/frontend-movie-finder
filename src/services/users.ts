import { SearchParams, FullMovie2, Movie2Base, Favorite } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Config {
    headers?: {
        [key: string]: string
    }
    // Agrega otras propiedades relevantes según sea necesario
}

const URI = 'http://192.168.0.73:8000' //! ip fede
// const URI = 'http://192.168.1.6:8000'     //! ip jere
// const URI = 'http://18.118.165.190:8000' //* AWS ip

//TODO
//* users Service
export const logout = async({id} : {id: string}) => {
    try {
        const token = await AsyncStorage.getItem('authToken')

        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }

        const response = await fetch(`URI/${id}`,{   
            method: 'PUT',         
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            return response
        }

    }catch{
        throw new Error('Error Loging Out')
    }
}


export const deleteAccount = async({id} : {id: string}) => {
    try {
        const token = await AsyncStorage.getItem('authToken')
        
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }

        await fetch(`URI/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    }catch{
        throw new Error('Error Loging Out')
    }
}
