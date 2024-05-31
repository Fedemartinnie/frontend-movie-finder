import React from 'react'
import {View, Text} from 'react-native'
import NavBar from '../components/home/navBar'

export function FavsScreen(): React.JSX.Element {
    return(
        <View>
            <Text>Vista de favoritos</Text>
            <NavBar/>
        </View>
    )
}