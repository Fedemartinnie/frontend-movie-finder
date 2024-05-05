import { useEffect, useRef, useState } from 'react'

export function useSearch (){
    const [search, updateSearch] = useState<string>('')
    const [error, setError] = useState<null | string>(null)
    const isFirstInput = useRef(true)


    useEffect(() => {
        if(isFirstInput.current){
            isFirstInput.current = search === ''
            return
        }

        if(search === ''){
            setError('El campo esta vacío... Ingresa una película')
        }

        if(search.match(/^\d+$/)){
            setError('No se puede buscar una película con un número')
        }

        if(search.length<3){
            setError('La búsqueda debe tener al menos 3 caracteres')
        }

        setError(null)
    }, [search])

    return { search, updateSearch, error}
}