import { SearchParams, FullMovie2, Movie2Base, Favorite } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Config {
    headers?: {
        [key: string]: string
    }
    // Agrega otras propiedades relevantes según sea necesario
}
const URI = 'http://192.168.0.73:8000' //! ip fede
// const URI = 'http://192.168.1.6:8000' //! ip jere
// const URI = 'http://18.118.165.190:8000' //* AWS ip

//* authToken
const token = async (config: Config = {}): Promise<Config> => {
    try {
        const authToken = await AsyncStorage.getItem('authToken')
        console.log('token_movies_services: ',authToken)
        if (authToken) {
            if (!config.headers) {
                config.headers = {}
            }
            config.headers['Authorization'] = `Bearer ${authToken}`
        }
    } catch (error) {
        console.error('Failed to fetch the token from storage', error)
    }
    return config
}

//*function para traer todos los resultados de una búsqueda
export const search = async (params: SearchParams): Promise<Movie2Base[] | null> => {

    console.log('\nparams from service: ',params)
    
    const searchParams = new URLSearchParams()

    Object.keys(params).forEach((key) => {
        const value = (params as any)[key]
        if (value !== null && value !== undefined) {
            searchParams.append(key, value.toString())
        }
    }) 

    const finalUrl = `${URI}/movies/?${searchParams.toString()}`
    
    try {
        const token = await AsyncStorage.getItem('authToken')
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }
        
        const response = await fetch(finalUrl, {
            headers: {
                'Content-Type': 'application/json',                    
                'Authorization': `Bearer ${token}`            
            }
        })
        console.log(response)
        if (!response.ok) {
            throw new Error('La solicitud no fue exitosa')
        }

        const json = await response.json()
        const movies = json.data
        return movies
    } catch (error) {
        console.error('Error en la búsqueda de películas:', error)
        throw new Error('Error en la búsqueda de películas')
    }
}

//* Function to search a Movie By Id
export const searchMovie = async ({id}: {id: string}): Promise<FullMovie2 | null> => {
    try{
        console.log('search movie: ',id)
        const token = await AsyncStorage.getItem('authToken') // Obtiene el token de AsyncStorage de forma asincrónica
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }
        const response = await fetch(`${URI}/movies/${id}`,{
            headers: {
                'Content-Type': 'application/json',                    
                'Authorization': `Bearer ${token}`                 
            }
        })
        console.log('*************************************************')
        if(!response.ok){
            throw new Error()
        }
        const movies = await response.json()

        return movies
    } catch (e) {
        throw new Error('Error opening Movie data')
    }

}


//*TODO
//* users Service
//* logout
export const logout = async({id} : {id: string}) => {
    try {
        await fetch(`${URI}/${id}`,{   
            method: 'PUT',         
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    }catch{
        throw new Error('Error Loging Out')
    }
}

//* delete account
export const deleteAccount = async({id} : {id: string}) => {
    try {
        await fetch(`${URI}/${id}`,{
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

