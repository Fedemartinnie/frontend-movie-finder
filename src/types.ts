import React from 'react'
import { TextInput } from 'react-native'

export interface InputRefProps {
    inputRef: React.RefObject<TextInput>
}

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