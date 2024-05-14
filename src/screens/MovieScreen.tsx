import React, { useEffect, useState } from 'react'
import { Share, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Image, Dimensions } from 'react-native'
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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'


type MovieScreenProps = RouteProp<{
    MovieScreen: { movie: FullMovie }
}, 'MovieScreen'>

export const MovieScreen: React.FC = () => {
    const route = useRoute<MovieScreenProps>()
    const [selectedItem, setSelectedItem] = useState<string>('Sinópsis')
    const { movie } = route.params
    const [title, subtitle] = movie.title.split(': ')
    const [day, month, year] = movie.released.split(' ')    
    const [genre, ...restGenre] = movie.genre.split(',')

    const items = ['Sinópsis', 'Actors', 'Directors']

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

    const handleSelectedItem = (item: string) => {
        setSelectedItem(item)
    }


    return(
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Image 
                        key={movie.imdbID} 
                        src={movie.poster} 
                        alt={movie.title}
                        style={styles.image}
                    />
                </View>
                <View style={styles.movieInfo}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                    <Text style={styles.rating}><Star/>   {movie.imdbRating/2}</Text>
                    <Text><Year/>  {year}      -      <Time/>  {movie.runtime}      -      <Genre/>  {genre}</Text>
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
                    {items.map((item, index) => (
                        <TouchableWithoutFeedback
                            key={index}
                            onPress={() => handleSelectedItem(item)}
                        >
                            <Text style={selectedItem === item ? styles.selectedItem : styles.items}>
                                {item}
                            </Text>
                        </TouchableWithoutFeedback>
                    ))}
                </View>
                <View > 
                    <Text style={styles.detailsInfo}>
                        {selectedItem === 'Sinópsis' 
                            ? movie.plot 
                            : (selectedItem === 'Actors') 
                                ? movie.actors
                                : movie.directors}                                                
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
    image: {
        width: '100%',
        height: 250,
        resizeMode: 'cover', 
    },
    movieInfo: {  
        flexDirection: 'column',      
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#052539',
        paddingBottom: 20
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 20, 
        color: '#EDE3E3'
    },
    subtitle: {
        fontSize: 18
    },
    rating: {
        padding: 15,
        fontSize: 25,
    },
    interactions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1C4F70',
        padding:20,
    },
    details:{
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 0,
        
    },
    items:{
        fontSize: 19,
        borderColor: '#EDE3E3',
        padding: 10,
        borderWidth: 2,
        paddingHorizontal: '7%',      
    },
    selectedItem:{
        fontSize: 19,
        backgroundColor: '#EDE3E3',
        color: 'black',
        padding: 10,
        borderWidth: 2,
        borderColor: '#EDE3E3',
        paddingHorizontal: '7%',
    },
    detailsInfo: {
        fontSize: 20, 
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: '7%', 
        marginHorizontal: '2%', 
        borderColor: '#EDE3E3', 
        borderWidth: 2,
        marginBottom: 60,
    },
    navbar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
})