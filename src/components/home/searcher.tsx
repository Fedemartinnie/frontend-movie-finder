import React, { useState } from 'react'
import { View, TextInput, Button, Alert, ScrollView, Text, StyleSheet } from 'react-native'
import { InputRefProps } from '../../types'
import { useSearch } from '../../hooks/useSearch'
import { useMovies } from '../../hooks/useMovies'
import { Movies } from './movies'


const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    dark: '#201E1E',
}


const SearchBar: React.FC<InputRefProps> = ({inputRef}) => {
    const { search, updateSearch, error } = useSearch()
    const { movies, getMovies } = useMovies( {searchText: search} )
    

    const handleSearch = () => {

        if (search.trim() !== '') {            
            getMovies(search)
            Alert.alert('Búsqueda realizada', `Has buscado: ${search}`)
        } else {
            Alert.alert('Campo de búsqueda vacío', 'Por favor ingresa un término de búsqueda')
        }
    }

    const handleChange = (text: string) => {
        updateSearch(text)
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
                    onChangeText={handleChange}
                />
                <Button title="Search" onPress={handleSearch} />
            </View>
            <View style={styles.sectionError}>
                {error && <Text style={{color: colors.red}}>{error}</Text>}
            </View>
            <ScrollView contentContainerStyle={{ flexDirection: 'row', padding: 10 }}>
                <Movies movies={movies?? []}/>
            </ScrollView>
        </View>
        
    )
}

const styles = StyleSheet.create({
    sectionError:{
        alignItems: 'center'
    }
})

export default SearchBar
