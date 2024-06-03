import React from 'react'
import { View, TextInput, Button, Text, 
    StyleSheet, KeyboardAvoidingView,}
    //NativeSyntheticEvent,
    //TextInputKeyPressEventData} 
    from 'react-native'
import { useSearch } from '../../hooks/useSearch'

//! si no usamos lodash desinstalarlo --> npm uninstall lodash
// import { debounce } from 'lodash'
// import { InputRefProps } from '../../types'

interface SearchBarProps {
    onSearch: (searchText: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
    const { search, updateSearch, error } = useSearch()
    

    const handleChange = (text: string) => {
        updateSearch(text)
    }

    const handleSearch = () => {
        if (error) return
        onSearch(search)
    }

    // const debouncedOnSearch = debounce(onSearch, 600)

    // const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {        
    //     debouncedOnSearch(search)    
    // }

    return (
        <View>
            <KeyboardAvoidingView style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <TextInput
                    // ref={inputRef}
                    style={{ flex: 1, height: 40, backgroundColor: colors.white , borderColor: error ? 'red' : 'grey', borderRadius: 10, borderWidth: 1,marginRight: 10, paddingHorizontal: 10, color: colors.black }}
                    placeholder="Avengers, The Matrix, Shrek ..."
                    placeholderTextColor={colors.black}
                    value={search}
                    onChangeText={handleChange}
                    // onKeyPress={handleKeyPress}
                />
                <Button title="Search" onPress={handleSearch} />
            </KeyboardAvoidingView>
            <View style={styles.sectionError}>
                {error && <Text style={{color: colors.red}}>{error}</Text>}
            </View>
        </View>
        
    )
}

const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    dark: '#201E1E',
}

const styles = StyleSheet.create({
    sectionError:{
        alignItems: 'center'
    }
})

export default SearchBar

