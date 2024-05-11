import React, { useEffect, useRef } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView } from 'react-native'
import { Movie } from '../types'

const screenWidth = Dimensions.get('window').width

//! puse Movies para hacer prueba => esto va solo en el home (primeras 5 movies de la busqueda)
export function Carousel ({ movies }: { movies: Movie[] }) {
    const scrollRef = useRef<ScrollView>(null)
    
    let scrollX = 0
    
    useEffect(() => {
        const interval = setInterval(() => {
            scrollX += screenWidth
            if (scrollX >= screenWidth * movies.length) {
                scrollX = 0
            }
            if(scrollRef.current){
                scrollRef.current.scrollTo({ 
                    x: scrollX, animated: true,                     
                })
            }
            //console.log(scrollX)
        }, 3000)
        return () => clearInterval(interval)
    }, [movies])
    
    return(
        <ScrollView 
            ref={scrollRef} 
            horizontal 
            pagingEnabled={true} 
            style={styles.carouselContainer}
            onScroll={event => {
                scrollX = event.nativeEvent.contentOffset.x
            }}            
        >
            {movies.map((movie, index) => (
                <Image key={index} 
                    source={{ uri: movie.image }} 
                    style={styles.image} 
                    alt={movie.title}
                />
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    carouselContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 250
    },
    image: {
        width: screenWidth,
        height: '100%',
        resizeMode: 'cover', 
    },
})