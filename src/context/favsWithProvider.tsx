import React from 'react'
import FavsProvider from '../hooks/useFavs'
import {FavsScreen} from '../screens/FavsScreen'


export const FavsWithProvider: React.FC = () => {
    return (
        <FavsProvider>
            <FavsScreen />
        </FavsProvider>
    )
}