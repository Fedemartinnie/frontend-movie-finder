import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Movie } from '../../types'


export function ListOfMovies({ movies }: { movies: Movie[] }) {
    return (
        <View style={styles.container}>
            {movies.map((movie, index) => (
                <View style={styles.movieContainer} key={index}>
                    <Image source={{ uri: movie.image }} style={styles.movieImage} />
                    {/*<Text style={styles.movieTitle}>{movie.title}</Text>*/}
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
        padding: 10,
    },
    movieContainer: {
        width: '30%', // Para mostrar 3 películas por fila
        marginBottom: 20,
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
})