import React, { useState } from 'react'
import { SafeAreaView, ScrollView,
    StatusBar, StyleSheet, Text,
    useColorScheme, View,
    ActivityIndicator} 
    from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import SearchBar from '../components/home/searcher'
import NavBar from '../components/home/navBar.tsx'
import { Movies } from '../components/home/movies.tsx'
import { useMovies } from '../hooks/useMovies.tsx'
import { useSearch } from '../hooks/useSearch.tsx'
import { useScrollNavBar } from '../hooks/useNavBar.tsx'
import { SearchParams } from '../types.ts'



export function SearchScreen(): React.JSX.Element {
    // const inputRef = useRef<TextInput>(null)    
    const isDarkMode = useColorScheme() === 'dark'
    const { search } = useSearch()
    // const { movies, loading, getMovies } = useMovies({searchText: search})
    const [params, setParams] = useState<SearchParams>({ page: 1, name: search, sortByDate: null, sortByRating: null })
    const { movies, loading, getMovies } = useMovies({params})
    const { panResponder } = useScrollNavBar()

    
    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.blueDark : Colors.lighter,
    }


    const handleSearch = (searchText: string) => {
        console.log('searchText ----------> ',searchText)
        const newParams = {...params, name: searchText, page: 1}
        console.log (newParams)
        setParams(newParams)
        getMovies(newParams)
    }

    // const handleSearch = (searchText: string) => {
    //     getMovies(searchText)
    // }

    return (
        <SafeAreaView style={[backgroundStyle, { flex: 1}]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />

            <SearchBar onSearch={handleSearch} />

            <ScrollView                
                {...panResponder.panHandlers}
                scrollEventThrottle={16}
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