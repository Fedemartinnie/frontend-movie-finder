import React from 'react'
import { Carousel } from '../components/carrusel'
import { Image, Text, View } from 'react-native'
import { FullMovie, RootStackParamList } from '../types'
import { RouteProp } from '@react-navigation/native'

type StackParamList = {
    MovieScreen: { movie: FullMovie | null };
}

interface MovieScreenProps {
    route: RouteProp<StackParamList>
}

interface Props {
    route: RouteProp<RootStackParamList, 'MovieScreen'>;
}

export const MovieScreen: React.FC<Props> = ({ route }) => {
    const { id } = route.params
    console.log('*****************\n',movie.title)

    return(
        <View>
            <Carousel movies={[]}/>
            <View>
                <Text>{movie.title}</Text>
                {/* Agrega aquí más detalles de la película según tus necesidades */}
            </View>
        </View>
    )
}