/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useMemo, useCallback } from 'react'
import { search } from '../services/movies'
import { Movie, Movie2Base, SearchParams } from '../types'
import { Keyboard } from 'react-native'


export function useMovies({params} : {params: SearchParams}){
    const [movies,setMovies] = useState<Movie2Base[] | null>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const previousSearch = useRef<string | null>(params.name ?? null)
    const previousPage = useRef<number | null>(params.page ?? null)
    const previousParams = useRef(params)

    const getMovies = useCallback (async(params: SearchParams) => {
        if( 
            params.page === previousParams.current.page
            && params.name && params.name === previousParams.current.name 
            && params.sortByDate === previousParams.current.sortByDate 
            && params.sortByRating === previousParams.current.sortByRating
        ) {
            console.log('no se repite la búsqueda')

            return 
        }

        try{
            console.log('getMovies: params ',params)
            setLoading(true)
            setError(null)
            previousSearch.current = params.name ?? null
            previousParams.current = params
            console.log('previousParams.current --> ',previousParams.current)
            console.log('*** ***',params)
            const newMovies = await search(params)
            setMovies(newMovies)
        }
        catch (e){
            setError((e instanceof Error ? e.message : 'Ocurrió un Error en la búsqueda'))
        }
        finally{
            setLoading(false)            
            Keyboard.dismiss()
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