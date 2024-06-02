import React, { useEffect, useState } from 'react'
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
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SortAsc } from '../assets/sortAsc.tsx'
import { SortDesc } from '../assets/sortDesc.tsx'


export function SearchScreen(): React.JSX.Element {
    // const inputRef = useRef<TextInput>(null)    
    const isDarkMode = useColorScheme() === 'dark'
    const { search } = useSearch()
    // const { movies, loading, getMovies } = useMovies({searchText: search})
    const [sortByRate, setSortByRate] = useState<number | null>(null)
    const [sortDate, setSortDate] = useState<number | null>(null)
    const [params, setParams] = useState<SearchParams>({ page: 1, name: search, sortByDate: sortDate, sortByRating: sortByRate })
    const { movies, loading, getMovies } = useMovies({params})
    const { panResponder } = useScrollNavBar()
    
    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.blueDark : Colors.lighter,
    }


    const handleSearch = (searchText: string) => {
        const newParams = {...params, name: searchText, page: 1}
        console.log (newParams)
        setParams(newParams)
        getMovies(newParams)
    }

    useEffect(() => {
        getMovies(params)
    },[params])

    // const handleSortRate = () => {
    //     if(sortByRate === null){
    //         setSortByRate(-1)
    //     }
    //     if(sortByRate === -1){
    //         setSortByRate(1)
    //     }
    //     if(sortByRate === 1){
    //         setSortByRate(null)
    //     }

    //     const newParams = { ...params, sortByRating: sortByRate, page: 1}
    //     setParams(newParams)
    //     console.log('sortByRate: ',params)
    // }

    const handleSortRate = () => {
        setSortByRate(prev => {
            const newValue = prev === 1 ? null : prev === -1 ? 1 : -1
            const newParams = { ...params, sortByRating: newValue, page: 1}
            setParams(newParams)
            return newValue
        })
    }
    
    const handleSortDate = () => {
        setSortDate(prev => {
            const newValue = prev === 1 ? null : prev === -1 ? 1 : -1
            const newParams = { ...params, sortByDate: newValue, page: 1}
            setParams(newParams)
            return newValue
        })
    }
    

    // const handleSortDate = () => {
    //     console.log(sortDate === null)
    //     if(sortDate === null){
    //         setSortDate(-1)
    //     }
    //     if(sortDate === -1){
    //         setSortDate(1)
    //     }
    //     if(sortDate === 1){
    //         setSortDate(null)
    //     }        
    //     const newParams = { ...params, sortByDate: sortDate, page: 1}
    //     setParams(newParams)
    //     console.log('sortByDate: ',params)
    // }

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

            <View style={styles.buttons}>
                <TouchableOpacity onPress={handleSortDate}>
                    <View style={styles.button}>
                        <Text style={styles.textButtonStyles}>Sort By Date</Text>
                        {sortDate !== null && (
                            <View>
                                {sortDate === -1 ? <SortDesc/> : <SortAsc/>}
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
                    
                <TouchableOpacity onPress={handleSortRate}>
                    <View style={styles.button}>
                        <Text style={styles.textButtonStyles}>Sort By Rating</Text>
                        {sortByRate && (
                            <View>
                                {sortByRate === -1 
                                    ? <SortDesc/> 
                                    : <SortAsc/>
                                }
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
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
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',        
    },
    button: {
        textAlign: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        margin: 60,
        marginTop: 20,
        marginBottom: 15,
        padding: 5,
        paddingHorizontal: 20,
        backgroundColor: '#3C0C79',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 20,        
    },
    textButtonStyles: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 10,
    },
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