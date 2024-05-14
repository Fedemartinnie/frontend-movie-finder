import { FullMovie, Movie, MovieDB } from '../types'

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

export const searchMovie = async ({id}: {id: string}): Promise<FullMovie | null> => {
    try{
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
        const movie = await response.json()     
        console.log(movie)
        const transformedMovie = {
            actors: movie.Actors,
            awards: movie.Awards,
            country: movie.Country,
            directors: movie.Director,
            genre: movie.Genre,
            language: movie.Language,
            metascore: movie.Metascore,
            plot: movie.Plot,
            poster: movie.Poster,
            rated: movie.Rated,
            ratings: movie.Ratings,
            released: movie.Released,
            response: movie.Response,
            runtime: movie.Runtime,
            title: movie.Title,
            type: movie.Type,
            writer: movie.Writer,
            year: movie.Year,
            imdbID: movie.imdbID,
            imdbRating: movie.imdbRating,
            imdbVotes: movie.imdbVotes,
            totalSeasons: movie.totalSeasons
        }
        return transformedMovie    
    } catch (e) {
        throw new Error('Error opening Movie data')
    }

}