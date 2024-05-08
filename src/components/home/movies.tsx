import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Movie } from '../../types'


function ListOfMovies({ movies }: { movies: Movie[] }) {
    return (
        <View style={styles.container}>
            {movies.map((movie) => (
                <View style={styles.movieContainer} key={movie.id}>
                    <Image source={{ uri: movie.image }} style={styles.movieImage} alt={movie.title}/>
                    {/*<Text style={styles.movieTitle}>{movie.title}</Text>*/}
                </View>
            ))}
        </View>
    )
}

function NoMoviesResults() {
    return <View><Text>No se encontraron resultados</Text></View>
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
})