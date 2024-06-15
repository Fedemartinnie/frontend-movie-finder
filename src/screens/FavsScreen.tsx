import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native'
import NavBar from '../components/home/navBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getFavorites } from '../services/favorites'
import { Movies } from '../components/home/movies'
import { Favorite } from '../types'

export function FavsScreen(): React.JSX.Element {
    const[favorites, setFavorites] = useState<Favorite[]>([])


    useEffect(() => {
        const favorites = async() =>{
            const actualFavorites = await getFavorites()
            setFavorites(actualFavorites)
        }
        favorites()
    },[])


    return(
        <SafeAreaView>            
            <View>
                <Text>Vista de favoritos</Text>
                {/* <Movies movies={favorites ?? []}/> */}
                <NavBar/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({

})