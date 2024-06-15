import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, Modal, View, Text, TouchableOpacity } from 'react-native'
import { Movie2Base, ProfileScreenNavigationProp } from '../types'
import { useNavigation } from '@react-navigation/native'
import { searchMovie } from '../services/movies'
import { CloseButton } from '../assets/closeButton'

const screenWidth = Dimensions.get('window').width

interface CarouselProps {
    movies: Movie2Base[] | string[]
}

//! puse Movies para hacer prueba => esto va solo en el home (primeras 5 movies de la busqueda)
export const Carousel: React.FC<CarouselProps> = ({ movies }) => {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const scrollRef = useRef<ScrollView>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string[]>([])

    let scrollX = 0
    
    useEffect(() => {
        const interval = setInterval(() => {
            scrollX += screenWidth
            if (scrollX >= screenWidth * movies.length) {
                scrollX = 0
            }
            if(scrollRef.current){
                scrollRef.current.scrollTo({ 
                    x: scrollX, animated: true,                     
                })
            }
            //console.log(scrollX)
        }, 3000)
        return () => clearInterval(interval)
    }, [movies])

    useEffect (() => {
        if(movies.every(item => typeof item === 'string')){
            setSelectedImage(movies as string[])
        }
    },[movies])
    
    const getImageUri = (item: Movie2Base | string, index: number): string => {
        // console.log('image.backdrops ---> ',item)
        if (typeof item === 'string') {
            return item
        } else {
            // console.log(item.images.backdrops)
            return item.images.posters[index]
        }
    }


    const handleImagePress = async(item: Movie2Base | string, index: number) => {
        if(typeof item === 'string' ){
            setIsModalVisible(true)
        }
        else{
            const movie = await searchMovie({id: item._id})
            navigation.navigate('MovieScreen', {movie})
        }
    }

    const closeModal = () => {
        setIsModalVisible(false)
    }

    return (
        <View>
            <ScrollView 
                ref={scrollRef}
                horizontal
                pagingEnabled={true}
                style={styles.carouselContainer}
                onScroll={event => {
                    scrollX = event.nativeEvent.contentOffset.x
                }}
            >            
                {movies.map((movie, index) => (
                    <TouchableOpacity key={index} onPress={() => handleImagePress(movie, index)}>
                        
                        <Image
                            key={index}
                            source={{ uri: 'https://image.tmdb.org/t/p/w500'+getImageUri(movie, index) }}
                            style={styles.image}
                            alt={typeof movie === 'string' ? '' : movie.title}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal        
                animationType="slide"
                transparent={false}
                visible={isModalVisible}
                onRequestClose={closeModal}
                supportedOrientations={['landscape']}
            >
                <ScrollView
                    style={styles.fullScreenModal}
                    pagingEnabled={true}
                >
                    {selectedImage.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: 'https://image.tmdb.org/t/p/w500' + getImageUri(image, index) }}
                            style={styles.modalImage}
                        />
                    ))}
                </ScrollView>
                <View style={styles.closeButton}>
                    <TouchableOpacity onPress={closeModal} >
                        <CloseButton/>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    carouselContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 250
    },
    image: {
        width: screenWidth,
        height: '100%',
        resizeMode: 'cover', 
    },
    fullScreenModal: {
        flex: 1,
        backgroundColor: 'black',
    },
    modalImage: {
        width: Dimensions.get('window').width ,
        height: Dimensions.get('window').height,
        resizeMode: 'contain',
        transform: [
            { rotate: '90deg' },
            { scale: 1.8 }
        ],
    },
    closeButton: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'flex-end',
        padding: 10,
        width: '100%',
    },
})