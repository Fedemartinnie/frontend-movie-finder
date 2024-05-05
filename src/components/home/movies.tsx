import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Movie } from '../../types'

export function ListOfMovies({ movies }: { movies: Movie[] }) {
    return (
        <View style={styles.container}>
            {movies.map((movie) => (                
                <View style={styles.movieContainer} key={movie.id}>
                    <Image source={{ uri: movie.image }} style={styles.movieImage} />
                    <Text>{movie.title}</Text>
                </View>
            ))}
        </View>
    )
}

export function NoMoviesResults() {
    return <Text>No se encontraron resultados</Text>
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
        paddingHorizontal: 10,
    },
    movieContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    movieImage: {
        width: 200,
        height: 300,
    },
})
