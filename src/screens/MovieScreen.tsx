import React, { useState } from 'react'
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


type MovieScreenProps = RouteProp<{
    MovieScreen: { movie: FullMovie2 }
}, 'MovieScreen'>

export const MovieScreen: React.FC = () => {
    const route = useRoute<MovieScreenProps>()
    const { movie } = route.params
    const [selectedItem, setSelectedItem] = useState<string>('Sinópsis')
    
    // const [title, subtitle] = movie.title.split(':')
    // const [year, month, day] = movie.releaseYear.split('-')    
    // const [genre, ...restGenre] = movie.genres.split(',')
    const items = ['Sinópsis', 'Actors', 'Directors']

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible)
    }

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
            <Modal visible={isModalVisible} style={styles.modal}>
                {/* <Image
                    style={styles.imageFullScreen}
                    source={{ uri: movie.images.backdrops[0] }}
                /> */}
                <View style={styles.closeButton}>
                    <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                        <CloseButton/>
                    </TouchableOpacity>
                </View>
            </Modal>
            <ScrollView>
                <View>
                    {/* <TouchableOpacity onPress={toggleModal}>
                        <Image 
                            key={movie._id} 
                            src={'https://image.tmdb.org/t/p/w500'+movie.images.backdrops[0]}
                            alt={movie.title}
                            style={styles.image}
                        />
                    </TouchableOpacity> */}
                </View>
                <View style={styles.movieInfo}>
                    <Text style={styles.title}>{movie.title}</Text>
                    {/* <Text style={styles.subtitle}>{subtitle}</Text> */}
                    
                    <Text style={styles.rating}><Star/>   {movie.rating}</Text>
                    <Text><Year/>  {movie.releaseYear}  -      <Time/>  {movie.duration}      -      <Genre/>  {/*movie.genres[0]*/}</Text>
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
                                ? movie.cast[0]?.name
                                : movie.director[0]?.name}                                                
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
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    closeButton: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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