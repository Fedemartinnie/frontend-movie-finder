import { SearchParams, FullMovie2, Movie2Base } from '../types'

const URI = 'http://192.168.0.73:8000'
const API_KEY = '5883c0bc' // delete this when change public api to endpoint URL

//*function para traer todos los resultados de una búsqueda
export const search = async (params: SearchParams) : Promise<Movie2Base[] | null> => {
    // if (params.name && params.name==='') return null
    
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
        // console.log('Realizando el Fetch ----> \n')

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




// export const searchMovies = async ({searchText}: {searchText: string}): Promise<Movie[] | null> => {
//     if(searchText === '') return null

//     try{
//         const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchText}`)
//         const json: {Search: MovieDB[]} = await response.json()
//         const movies = json.Search

//         return movies?.map(movie => ({
//             id: movie.imdbID,
//             title: movie.Title,
//             year: movie.Year,
//             image: movie.Poster
//         }))
//     }catch (e) {
//         throw new Error('Error searching the movie')
//     }
// }

