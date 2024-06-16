import React, { useEffect, useRef, useState } from 'react'
import { View, SafeAreaView, Animated, TouchableOpacity, Text, TouchableWithoutFeedback, Image, StyleSheet, PanResponder, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { getFavorites } from '../services/favorites' // Ajusta las importaciones según tu estructura de archivos
// import FavoriteItem from './FavoriteItem' // Ajusta la ruta según tu estructura de archivos
// import { styles } from './styles' // Ajusta la ruta según tu estructura de archivos
// import { Favorite } from '../types'
import { searchMovie } from '../services/movies'
import { Favorite, ProfileScreenNavigationProp } from '../types'
import {useFavs} from '../hooks/useFavs'
import NavBar from '../components/home/navBar'


export function FavsScreen(): React.JSX.Element {
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const navigation = useNavigation()
    const {showTrash, deletePosition, } = useFavs()
    
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const actualFavorites = await getFavorites()
                setFavorites(actualFavorites)
            } catch (error) {
                console.error('Error fetching favorites:', error)
            }
        }

        fetchFavorites()
    }, [])

    const remainder = favorites.length % 3
    const placeholders = Array.from({ length: remainder === 0 ? 0 : 3 - remainder }, (_, i) => (
        <View key={`placeholder-${i}`} style={styles.movieContainer}>
            <View style={styles.placeholderImage}></View>
        </View>
    ))

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {favorites.map((favorite) => (
                    <View key={favorite.movieId} style={styles.movieContainer}>
                        <FavoriteItem key={favorite._id} favorite={favorite} />
                    </View>
                ))}
                {placeholders}
            </View>
            {showTrash && (
                <Animated.View style={[styles.deleteContainer, { bottom: deletePosition }]}>
                    <TouchableOpacity>
                        <Text style={styles.deleteText}>DELETE</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
            <View>
                <NavBar />
            </View>
        </SafeAreaView>
    )
}




// Ajusta la ruta según tu estructura de archivos

type FavoriteItemProps = {
    favorite: Favorite
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ favorite }) => {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { setShowTrash } = useFavs()
    const pan = useRef(new Animated.ValueXY()).current
    const [zIndex, setZIndex] = useState(1)

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setShowTrash(true)
                setZIndex(10)
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: () => {
                setShowTrash(false)
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start(() => {
                    setZIndex(1)
                })
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
            ) 
                : (<View style={{ flexDirection: 'column', margin: 30 }}>
                    <Text style={{ textAlign: 'center', fontSize: 13, paddingVertical: '20%'}}>Loading...</Text>
                    <ActivityIndicator size='large' color={colors.blue} />
                </View>)}
        </Animated.View>
    )
}

export default FavoriteItem


//* COLORS
const colors = {
    
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    blueDark: '#052539',
    violet: '#3C0C79'
}

const styles = StyleSheet.create ({
    loadingContainer: {
        paddingTop: '55%',
    },
    container: {
        flex : 1,
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
        backgroundColor: '#052539', // Color de fondo para los rectángulos placeholder
    },
    movieTitle: {
        marginTop: 5,
        textAlign: 'center',
    },
    noResult:{
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
        // bottom: 100, // Empieza fuera de la pantalla
        left: 0,
        right: 0,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        padding: 10,
    },
})