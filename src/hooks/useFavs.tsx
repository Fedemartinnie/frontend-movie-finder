import React, { ReactNode, createContext, useContext, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { Favorite } from '../types'

interface FavsContextProps {
    showTrash: boolean
    setShowTrash: React.Dispatch<React.SetStateAction<boolean>>
    deletePosition: Animated.Value
    actualFavorites: Favorite[]
    setActualFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const FavsContext = createContext<FavsContextProps | undefined>(undefined)

export default function FavsProvider({ children }: { children: ReactNode }) {    
    const [actualFavorites, setActualFavorites] = useState<Favorite[]>([])
    const [showTrash, setShowTrash] = useState<boolean>(false)
    const deletePosition = useRef(new Animated.Value(100)).current    
    const [page, setPage] = useState(1)

    return (
        <FavsContext.Provider value={{ page, setPage, showTrash, setShowTrash, deletePosition, actualFavorites, setActualFavorites }}>
            {children}
        </FavsContext.Provider>
    )
}

//* HOOK PARA USAR EL CONTEXTO
export const useFavs = (): FavsContextProps => {
    const context = useContext(FavsContext)
    if (context === undefined) {
        throw new Error('useFavs debe usarse dentro de un FavsProvider')
    }
    return context
}