import { useNavigation } from '@react-navigation/native'
import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'
import { Favorite, ProfileScreenNavigationProp } from '../types'
import { getFavorites } from '../services/favorites'
import { Animated, PanResponder, PanResponderInstance } from 'react-native'

interface FavsContextProps {
    
    showTrash: boolean
    setShowTrash: React.Dispatch<React.SetStateAction<boolean>>
    deletePosition: Animated.Value
    
}

const FavsContext = createContext<FavsContextProps | undefined>(undefined)

export default function FavsProvider({ children }: { children: ReactNode }) {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [showTrash, setShowTrash] = useState<boolean>(false)
    const deletePosition = useRef(new Animated.Value(100)).current
    // const pan = useRef(new Animated.ValueXY()).current
    // const [zIndex, setZIndex] = useState(1)

    // const panResponder = useRef(
    //     PanResponder.create({
    //         onMoveShouldSetPanResponder: () => true,
    //         onPanResponderGrant: () => {
    //             setShowTrash(true)
    //             setZIndex(10)
    //         },
    //         onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
    //             useNativeDriver: false,
    //         }),
    //         onPanResponderRelease: () => {
    //             setShowTrash(false)
    //             Animated.spring(pan, {
    //                 toValue: { x: 0, y: 0 },
    //                 useNativeDriver: true,
    //             }).start(() => {
    //                 setZIndex(1)
    //             })
    //         },
    //     })
    // ).current

    return (
        <FavsContext.Provider value={{ showTrash, setShowTrash, deletePosition }}>
            {children}
        </FavsContext.Provider>
    )
}

// Hook para usar el contexto
// export const useFavs = () => useContext(FavsContext)
export const useFavs = (): FavsContextProps => {
    const context = useContext(FavsContext)
    if (context === undefined) {
        throw new Error('useFavs debe usarse dentro de un FavsProvider')
    }
    return context
}