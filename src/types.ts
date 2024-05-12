import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { TextInput } from 'react-native'

export interface InputRefProps {
    inputRef: React.RefObject<TextInput>
}

export type RootStackParamList = {
    Home: undefined
    Search: undefined
    Profile: undefined
    MovieScreen: undefined
}

export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile' | 'Home' | 'Search' | 'MovieScreen'>

export interface Movie {
    id: string
    title: string
    year: string
    image: string
}

export interface MovieDB {
    imdbID: string
    Title: string
    Year: string
    Poster: string
}

export interface FullMovie {
    actors: string;
    awards: string;
    country: string;
    directors: string;
    genre: string;
    language: string;
    metascore: string;
    plot: string;
    poster: string;
    rated: string;
    ratings: { Source: string; Value: string }[];
    released: string;
    response: string;
    runtime: string;
    title: string;
    type: string;
    writer: string;
    year: string;
    imdbID: string;
    imdbRating: string;
    imdbVotes: string;
    totalSeasons: string;
}
