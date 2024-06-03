import React, {  } from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Movie2Base } from '../../types'
import { MovieNotFound } from '../../assets/movieNotFound'
import { useNavigation } from '@react-navigation/native'
import { searchMovie } from '../../services/movies'
import { ProfileScreenNavigationProp } from '../../types'


//* With Results
function ListOfMovies({ movies }: { movies: Movie2Base[] }) {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    
    const handlePress = async (id: string) => {
        const movie = await searchMovie({id})
        navigation.navigate('MovieScreen', {movie})
    }

    const remainder = movies.length % 3
    const placeholders = Array.from({ length: remainder === 0 ? 0 : 3 - remainder }, (_, i) => (
        <View key={`placeholder-${i}`} style={styles.movieContainer}>
            <View style={styles.placeholderImage}></View>
        </View>
    ))

    return (
        <View style={styles.container}>
            {movies.map((movie) => (
                <TouchableOpacity 
                    key={movie._id}                    
                    style={styles.movieContainer}
                    onPress={() => handlePress(movie._id)}
                >
                    {movie.images.posters.length > 0 ? (
                        <Image 
                            source={{ uri: 'https://image.tmdb.org/t/p/w500'+movie.images.posters[0] }} 
                            style={styles.movieImage} 
                            alt={movie.title}/>
                    ) : (
                        <View style={styles.defaultImageContainer}>
                            <Text style={styles.defaultImageText}>{movie.title}</Text>
                        </View>
                    )}
                    
                </TouchableOpacity>
            ))}
            {placeholders}
        </View>
    )
}


//* With No Results
function NoMoviesResults() {
    return (
        <View style={styles.noResult}>
            <MovieNotFound/>
        </View>
    )
}


//* return movies
export function Movies({ movies }: { movies: Movie2Base[] }) {
    const hasMovies = movies?.length > 0

    return hasMovies ? <ListOfMovies movies={movies} /> : <NoMoviesResults />
}


//*styles
const styles = StyleSheet.create({
    container: {
        flex : 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'center',    
        justifyContent: 'space-around',
        padding: 10,
    },
    movieContainer: {
        width: '30%',
        marginBottom: 30,
        // paddingHorizontal: '2%'
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
})