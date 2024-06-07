import { SearchParams, FullMovie2, Movie2Base } from '../types'

const URI = 'http://192.168.0.73:8000'
// const URI = 'http://18.118.165.190:8000' //* AWS ip

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

    const finalUrl = `${URI}/movies/results?${searchParams.toString()}`
    // console.log('url final: ', finalUrl)


    try{
        const response = await fetch(finalUrl)
        const json = await response.json()
        const movies = json.data
        // console.log('movies --> ', movies)
        
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