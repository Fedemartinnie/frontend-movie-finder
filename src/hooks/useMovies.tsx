/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'
import { Movie } from '../types'


export function useMovies({searchText} : {searchText: string}){
    const [movies,setMovies] = useState<Movie[] | null>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const previousSearch = useRef<string | null>(searchText)

    const getMovies = useCallback (async(searchText: string) => {
        if(searchText === previousSearch.current) return

        try{
            setLoading(true)
            setError(null)
            previousSearch.current = searchText
            const newMovies = await searchMovies({searchText})
            setMovies(newMovies)
        }
        catch (e){
            setError((e instanceof Error ? e.message : 'Ocurrió un Error en la búsqueda'))
        }
        finally{
            setLoading(false)
        }
    }, [])

    return { movies, getMovies, loading }

    /* const sortedMovies = useMemo(() => {
        if(!movies) return

        return sort 
            ? [...movies].sort((a,b) => a.title.localeCompare(b.title))
            : movies
    }, [sort, movies])*/
    
    //return { movies: sortedMovies, getMovies, loading }
}