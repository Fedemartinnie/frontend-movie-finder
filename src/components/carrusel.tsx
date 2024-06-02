import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView } from 'react-native'
import { Movie2Base } from '../types'
import { TouchableOpacity } from 'react-native-gesture-handler'

const screenWidth = Dimensions.get('window').width

interface CarouselProps {
    movies: Movie2Base[] | string[]
}

//! puse Movies para hacer prueba => esto va solo en el home (primeras 5 movies de la busqueda)
export const Carousel: React.FC<CarouselProps> = ({ movies }) => {
    const scrollRef = useRef<ScrollView>(null)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedImage, setSelectedImage] = useState('')
    
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
    
    const getImageUri = (item: Movie2Base | string, index: number): string => {
        console.log('image.backdrops ---> ',item)
        if (typeof item === 'string') {
            return item
        } else {
            
            return item.images.backdrops.length > 0 ? item.images.backdrops[index] : item.images.posters[index]
        }
    }
    
    const handleImagePress = (uri: string) => {
        setSelectedImage(uri)
        setIsModalVisible(true)
    }

    const closeModal = () => {
        setIsModalVisible(false)
        setSelectedImage('')
    }

    return (
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
                <TouchableOpacity key={index}>
                    
                    <Image
                        key={index}
                        source={{ uri: 'https://image.tmdb.org/t/p/w500'+getImageUri(movie, index) }}
                        style={styles.image}
                        alt={typeof movie === 'string' ? '' : movie.title}
                    />
                </TouchableOpacity>
            ))}
        </ScrollView>
        
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
})

// import React, { useEffect, useRef, useState } from 'react'
// import { Dimensions, Image, StyleSheet, ScrollView, Modal, View, Text } from 'react-native'
// import { Movie2Base } from '../types'
// import { TouchableOpacity } from 'react-native-gesture-handler'
// import { CloseButton } from '../assets/closeButton'

// const screenWidth = Dimensions.get('window').width

// interface CarouselProps {
//     movies: Movie2Base[] | string[]
// }

// //! puse Movies para hacer prueba => esto va solo en el home (primeras 5 movies de la busqueda)
// export const Carousel: React.FC<CarouselProps> = ({ movies }) => {
//     const scrollRef = useRef<ScrollView>(null)
//     const [isModalVisible, setIsModalVisible] = useState(false)
//     const [selectedImage, setSelectedImage] = useState('')
    
//     let scrollX = 0
    
//     useEffect(() => {
//         const interval = setInterval(() => {
//             scrollX += screenWidth
//             if (scrollX >= screenWidth * movies.length) {
//                 scrollX = 0
//             }
//             if(scrollRef.current){
//                 scrollRef.current.scrollTo({ 
//                     x: scrollX, animated: true,                     
//                 })
//             }
//             //console.log(scrollX)
//         }, 3000)
//         return () => clearInterval(interval)
//     }, [movies])
    
//     const getImageUri = (item: Movie2Base | string, index: number): string => {
//         console.log('image.backdrops ---> ',item)
//         if (typeof item === 'string') {
//             return item
//         } else {
//             return item.images.backdrops[index] || ''
//         }
//     }
    
//     const handleImagePress = (uri: string) => {
//         setSelectedImage(uri)
//         setIsModalVisible(true)
//     }

//     const closeModal = () => {
//         setIsModalVisible(false)
//         setSelectedImage('')
//     }

//     return (
//         <View>
//             <ScrollView
//                 ref={scrollRef}
//                 horizontal
//                 pagingEnabled={true}
//                 style={styles.carouselContainer}
//                 onScroll={event => {
//                     scrollX = event.nativeEvent.contentOffset.x
//                 }}
//             >
//                 {movies.map((movie, index) => (
//                     <TouchableOpacity 
//                         key={index}
//                         onPress={() => handleImagePress('https://image.tmdb.org/t/p/w500' + getImageUri(movie, index))}
//                     >
//                         <Image
//                             key={index}
//                             source={{ uri: 'https://image.tmdb.org/t/p/w500'+getImageUri(movie, index) }}
//                             style={styles.image}
//                             alt={typeof movie === 'string' ? '' : movie.title}
//                         />
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>
//             <Modal
//                 visible={isModalVisible}
//                 transparent={true}
//                 // onRequestClose={closeModal}
//             >
//                 <View style={styles.modalContainer}>
//                     <Image
//                         source={{ uri: selectedImage }}
//                         style={styles.fullscreenImage}
//                         resizeMode="contain"
//                     />
//                     <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
//                         {/* <CloseButton/> */}
//                         <Text>close</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Modal>
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     carouselContainer: {
//         flexDirection: 'row',
//         width: '100%',
//         height: 250
//     },
//     image: {
//         width: screenWidth,
//         height: '100%',
//         resizeMode: 'cover', 
//     },
//     modalContainer: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.8)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     fullscreenImage: {
//         width: '100%',
//         height: '80%',
//     },
//     closeButton: {
//         // position: 'relative',
//         bottom: 0,
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//     },
//     closeButtonText: {
//         fontSize: 16,
//         color: '#000',
//     },
// })