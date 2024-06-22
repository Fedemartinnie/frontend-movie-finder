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
// import NavBar from '../components/home/navBar'
import { Trash } from '../assets/trash'


type FavoriteProps = RouteProp<{
    FavsScreen: { favorites: Favorite[] }
}, 'FavsScreen'>

export function FavsScreen(): React.JSX.Element {
    const route = useRoute<FavoriteProps>()
    const { favorites } = route.params
    const { page, setPage, showTrash, deletePosition, actualFavorites, setActualFavorites } = useFavs()
    const trashRef = useRef<View>(null)
    // const [page, setPage] = useState(1)
    const itemsPerPage = 9

    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const favoritesToShow = actualFavorites.slice(startIndex, endIndex)

    useEffect(() => {
        if (favorites) {
            setActualFavorites(favorites)
            // if(actualFavorites.length/9 < page && page > 1){
            //     setPage(page-1)
            // }
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
            <View style={styles.container}>
                {actualFavorites
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((favorite) => (
                    // {favoritesToShow.map((favorite) => (
                        <View key={favorite.movieId} style={styles.movieContainer}>
                            <FavoriteItem key={favorite._id} favorite={favorite} />
                        </View>                    
                    ))}
                {placeholders}
            </View>
            <View style={styles.paginationContainer}>                
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
                
            </View>
            {showTrash && (
                <View
                    ref={trashRef}
                    style={[styles.deleteContainer, { bottom: deletePosition }]}
                >
                    <TouchableOpacity>
                        <Trash />
                    </TouchableOpacity>
                </View>
            )}
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

const FavoriteItem: React.FC<FavoriteItemProps> = ({ favorite }) => {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { setShowTrash, actualFavorites, setActualFavorites, page, setPage } = useFavs()
    const pan = useRef(new Animated.ValueXY()).current
    const [zIndex, setZIndex] = useState(1)

    const handleDelete = async (movieId: string) => {
        try {
            const response = await removeFavorite(movieId)
            if (response.status === 404) {
                Alert.alert('No se ha encontrado la película en favoritos')
            } else {
                const favorites = await getFavorites()
                setActualFavorites(favorites)
                console.log('favorites length --> ', favorites.length/9)
                console.log('page number ---> ',page)
                console.log('true or false --->', favorites.length /9 < page)
                if(favorites.length/9 < page && favorites.length%9 === 0 && page > 1){
                    setPage(page-1)
                    console.log(page)
                }
                // setActualFavorites(actualFavorites.filter(fav => fav._id !== movieId))
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
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start(() => {
                        setZIndex(1)
                    })
                }
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
                            style={styles.movieImage}
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
                    <ActivityIndicator size='large' color={colors.blue} />
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
        backgroundColor: colors.blueDark
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
        // padding: 20,
        backgroundColor: colors.blueDark,
        // paddingHorizontal: 10,
    },
    pageButton: {
        padding: 10,
        color: colors.white,
        borderRadius: 5,
        // paddingHorizontal: 20,
    },
    pageButtonText: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: 25,
        // paddingHorizontal: 10,
    },
})
