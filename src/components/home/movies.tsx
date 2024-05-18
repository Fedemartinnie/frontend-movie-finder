import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { FullMovie, Movie } from '../../types'
import { MovieNotFound } from '../../assets/movieNotFound'
import { useNavigation } from '@react-navigation/native'
import { searchMovie } from '../../services/movies'
import { ProfileScreenNavigationProp } from '../../types'

function ListOfMovies({ movies }: { movies: Movie[] }) {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    
    const handlePress = async (id: string) => {
        const movie = await searchMovie({id})
        //navigation.navigate('MovieScreen', {id: id})
        navigation.navigate('MovieScreen', {movie})
    }

    return (
        <View style={styles.container}>
            {movies.map((movie) => (
                <TouchableOpacity 
                    key={movie.id}                    
                    style={styles.movieContainer}
                    onPress={() => handlePress(movie.id)}
                >
                    <Image source={{ uri: movie.image }} style={styles.movieImage} alt={movie.title}/>                    
                </TouchableOpacity>
            ))}
        </View>
    )
}

function NoMoviesResults() {
    return (
        <View style={styles.noResult}>
            <MovieNotFound/>
        </View>
    )
}

export function Movies({ movies }: { movies: Movie[] }) {
    const hasMovies = movies?.length > 0

    return hasMovies ? <ListOfMovies movies={movies} /> : <NoMoviesResults />
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
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
    movieTitle: {
        marginTop: 5,
        textAlign: 'center',
    },
    noResult:{
    }
})