import React from 'react'
import { Share, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import { FullMovie, RootStackParamList } from '../types'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Carousel } from '../components/carrusel'
import NavBar from '../components/home/navBar'
import { Trailer } from '../assets/trailer'
import { HeartFav } from '../assets/heartFav'
import { Rate } from '../assets/rate'
import { Star } from '../assets/star'
import { Year } from '../assets/year'
import { Genre } from '../assets/genre'
import { Time } from '../assets/time'
import { ShareSvg } from '../assets/share'


type MovieScreenProps = RouteProp<{
    MovieScreen: { movie: FullMovie }
}, 'MovieScreen'>

export const MovieScreen: React.FC = () => {
    const route = useRoute<MovieScreenProps>()
    const { movie } = route.params
    const [title, subtitle] = movie.title.split(': ')
    const [day, month, year] = movie.released.split(' ')    
    const [genre, ...restGenre] = movie.genre.split(',')

    const handleShare = async () => {
        try{
            //const currentURL = await Linking.getInitialURL()
            //if(currentURL){
            await Share.share({
                message: `*Movie Finder*\nMira esta película: \n\n *${movie.title}* \n*Sinópsis:* ${movie.plot}`
            })            
        }catch(error){
            console.log('Error Sharing: ', error)
        }
    }

    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.movieInfo}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                    <Text style={styles.rating}><Star/>   {movie.imdbRating/2}</Text>
                    <Text><Year/>  {year} -  <Time/>  {movie.runtime} -  <Genre/>  {genre}</Text>
                </View>            
                <View style={styles.interactions}>
                    <Trailer/>
                    <HeartFav/>
                    <TouchableOpacity onPress={handleShare}>
                        <ShareSvg/>
                    </TouchableOpacity>
                    <Rate/>
                </View>
                <View style={styles.details}>
                    <Text style={styles.items}>
                        Sinópsis
                    </Text>
                    <Text style={styles.items}>
                        Actors
                    </Text>
                    <Text style={styles.items}>
                        Directors
                    </Text>                    
                </View>
            </ScrollView>
            <View style={styles.navbar}>
                <NavBar/>
            </View>
        </View>

    )
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#052539'
    },
    movieInfo: {  
        flexDirection: 'column',      
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#052539',
        padding: 30
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 20, 
        color: 'white'
    },
    subtitle: {
        fontSize: 18
    },
    rating: {
        padding: 10,
        fontSize: 25,
    },
    interactions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 20     
    },
    details:{
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20
    },
    items:{
        borderColor: 'white',
        padding: 10,
        borderRadius: 2,
        borderWidth: 2,
        paddingHorizontal: 30,        
    },
    navbar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
})