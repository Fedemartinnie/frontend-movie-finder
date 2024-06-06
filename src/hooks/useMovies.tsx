/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useMemo, useCallback } from 'react'
import { search } from '../services/movies'
import { Movie, Movie2Base, SearchParams } from '../types'
import { Keyboard } from 'react-native'


export function useMovies({params} : {params: SearchParams}/*{searchText} : {searchText: string}*/){
    const [movies,setMovies] = useState<Movie2Base[] | null>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const previousSearch = useRef<string | null>(params.name ?? null)
    const previousPage = useRef<number | null>(params.page ?? null)
    const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true)

    const getMovies = useCallback (async(params: SearchParams) => {
        if( params.page === previousPage.current && params.name && params.name === previousSearch.current) {
            console.log('no se repite la búsqueda')

            return 
        }

        //! Revisar si este codigo funciona para incrementar en 1 el previousPage si es != al params.page (cambio de pagina)
        if(params.page !== previousPage.current){
            previousPage.current = params.page ?? null
            console.log('*******************\n',previousPage.current)
        }


        try{
            console.log('getMovies: params ',params)
            setLoading(true)
            setError(null)
            previousSearch.current = params.name ?? null
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