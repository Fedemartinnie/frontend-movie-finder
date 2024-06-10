import AsyncStorage from '@react-native-async-storage/async-storage'
import { SearchParams, FullMovie2, Movie2Base, Favorite } from '../types'


interface Config {
    headers?: {
        [key: string]: string;
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
export const search = async (params: SearchParams) : Promise<Movie2Base[] | null> => {    
    console.log('\nparams from service: ',params)
    
    const searchParams = new URLSearchParams()

    Object.keys(params).forEach((key) => {
        const value = (params as any)[key]
        if (value !== null && value !== undefined) {
            searchParams.append(key, value.toString())
        }
    }) 

    const finalUrl = `${URI}/movies/?${searchParams.toString()}`


    try{
        const response = await fetch(finalUrl)
        // const response = await fetch(finalUrl, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}`  // Agrega tu token de autenticación si es necesario
        //     }
        // })
        const json = await response.json()
        const movies = json.data
        
        return movies
    }
    catch{
        console.log(Error)
        throw new Error('Error Searching the Movie ')
    }
}


//* FUNCTION TO SEARCH MOVIE BY ID
export const searchMovie = async ({id}: {id: string}): Promise<FullMovie2 | null> => {
    try{
        console.log('search movie: ',id)
        const response = await fetch(`${URI}/movies/${id}`,{
            headers: {
                'Content-Type': 'application/json',                
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

//* FAVORITES
//* ADD
export const addFavorite = async(id: string, poster: string) => {  
    try{
        await fetch(`${URI}/favorites`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body:JSON.stringify({
                id: id,
                poster: poster
            })
        })
    } catch (error){
        throw new Error('no se puedo calificar la pelicula')
    }
}

//* REMOVE FAVORITE
export const removeFavorite = async(movieId: string) => {
    try{
        await fetch(`${URI}/favorites/${movieId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
    }catch (error){ 
        throw new Error('no se pudo eliminar la película de favoritos ')
    }
}

//* GET ALL FAVORITES
export const getFavorites = async(): Promise<Favorite[]> => {
    try{
        const response = await fetch(`${URI}/favorites`,{
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