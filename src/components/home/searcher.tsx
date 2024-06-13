import React from 'react'
import { View, TextInput, Text, 
    StyleSheet, KeyboardAvoidingView,
    TouchableOpacity,}
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
    
    const handleClear = () =>{
        updateSearch('')
    }

    const handleChange = (text: string) => {
        updateSearch(text)
    }

    const handleSearch = () => {
        if (error) return
        onSearch(search)
    }
    //! ajustar para que funcione el debounce con la ultima letra escrita
    // const debouncedOnSearch = debounce(onSearch, 600)

    // const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {        
    //     debouncedOnSearch(search)    
    // }

    return (
        <View>
            <KeyboardAvoidingView style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <TextInput
                    // ref={inputRef}
                    style={{ flex: 1, marginTop: 15, height: 60,paddingLeft: 30, backgroundColor: colors.white , borderColor: error ? 'red' : 'grey', borderRadius: 10, borderWidth: 1,marginRight: 10, paddingHorizontal: 10, color: colors.black }}
                    placeholder="Avengers, The Matrix, Shrek ..."
                    placeholderTextColor={colors.black}
                    value={search}
                    onChangeText={handleChange}                    
                    onSubmitEditing={handleSearch}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>x</Text>
                    </TouchableOpacity>
                )}
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
    },
    clearButton: {
        position: 'absolute',
        right: 30,
        top: 25,
        height: 50,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    clearButtonText: {
        color: 'grey',
        fontSize: 38,
    },
})

export default SearchBar

