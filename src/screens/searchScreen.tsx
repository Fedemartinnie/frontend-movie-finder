import React, { useEffect, useRef } from 'react'
import { Button, Alert, SafeAreaView,ScrollView,
    StatusBar,StyleSheet,Text,TextInput,
    useColorScheme,View,
    ActivityIndicator,
    Animated} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
//import SearchBar from '../components/home/searcher'
import NavBar from '../components/home/navBar.tsx'
import { Movies } from '../components/home/movies.tsx'
import { useMovies } from '../hooks/useMovies.tsx'
import { useSearch } from '../hooks/useSearch.tsx'
import { useScrollNavBar } from '../hooks/useNavBar.tsx'


export function SearchScreen(): React.JSX.Element {
    const inputRef = useRef<TextInput>(null)    
    const isDarkMode = useColorScheme() === 'dark'
    const { search, updateSearch, error } = useSearch()
    const { movies, loading, getMovies } = useMovies({searchText: search})
    const { panResponder } = useScrollNavBar()

    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.blueDark : Colors.lighter,
    }

    const handleSearch = () => {
        getMovies(search)
    }


    return (
        <SafeAreaView style={[backgroundStyle, { flex: 1}]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                <TextInput                    
                    ref={inputRef}
                    style={{ borderColor: error? 'red' : 'transparent',                        
                        flex: 1, height: 40, backgroundColor: colors.white , borderRadius: 10, borderWidth: 1,marginRight: 10, paddingHorizontal: 10, color: colors.black }}
                    placeholder="Avengers, The Matrix, Shrek ..."
                    placeholderTextColor={colors.black}
                    value={search}
                    onChangeText={search => updateSearch(search)}
                />
                <Button title="Search" onPress={handleSearch} />
            </View>            
            <View style={styles.sectionError}>
                {error && <Text style={{color: colors.red}}>{error}</Text>}
            </View>
            <ScrollView                
                {...panResponder.panHandlers}
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, {flex: 1}]}
            >
                {loading ? (
                    <View style={styles.sectionMovies}>
                        <Text>Loading...</Text>
                        <ActivityIndicator size={200} color="#0000ff" />
                    </View>
                ) : (                
                    <Movies movies={movies ?? []}/>                    
                )}                
            </ScrollView>    
            
            <NavBar/>
            
        </SafeAreaView>
    )
}

const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    blueDark: '#052539',
}

const styles = StyleSheet.create({    
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionError: {
        alignItems: 'center',
    },
    sectionMovies: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },

})

export default SearchScreen