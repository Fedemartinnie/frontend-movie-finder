import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { TextInput } from 'react-native'

export interface InputRefProps {
    inputRef: React.RefObject<TextInput>
}

export type RootStackParamList = {
    Home: undefined
    Search: undefined
    Profile: {user: User | null}
    Favs: {favorites: Favorite[] | null }
    MovieScreen: {movie: FullMovie2 | null}
    Splash: undefined,
    Login: undefined
}

export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile' | 'Home' | 'Search' | 'MovieScreen' | 'Splash' | 'Login'>

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
    overallRating: number,
    ratingsCount: number,
    trailer: string[]
}

export type Movie2Base = Pick<FullMovie2, '_id' | 'title' | 'genres' | 'releaseYear' | 'images' | 'overallRating'>


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

//* FAVORITES
export type Favorite = {
    _id: string,
    userdId: 'string',
    movieId: 'string',
    moviePosterURL: 'string'
}


export interface User {
    name: string;
    lastname: string;
    nickname: string; // Campo opcional
    email: string;
    profileImage?: string;
    accessToken?: string;
    refreshTokens?: string[];
}