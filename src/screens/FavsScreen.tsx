import React, { useEffect, useRef, useState } from 'react'
import { View, Animated,SafeAreaView, TouchableOpacity, Text, 
    TouchableWithoutFeedback, Image, StyleSheet, PanResponder, 
    ActivityIndicator, Dimensions, Alert} 
    from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { getFavorites, removeFavorite } from '../services/favorites'
import { searchMovie } from '../services/movies'
import { Favorite, ProfileScreenNavigationProp } from '../types'
import {useFavs} from '../hooks/useFavs'
import { Trash } from '../assets/trash'
// import NavBar from '../components/home/navBar'


type FavoriteProps = RouteProp<{
    FavsScreen: { favorites: Favorite[] }
}, 'FavsScreen'>

export function FavsScreen(): React.JSX.Element {
    const route = useRoute<FavoriteProps>()
    const { favorites } = route.params
    const { page, setPage, showTrash, setShowTrash, deletePosition, actualFavorites, setActualFavorites } = useFavs()
    const trashRef = useRef<View>(null)
    const itemsPerPage = 9
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const deleteBounce = useRef(new Animated.Value(0)).current

    // useEffect para establecer showTrash en true al iniciar la pantalla
    useEffect(() => {
        setShowTrash(true)
        const timer = setTimeout(() => {
            setShowTrash(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [setShowTrash])

    useEffect(() => {
        if (showTrash) {
            Animated.sequence([
                Animated.timing(deletePosition, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(deleteBounce, {
                            toValue: 10,
                            duration: 100,
                            useNativeDriver: true,
                        }),
                        Animated.timing(deleteBounce, {
                            toValue: -10,
                            duration: 100,
                            useNativeDriver: true,
                        }),
                        Animated.timing(deleteBounce, {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: true,
                        })
                    ]),
                    { iterations: 3 } // Ajusta el número de rebotes aquí
                )
            ]).start()
        } else {
            Animated.timing(deletePosition, {
                toValue: 100,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }
    }, [showTrash])

    useEffect(() => {
        if (favorites) {
            setActualFavorites(favorites)
        }
    }, [favorites, setActualFavorites])

    const remainder = actualFavorites.length % 3
    const placeholders = Array.from({ length: remainder === 0 ? 0 : 3 - remainder }, (_, i) => (
        <View key={`placeholder-${i}`} style={styles.movieContainer}>
            <View style={styles.placeholderImage}></View>
        </View>
    ))

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {actualFavorites.length > 0 
                ? (<View style={styles.container}>
                    {actualFavorites
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((favorite) => (
                            <View key={favorite.movieId} style={styles.movieContainer}>
                                <FavoriteItem key={favorite._id} favorite={favorite} />
                            </View>                    
                        ))}
                    {placeholders}
                </View>)
                : (
                    <View style={[styles.container, {padding: 40, justifyContent: 'center', alignItems: 'center'}]}>
                        <Text style={{textAlign: 'center', fontSize: 20, color: colors.white}}>Aún no tienes películas agregadas a tu lista de favoritos ...</Text>
                    </View>
                )
            }

            {showTrash 
                ? (
                    <Animated.View
                        ref={trashRef}
                        style={[styles.deleteContainer, { transform: [{translateY: deletePosition }, { translateX: deleteBounce }]}]}
                    >
                        <TouchableOpacity>
                            <Trash />
                        </TouchableOpacity>
                    </Animated.View>
                )
                : (<View style={styles.paginationContainer}>                
                    {page > 1 
                        ? (
                            <TouchableOpacity onPress={() => setPage(page - 1)} style={styles.pageButton}>
                                <Text style={styles.pageButtonText}>{'<'}</Text>
                            </TouchableOpacity>
                        )

                        : (
                            <View style={styles.pageButton}>
                                <Text style={styles.pageButtonText}></Text>
                            </View>
                        )
                    }                
                    <View style={styles.pageButton}>
                        <Text style={styles.pageButtonText}>{page}</Text>
                    </View>
                    {endIndex < actualFavorites.length                 
                        ? (
                            <TouchableOpacity onPress={() => setPage(page + 1)} style={styles.pageButton}>
                                <Text style={styles.pageButtonText}>{'>'}</Text>
                            </TouchableOpacity>)
                        : (
                            <View style={styles.pageButton}>
                                <Text style={styles.pageButtonText}></Text>
                            </View>
                        )}
                    
                </View>)
            }
            {/* <NavBar/> */}
        </SafeAreaView>
    )
}

type FavoriteItemProps = {
    favorite: Favorite
}

const { width: maxWidthScreenDimension, height: maxHeightScreenDimension } = Dimensions.get('window')
const trashIconWidth = 75
const trashIconHeight = 75
const trashIconX = (maxWidthScreenDimension - trashIconWidth) / 2
const trashIconY = maxHeightScreenDimension - trashIconHeight

type ImageStyle = {
    width: number | string
    height: number | string
    borderRadius: number
}


const FavoriteItem: React.FC<FavoriteItemProps> = ({ favorite }) => {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { setShowTrash, setActualFavorites, page, setPage } = useFavs()
    const pan = useRef(new Animated.ValueXY()).current
    const [zIndex, setZIndex] = useState(1)
    // const [imageStyle, setImageStyle] = useState<ImageStyle>(styles.movieImage)
    const [imageGrow, setImageGrow] = useState<boolean>(true)

    const handleDelete = async (movieId: string) => {
        try {
            const response = await removeFavorite(movieId)
            if (response.status === 404) {
                Alert.alert('No se ha encontrado la película en favoritos')
            } else {
                const favorites = await getFavorites()
                setActualFavorites(favorites)
                if (favorites.length / 9 < page && favorites.length % 9 === 0 && page > 1) {
                    setPage(page - 1)
                }
            }
        } catch {
            Alert.alert('No se pudo eliminar la película de favoritos')
        }
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setShowTrash(true)
                setZIndex(10)
            },
            onPanResponderMove: (event, gestureState) => {
                pan.setValue({ x: gestureState.dx, y: gestureState.dy })

                const currentX = gestureState.moveX
                const currentY = gestureState.moveY

                const trashIconLayout = {
                    x: trashIconX,
                    y: trashIconY,
                    width: trashIconWidth,
                    height: trashIconHeight,
                }

                if (
                    currentX < trashIconLayout.x + trashIconWidth &&
                    currentX > trashIconLayout.x &&
                    currentY < trashIconLayout.y + trashIconLayout.height &&
                    currentY > trashIconLayout.y
                ) {
                    setImageGrow(false)
                    // setImageStyle({
                    //     width: 75,
                    //     height: 75,
                    //     borderRadius: 50,
                    // })                    
                } else {
                    setImageGrow(true)
                    // setImageStyle(styles.movieImage)
                }
            },
            onPanResponderRelease: (event, gestureState) => {
                const currentX = gestureState.moveX
                const currentY = gestureState.moveY
                const trashIconLayout = {
                    x: trashIconX,
                    y: trashIconY,
                    width: trashIconWidth,
                    height: trashIconHeight,
                }

                if (
                    currentX < trashIconLayout.x + trashIconWidth &&
        currentX > trashIconLayout.x &&
        currentY < trashIconLayout.y + trashIconLayout.height &&
        currentY > trashIconLayout.y
                ) {
                    handleDelete(favorite.movieId)
                } else {
                    setImageGrow(true)
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start(() => {
                        setZIndex(1)
                    })
                }                
                // setTimeout(() => {
                //     // setImageGrow(true)
                //     setImageStyle(styles.movieImage) // Restablece el estilo de la imagen con retraso
                // }, 2000)
                setShowTrash(false)
            },
        })
    ).current

    const handleFavorite = async (id: string) => {
        try {
            setIsLoading(true)
            const movie = await searchMovie({ id })
            navigation.navigate('MovieScreen', { movie })
        } catch (error) {
            console.error('Error navigating to MovieScreen:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[{ transform: pan.getTranslateTransform(), zIndex }]}
        >
            {!isLoading ? (
                <TouchableWithoutFeedback onPress={() => handleFavorite(favorite.movieId)}>
                    {favorite.moviePosterURL && favorite.moviePosterURL.slice(-4) === '.jpg' ? (
                        <Image
                            source={{ uri: 'https://image.tmdb.org/t/p/w500' + favorite.moviePosterURL }}
                            // style={imageStyle}
                            style={imageGrow ? styles.movieImage : styles.imageReduce}
                            alt={favorite.moviePosterURL}
                        />
                    ) : (
                        <View style={styles.defaultImageContainer}>
                            <Text style={styles.defaultImageText}>{favorite.moviePosterURL}</Text>
                        </View>
                    )}
                </TouchableWithoutFeedback>
            ) : (
                <View style={{ flexDirection: 'column', margin: 30 }}>
                    <Text style={{ textAlign: 'center', fontSize: 13, paddingVertical: '20%' }}>Loading...</Text>
                    <ActivityIndicator size="large" color={colors.blue} />
                </View>
            )}
        </Animated.View>
    )
}

export default FavoriteItem

const colors = {
    black: '#282828',
    blue: '#336699',
    red: '#993333',
    white: '#F2F2F2',
    blueDark: '#052539',
    violet: '#3C0C79'
}

const styles = StyleSheet.create({
    loadingContainer: {
        paddingTop: '55%',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: colors.blueDark,
    },
    movieContainer: {
        width: '30%',
        marginBottom: 30,
    },
    movieImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    placeholderImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#052539',
    },
    movieTitle: {
        marginTop: 5,
        textAlign: 'center',
    },
    noResult: {},
    imageReduce:{
        width: 75,
        height: 75,
        borderRadius: 50,
    },
    defaultImageContainer: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    defaultImageText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    deleteContainer: {
        position: 'absolute',
        alignSelf: 'center',
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: '5%',
        backgroundColor: colors.blueDark,
    },
    pageButton: {
        padding: 10,
        color: colors.white,
        borderRadius: 5,
    },
    pageButtonText: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: 25,
    },
})