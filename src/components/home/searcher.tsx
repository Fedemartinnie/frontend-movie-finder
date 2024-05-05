import React, { useState } from 'react'
import { View, TextInput, Button, Alert, ScrollView } from 'react-native'
import { InputRefProps } from '../../types'
import { useSearch } from '../../hooks/useSearch'
import { useMovies } from '../../hooks/useMovies'
import { Movies } from './movies'


const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2'
}


const SearchBar: React.FC<InputRefProps> = ({inputRef}) => {
    const { search, updateSearch } = useSearch()
    const { movies, getMovies } = useMovies( {searchText: search} )
    

    const handleSearch = () => {
        // Logic of search text
        if (search.trim() !== '') {            
            getMovies(search)
            console.log(search)
            console.log(movies)
            Alert.alert('Búsqueda realizada', `Has buscado: ${search}`)
        } else {
            Alert.alert('Campo de búsqueda vacío', 'Por favor ingresa un término de búsqueda')
        }
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <TextInput
                    ref={inputRef}
                    style={{ flex: 1, height: 40, backgroundColor: colors.white , borderColor: 'gray', borderRadius: 10, borderWidth: 1,marginRight: 10, paddingHorizontal: 10, color: colors.black }}
                    placeholder="Avengers, The Matrix, Shrek ..."
                    placeholderTextColor={colors.black}
                    value={search}
                    onChangeText={text => updateSearch(text)}
                />
                <Button title="Search" onPress={handleSearch} />
            </View>
            
            <ScrollView contentContainerStyle={{ flexDirection: 'row', padding: 10 }}>
                <Movies movies={movies?? []}/>
            </ScrollView>
        </View>
        
    )
}

export default SearchBar
