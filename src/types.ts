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
    Favs: undefined
    MovieScreen: {movie: FullMovie2 | null}
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
    imdbRating: number;
    imdbVotes: string;
    totalSeasons: string;
}


export interface Director {
    name: string;
    photo: string | null;
    _id: string;
}

export interface Cast {
    name: string;
    photo: string | null;
    _id: string;
}

export interface Images {
    backdrops: string[];
    logos: string[];
    posters: string[];
}

export interface FullMovie2 {
    _id: string;
    title: string;
    plot: string;
    genres: string[];
    releaseYear: string;
    duration: number;
    director: Director[];
    cast: Cast[];
    images: Images;
    rating: number
}

export type Movie2Base = Pick<FullMovie2, '_id' | 'title' | 'genres' | 'releaseYear' | 'images'>


// Parámetros de Búsqueda (title, actor, genre, sortBy: Date / Rate)
export interface Params {
    name?: string;
    page?: number;    
    sortByDate?: number | null;
    sortByRating?: number | null;
    genre?: string;
}

export type SearchParams = Pick<Params, 'name' | 'page' | 'sortByDate' | 'sortByRating'>

export type HomeParams = Pick<Params, 'page' | 'sortByDate' | 'genre'>