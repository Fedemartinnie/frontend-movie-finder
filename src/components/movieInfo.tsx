import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { Cast, Director, FullMovie2 } from '../types'

const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    blueDark: '#052539',
}

//* Details
export function Details({movie}: {movie: FullMovie2}) {
    return(
        <View>
            <View>
                <Text style={detailsStyles.title}>Fecha de Estreno:</Text>
                <Text style={detailsStyles.text}>{movie.releaseYear}</Text>
                <Text style={detailsStyles.title}>Duración</Text>
                <Text style={detailsStyles.text}>{movie.duration} min.</Text>
                <Text style={detailsStyles.title}>Géneros:</Text>
                <View style={{flexDirection: 'row', paddingLeft: 15, paddingBottom: 25}}>
                    {movie.genres.map ((genre, index) => 
                        <View key={index}>
                            <Text style={{fontSize: 15, color: colors.white}}>{genre}, </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}

const detailsStyles = StyleSheet.create({
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 15,
        paddingLeft: 15,
        color: colors.white
    },
    text:{
        fontSize: 15,
        paddingLeft: 15,
        paddingBottom: 15,
        color: colors.white
    }
})


//* Plot
export function Sinopsis({plot} : {plot: string}){
    return (
        <View style={plotStyle.plot}>
            <Text style={plotStyle.plotText}>{plot}</Text>
        </View>
    )
}

const plotStyle = StyleSheet.create({
    plot: {
        padding: 15,
        paddingHorizontal: 25,
        color: colors.white
    },
    plotText: {
        fontSize: 19,
        color: colors.white

    }
})

//* Actors & Director
type Props = {
    actors: Cast[];
    directors: Director[]; // Agregando el tipo de director aquí
};

export function Actors({ actors, directors }: Props) {
    return (
        <View>
            <View style={styles.title}>
                <Text style={styles.titleText}>Actors</Text>
            </View>
            <View style={styles.actorContainer}>
                
                {actors.map((actor) => (
                    <View key={actor._id} style={styles.actorItem}>
                        <Image
                            source={{ uri: 'https://image.tmdb.org/t/p/w500' + actor.photo }}
                            style={styles.actorImage}
                            accessibilityLabel={actor.name}  // Replacing `alt` with `accessibilityLabel`
                        />
                        <Text style={styles.actorName}>{actor.name}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.title}>
                <Text style={styles.titleText}>Directors</Text>
            </View>
            <View style={styles.actorContainer}>
                
                {directors.map((director) => (
                    <View key={director._id} style={styles.actorItem}>
                        <Image
                            source={{ uri: 'https://image.tmdb.org/t/p/w500' + director.photo }}
                            style={styles.actorImage}
                            accessibilityLabel={director.name}  // Replacing `alt` with `accessibilityLabel`
                        />
                        <Text style={styles.actorName}>{director.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    title:{
        padding: 20,  
        color: colors.white      
    },
    titleText:{
        fontSize: 20,
        fontWeight:'bold',
        color: colors.white
    },
    actorContainer: {
        flex : 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-around',
    },
    actorItem: {
        width: '50%',
        paddingBottom: 25,
        alignItems: 'center',
    },
    actorImage: {
        width: 150,
        height: 150,
    },
    actorName: {
        color: colors.white
    }
})