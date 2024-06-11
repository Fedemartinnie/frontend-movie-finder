import React, { useEffect, useRef, useState } from 'react'
import { Share, ScrollView, StyleSheet, 
    Text, TouchableOpacity, View, 
    Dimensions,
    Alert} 
    from 'react-native'
import { Favorite, FullMovie2 } from '../types'
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
import { CloseButton } from '../assets/closeButton'
import { Actors, Details, Sinopsis } from '../components/movieInfo'
import YoutubePlayer from 'react-native-youtube-iframe'
import {addFavorite, removeFavorite, getFavorites} from '../services/favorites'




type MovieScreenProps = RouteProp<{
    MovieScreen: { movie: FullMovie2 }
}, 'MovieScreen'>

export const MovieScreen: React.FC = () => {
    const route = useRoute<MovieScreenProps>()
    const { movie } = route.params
    const [selectedItem, setSelectedItem] = useState<string>('Sinópsis')    
    const [title, subtitle] = movie.title.split(':')
    const items = ['Sinópsis', 'Actores', 'Detalles']
    const [showTrailer, setShowTrailer] = useState<boolean>(false)
    const actualTrailerNumber = useRef<number>(0)
    const [trailerId, setTrailerId] = useState<string | undefined>(movie.trailer[actualTrailerNumber.current])

    const directors = Array.from(new Set(movie.director))

    useEffect(() => {
        console.log(movie.trailer)
    })

    //* SHARE
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

    //* TRAILER VIDEOS
    const handleTrailer = () => {
        console.log('trailers : \n',movie.trailer.length)
        console.log('\n----------------------------------------------------------------\nTrailerId --> \n', trailerId)
        if(movie.trailer.length > 0){
            setShowTrailer(true)
            console.log('showtrailer? ',showTrailer)
        }
        else {
            Alert.alert('No hay trailers disponibles')
        }
    }

    //* inrementa indice para pasar al siguiente trailer
    const handleNextVideo = () => {        
        actualTrailerNumber.current = actualTrailerNumber.current + 1
        if(actualTrailerNumber.current === movie.trailer.length){
            actualTrailerNumber.current = 0
        }        
        setTrailerId(movie.trailer[actualTrailerNumber.current])        
    }

    //* FAVORITES ----> ADD - REMOVE - GET ALL
    const handleFavorite = async() => {
        try{
            
            console.log('AGREGAR A FAVORITOS: \n')
            console.log(movie)
            const response = await addFavorite(movie._id, movie.images.posters[0])
            const json = await response.json()
            console.log(json)
            if (response.status === 201) {
                Alert.alert('Se agregó la película a la lista de favoritos')
            } else if (response.status === 409) {
                const responseRemove = await removeFavorite(movie._id)
                if (responseRemove.status === 200){
                    Alert.alert('Se eliminó la película de la lista de favoritos')
                }
            } 
        }catch{
            Alert.alert('Ocurrió un error al actualizar la lista de favoritos')
        }
    }


    return(
        <View style={styles.container}>            
            <ScrollView>
                <View>    
                    {showTrailer && movie.trailer.length > 0
                        ? (<View style={[styles.image]}>
                            <YoutubePlayer
                                height={Dimensions.get('window').height}
                                width={Dimensions.get('window').width}
                                play={true}
                                videoId={trailerId}
                                onChangeState={(state) => {
                                    if (state === 'ended') {
                                        handleNextVideo()
                                    }
                                }}
                            />
                            <TouchableOpacity style={styles.closeButton} onPress={() => setShowTrailer(false)}>
                                <CloseButton/>
                            </TouchableOpacity>
                        </View>)
                        : (<Carousel movies={movie.images.backdrops}/>)
                    }                
                </View>

                <View style={styles.movieInfo}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}             
                    <Text style={styles.rating}><Star/>   {movie.overallRating}</Text>
                    <View style={styles.microDetails}>
                        <Text><Year/>  {movie.releaseYear}  -    </Text>
                        <Text><Time/>  {movie.duration} min.   -   </Text>
                        <Text><Genre/>  {movie.genres[0]}</Text>
                    </View>
                </View>

                <View style={styles.interactions}>
                    <TouchableOpacity onPress={handleTrailer}>
                        <Trailer/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavorite}>                    
                        <HeartFav/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare}>
                        <ShareSvg/>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Rate/>
                    </TouchableOpacity>
                </View>

                <View style={styles.info}>
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
                        <View>
                            {selectedItem === 'Sinópsis' 
                                ? <Sinopsis plot={movie.plot}/>
                                : (selectedItem === 'Actores') 
                                    ? <Actors actors={movie.cast} directors={directors}/>
                                    : <Details movie={movie}/>
                            }
                        </View>                    
                    </View>
                </View>

            </ScrollView>

            <View style={styles.navbar}>
                <NavBar/>
            </View>
            
        </View>

    )
}


const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    blueDark: '#052539',
}

const styles= StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        resizeMode: 'contain'
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageFullScreen: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        backgroundColor: colors.blueDark
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
        backgroundColor: colors.blueDark,
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
        fontSize: 22,
    },
    rating: {
        padding: 25,
        fontSize: 25,
    },
    microDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20
    },


    interactions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1C4F70',
        padding:20,
    },
    info:{
        flex: 1,
        flexDirection:'column',
        borderWidth: 2,
        borderColor: '#EDE3E3',
        margin: '5%',
        marginBottom: 60,
        width: '90%',
        color: colors.white
    },
    details:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 0,
        paddingBottom: 0,     
        width: '100%',
        color: colors.white
    },
    items:{
        justifyContent: 'center',
        fontSize: 19,
        borderColor: '#EDE3E3',
        padding: 10,
        // borderRightWidth: 1,
        borderBottomWidth:2,
        width: '100%',
        paddingHorizontal: '7%', 
        textAlign: 'center',
        color: colors.white
    },
    selectedItem:{
        justifyContent: 'center',
        fontSize: 19,
        backgroundColor: '#EDE3E3',
        color: colors.blueDark,
        padding: 10,
        borderRightWidth: 2,
        borderBottomWidth:2,
        borderColor: '#EDE3E3',
        paddingHorizontal: '7%',
        width: '100%',
        textAlign: 'center'
    },
    // detailsInfo: {
    //     fontSize: 20, 
    //     paddingTop: 20,
    //     paddingBottom: 20,
    //     // paddingHorizontal: '7%', 
    //     marginHorizontal: '5%', 
    //     borderColor: '#EDE3E3', 
    //     // borderWidth: 2,
    //     // marginBottom: 60,
    // },
    navbar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
})