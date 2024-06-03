import { useEffect, useRef, useState } from 'react'


export function useSearch (){
    const [search, updateSearch] = useState<string>('')
    const [error, setError] = useState<null | string>(null)
    const isFirstInput = useRef(true)


    useEffect(() => {
        if(isFirstInput.current){
            isFirstInput.current = search === ''
            // console.log('isFirstInput? ',isFirstInput)
            return
        }

        if(search === ''){
            setError('El campo esta vacío... Ingresa una película')
            return
        }

        if(search.match(/^\d+$/)){
            setError('No se puede buscar una película con un número')
            return
        }

        if(search.match(/%$#"+-_/)){
            setError('No se puede buscar una película con un caracteres especiales')
            return
        }

        if(search.length<3){
            setError('La búsqueda debe tener al menos 3 caracteres')
            return
        }

        setError(null)
    }, [search])

    return { search, updateSearch, error, isFirstInput}
}