import React, { useEffect, useState } from 'react'
import { Modal, Share, ScrollView, StyleSheet, 
    Text, TouchableOpacity, View, 
    Image, Dimensions} 
    from 'react-native'
import { FullMovie2 } from '../types'
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
// import Video from 'react-native-video'
import YoutubePlayer from 'react-native-youtube-iframe'


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
    const trailerId = movie.trailer[0]

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const directors = Array.from(new Set(movie.director))

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible)
    }
    useEffect(() => {
        console.log(movie.trailer)

    })

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


    const handleTrailer = () => {
        setShowTrailer(true)
        console.log('showtrailer? ',showTrailer)
        console.log('url trailer: ',`https://www.youtube.com/watch?v=${movie.trailer[0]}`)
    }

    return(
        <View style={styles.container}>
            {/* <View style={styles.imageFullScreen}>
                <YoutubePlayer
                    height={Dimensions.get('window').height}
                    width={Dimensions.get('window').width}
                    play={true}
                    videoId='Gx588FLU-mA' // Asegúrate de que movie.trailerUrl contiene el ID del tráiler de YouTube
                />
                <TouchableOpacity style={styles.closeButton} onPress={() => setShowTrailer(false)}>
                    <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
            </View> */}
            {/* <Modal
                style={styles.modal}
                visible={showTrailer}
                animationType="slide"
                onRequestClose={() => setShowTrailer(false)}
            >
                <View style={[styles.imageFullScreen]}>
                    <YoutubePlayer
                        height={Dimensions.get('window').height}
                        width={Dimensions.get('window').width}
                        play={true}
                        videoId='Gx588FLU-mA' // Asegúrate de que movie.trailerUrl contiene el ID del tráiler de YouTube
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowTrailer(false)}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal> */}

            {/* <Modal visible={isModalVisible} style={styles.modal}>                                
                <Image
                    style={styles.imageFullScreen}
                    source={{ uri: 'https://image.tmdb.org/t/p/w500'+movie.images.backdrops[0] }}
                />
                <View style={styles.closeButton}>
                    <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                        <CloseButton/>
                    </TouchableOpacity>
                </View>
            </Modal> */}

            <ScrollView>
                <View>    
                    {showTrailer 
                        ? (<View style={[styles.image]}>
                            <YoutubePlayer
                                height={Dimensions.get('window').height}
                                width={Dimensions.get('window').width}
                                play={true}
                                videoId={trailerId} // Asegúrate de que movie.trailerUrl contiene el ID del tráiler de YouTube
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
                    <HeartFav/>
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
        bottom: 0,
        justifyContent: 'center',
        marginLeft: '30%',
        alignItems: 'center',
        // width: '10%',
    },
    imageFullScreen: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        resizeMode: 'cover',
    },
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
        fontSize: 18,
    },
    rating: {
        padding: 15,
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
        width: '90%'
    },
    details:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 0,
        paddingBottom: 0,     
        width: '100%' 
    },
    items:{
        justifyContent: 'center',
        fontSize: 19,
        borderColor: '#EDE3E3',
        padding: 10,
        borderRightWidth: 2,
        borderBottomWidth:2,
        width: '100%',
        paddingHorizontal: '7%', 
        textAlign: 'center'
    },
    selectedItem:{
        justifyContent: 'center',
        fontSize: 19,
        backgroundColor: '#EDE3E3',
        color: 'black',
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