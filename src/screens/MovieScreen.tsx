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
import { AddFav } from '../assets/addFav'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { CloseButton } from '../assets/closeButton'
import { Actors, Details, Sinopsis } from '../components/movieInfo'
import YoutubePlayer from 'react-native-youtube-iframe'
import {addFavorite, removeFavorite, getFavorites} from '../services/favorites'
import useMovieScreen from '../hooks/useMovieScreen'



type MovieScreenProps = RouteProp<{
    MovieScreen: { movie: FullMovie2 }
}, 'MovieScreen'>

export const MovieScreen: React.FC = () => {
    const route = useRoute<MovieScreenProps>()
    const { movie } = route.params
    const { selectedItem, isFavorite, setIsFavorite, showTrailer, setShowTrailer, trailerId, handleShare, handleSelectedItem, handleTrailer, handleNextVideo, handleFavorite } = useMovieScreen (movie)
    const [title, subtitle] = movie.title.split(':')
    const items = ['Sinópsis', 'Actores', 'Detalles']
    const directors = Array.from(new Set(movie.director))

    //* GET ALL FAVS
    useEffect(() => {
        const checkFavorite = async() => {
            const favoriteMovies = await getFavorites()
            if(favoriteMovies.some((favMovie: Favorite) => favMovie.movieId === movie._id)){
                setIsFavorite(true)
            }
            else{
                setIsFavorite(false)
            }
        }
        checkFavorite()
    },[])
    

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
                    <Text style={styles.ratingsCount}>(votos: {movie.ratingsCount})</Text>
                    <View style={styles.microDetails}>
                        <Text style={styles.menuInfo}><Year/>  {movie.releaseYear}  -    </Text>
                        <Text style={styles.menuInfo}><Time/>  {movie.duration} min.   -   </Text>
                        <Text style={styles.menuInfo}><Genre/>  {movie.genres[0]}</Text>
                    </View>
                </View>

                <View style={styles.interactions}>
                    <TouchableOpacity onPress={handleTrailer}>
                        <Trailer/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavorite}>
                        {isFavorite ? <AddFav /> : <HeartFav />}
                        {/* <HeartFav/> */}
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
    violet: '#3C0C79'
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
        color: colors.white
    },
    rating: {
        paddingTop: 25,
        fontSize: 25,
        color: colors.white
    },
    ratingsCount:{
        paddingBottom: 25,
        fontSize: 16,
        color: colors.white
    },
    microDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 20,        
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
        color: colors.white,
        borderColor: colors.white,
        borderWidth: 2,
    },
    items:{
        justifyContent: 'center',
        fontSize: 19,        
        padding: 10,
        width: '100%',
        paddingHorizontal: '7%',
        textAlign: 'center',
        color: colors.white
    },
    selectedItem:{
        justifyContent: 'center',
        fontSize: 19,
        backgroundColor: colors.white,
        color: colors.blueDark,
        padding: 10,
        borderRightWidth: 2,
        borderBottomWidth:2,
        borderColor: colors.white,
        paddingHorizontal: '7%',
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    menuInfo:{
        color: colors.white,
        fontSize: 15
    },
    navbar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
})