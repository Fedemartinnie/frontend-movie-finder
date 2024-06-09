import AsyncStorage from '@react-native-async-storage/async-storage'
import { SearchParams, FullMovie2, Movie2Base } from '../types'


interface Config {
    headers?: {
        [key: string]: string;
    }
    // Agrega otras propiedades relevantes según sea necesario
}
const URI = 'http://192.168.0.73:8000'
// const URI = 'http://18.118.165.190:8000' //* AWS ip
//*
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


//* Function to search a Movie By Id
export const searchMovie = async ({id}: {id: string}): Promise<FullMovie2 | null> => {
    try{
        console.log('search movie: ',id)
        const response = await fetch(`http://192.168.0.73:8000/movies/${id}`,{
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
export const logout = async({id} : {id: string}) => {
    try {
        await fetch(`URI/${id}`,{   
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


export const deleteAccount = async({id} : {id: string}) => {
    try {
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