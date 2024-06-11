import React from 'react'
import {View, Text} from 'react-native'
import NavBar from '../components/home/navBar'
import { SafeAreaView } from 'react-native-safe-area-context'

export function FavsScreen(): React.JSX.Element {
    return(
        <SafeAreaView>
            <View>
                <Text>Vista de favoritos</Text>
                <NavBar/>
            </View>
        </SafeAreaView>
    )
}