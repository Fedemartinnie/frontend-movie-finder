import React, { useEffect } from 'react'
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Movie2Base } from '../../types'
import { MovieNotFound } from '../../assets/movieNotFound'
import { useNavigation } from '@react-navigation/native'
import { searchMovie } from '../../services/movies'
import { ProfileScreenNavigationProp } from '../../types'

function ListOfMovies({ movies }: { movies: Movie2Base[] }) {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    
    const handlePress = async (id: string) => {
        console.log('id -----------> ',id,'\n')
        const movie = await searchMovie({id})
        console.log('-------> ',movie, '<------------')
        navigation.navigate('MovieScreen', {movie})
    }

    useEffect(() => {
        console.log('movies recibidas en movies.tsx ',movies)
    },[])

    return (
        <View style={styles.container}>
            {movies.map((movie) => (
                <TouchableOpacity 
                    key={movie._id}                    
                    style={styles.movieContainer}
                    onPress={() => handlePress(movie._id)}
                >
                    <Image 
                        source={{ uri: 'https://image.tmdb.org/t/p/w500'+movie.images.posters[0] }} 
                        style={styles.movieImage} 
                        alt={movie.title}/>                    
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

export function Movies({ movies }: { movies: Movie2Base[] }) {
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