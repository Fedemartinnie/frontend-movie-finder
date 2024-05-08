import React from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, View } from 'react-native'
import { Movie } from '../types'

const screenWidth = Dimensions.get('window').width

export function Carousel ({ movies }: { movies: Movie[] }) {
    return(
        <View style={styles.carouselContainer}>
            <ScrollView horizontal pagingEnabled={true} style={styles.container}>
                {movies.map((movie, index) => (
                    <Image key={index} source={{ uri: movie.image }} style={styles.image} />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    carouselContainer:{
        width: '100%',
        height: 250
    },
    container: {
        flexDirection: 'row',
    },
    image: {
        width: screenWidth,
        height: '100%',
        resizeMode: 'cover', 
    },
})