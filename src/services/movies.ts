import { Movie, MovieDB } from '../types'

//const URI = 'localhost:8000/'
const API_KEY = '5883c0bc' // delete this when change api to endpoint URL

export const searchMovies = async ({searchText}: {searchText: string}): Promise<Movie[] | null> => {
    if(searchText === '') return null

    try{
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchText}`)
        const json: {Search: MovieDB[]} = await response.json()
        const movies = json.Search

        return movies?.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            image: movie.Poster
        }))
    }catch (e) {
        throw new Error('Error searching the movie')
    }
}