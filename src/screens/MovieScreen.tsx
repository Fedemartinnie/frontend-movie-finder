import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions, Animated, Modal} from 'react-native'
import { Favorite, FullMovie2 } from '../types'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Carousel } from '../components/carrusel'
import NavBar from '../components/home/navBar'
import { Trailer } from '../assets/trailer'
import { HeartFav } from '../assets/heartFav'
import { Rate } from '../assets/rate'
import { Star, StarCalif, StarNotCalif } from '../assets/star'
import { Year } from '../assets/year'
import { Genre } from '../assets/genre'
import { Time } from '../assets/time'
import { ShareSvg } from '../assets/share'
import { AddFav } from '../assets/addFav'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { CloseButton } from '../assets/closeButton'
import MovieInfo from '../components/movieInfo'
import YoutubePlayer from 'react-native-youtube-iframe'
import { getFavorites } from '../services/favorites'
import useMovieScreen from '../hooks/useMovieScreen'
import { rateMovie } from '../services/movies'


type MovieScreenProps = RouteProp<{
    MovieScreen: { movie: FullMovie2 }
}, 'MovieScreen'>

export const MovieScreen: React.FC = () => {
    const route = useRoute<MovieScreenProps>()
    const { movie } = route.params
    const { scaleAnim, selectedItem, isFavorite, setIsFavorite, showTrailer, setShowTrailer, trailerId, handleShare, handleSelectedItem, handleTrailer, handleNextVideo, handleFavorite } = useMovieScreen (movie)
    const [title, subtitle] = movie.title.split(':')
    const items = ['Sinópsis', 'Actores', 'Detalles']
    const[isPressed, setIsPressed] = useState<boolean>(false)
    const [modal, setModal] = useState<boolean>(false)
    const stars = [Star, Star, Star, Star, Star]
    const [starSelected, setStarSelected] = useState<number | null>(null)
    const [votes, setVotes] = useState<number>(movie.ratingsCount)

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
    
    const onPressInHandler = () => {
        setIsPressed(true)
    }

    const onPressOutHandler = () => {
        setIsPressed(false)
    }

    const toggleModal = () => {
        setModal(!modal)
    }

    const handleRate = (index: number) => {
        if(index!== starSelected){
            setStarSelected(index)
            const rate = index + 1
            rateMovie(movie._id, rate)
            console.log('stars selected --> ', rate)
        }
        console.log(index)

        // setModal(!modal)
    }


    return(
        <View style={styles.container}>            
            <ScrollView>
                <View>    
                    {/* RENDER --> TRAILER || CAROUSEL */}
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
                {/* MOVIE INFO OF THE TOP */}
                <View style={styles.movieInfo}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && (
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    )}             
                    <Text style={styles.rating}><Star/>   {movie.overallRating.toString().slice(0, 4)}</Text>
                    <Text style={styles.ratingsCount}>(votos: {(movie.ratingsCount)})</Text>
                    <View style={styles.microDetails}>
                        <Text style={styles.menuInfo}><Year/>  {movie.releaseYear}  -    </Text>
                        <Text style={styles.menuInfo}><Time/>  {movie.duration} min.   -   </Text>
                        <Text style={styles.menuInfo}><Genre/>  {movie.genres[0]}</Text>
                    </View>
                </View>
                {/* OPTION BUTTONS --> TRAILER || FAVS || SHARE || RATE */}
                <View style={styles.interactions}>
                    <TouchableOpacity onPress={handleTrailer}>
                        <Trailer/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavorite}  onPressIn={onPressInHandler} onPressOut={onPressOutHandler}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            {isFavorite || isPressed ? <AddFav /> : <HeartFav />}
                        </Animated.View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={handleShare}>
                        <ShareSvg/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal}>
                        <Rate/>
                    </TouchableOpacity>
                </View>

                <View style={styles.info}>
                    {/* OPTIONS --> SINOPSIS && CAST && DETAILS*/}
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
                    {/* RENDER SINOPSIS || CAST || DETAILS*/}
                    <View > 
                        <MovieInfo movie={movie} selectedItem={selectedItem}/>                        
                    </View>
                </View>

            </ScrollView>

            <View style={styles.navbar}>
                <NavBar/>
            </View>

            <Modal 
                animationType='fade'
                visible={modal} 
                style={styles.modal} 
                transparent={true}>
                <View style={styles.modalBackground}>
                    <View style={styles.starsModal}>
                        <View style={{paddingTop: 10}}>
                            <Text style={{textAlign: 'center',fontSize: 18,color: colors.white}}>Califica la película</Text>
                        </View>
                        <View style={{flexDirection: 'row', paddingHorizontal: 15, paddingTop: '10%'}}>
                            {stars.map ((star, index) => (
                                <TouchableOpacity key={index} onLongPress={() => handleRate(index)} onPress={() => handleRate(index)}>
                                    <View style={{paddingHorizontal: 10}}>
                                        {starSelected !== null && index <= starSelected 
                                            ? (<StarCalif/>)
                                            : (<StarNotCalif/>)
                                        }
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <Animated.View style={[styles.closeButtonModal]}>
                        <TouchableOpacity onPress={toggleModal}>
                            <CloseButton />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
            
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
    starsModal:{
        borderColor: colors.white,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: colors.blueDark,
        paddingBottom: '20%',
        flexDirection: 'column',
    },
    modal: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2224DD',
    },
    closeButtonModal: {
        position: 'absolute',
        top: 5,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // modal: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     margin: 0,
    //     resizeMode: 'contain'
    // },
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
        color: colors.white,
        fontWeight: 'bold'
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
        fontSize: 15,
    },
    navbar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
})