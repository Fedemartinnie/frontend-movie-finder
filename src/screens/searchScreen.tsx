import React, { useEffect, useRef, useState } from 'react'
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
import { Movie2Base, SearchParams } from '../types.ts'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SortAsc } from '../assets/sortAsc.tsx'
import { SortDesc } from '../assets/sortDesc.tsx'

interface ScrollEvent {
    layoutMeasurement: {
        height: number
    }
    contentOffset: {
        y: number
    }
    contentSize: {
        height: number
    }
}


export function SearchScreen(): React.JSX.Element {
    // const inputRef = useRef<TextInput>(null)    
    const isDarkMode = useColorScheme() === 'dark'
    const { search } = useSearch()
    const page = useRef<number>(1)
    const [sortByRate, setSortByRate] = useState<number | null>(null)
    const [sortDate, setSortDate] = useState<number | null>(null)
    const [params, setParams] = useState<SearchParams>({ page: 1, name: search, sortByDate: sortDate, sortByRating: sortByRate })
    const { movies, loading, getMovies } = useMovies({params})
    const { panResponder } = useScrollNavBar()
    const scrollViewRef = useRef<ScrollView>(null)
    const previousParamName = useRef(params.name)
    //!TODO
    const [moviesConcat, setMoviesConcat] = useState<Movie2Base[] | undefined>([])
    
    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.blueDark : Colors.lighter,
    }

    //* get movies onPress Search
    const handleSearch = (searchText: string) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: false })
        }
        page.current = 1
        setSortByRate(null)
        setSortDate(null)
        const newParams = {...params, name: searchText, page: 1, sortByDate: sortDate ,sortByRating: sortByRate}
        console.log (newParams)
        setParams(newParams)
        // getMovies(newParams)

    }

    //* get Movies if params change
    useEffect(() => {
        getMovies(params)
        // //* concatena newMovies con movies = getMovies(params)
        // if(params.name===previousParamName.current && (movies?.length !== null || movies?.length > 0)){
        //     if(movies){
        //         setMoviesConcat(prevState => {[...currentMovies, ...movies ?? []]})
        //     }
        // }    
    },[params])



    //* Sort by Rating
    const handleSortRate = () => {
        setSortByRate(prev => {
            const newValue = prev === 1 ? null : prev === -1 ? 1 : -1
            const newParams = { ...params, sortByRating: newValue, page: 1}
            setParams(newParams)
            return newValue
        })
    }
    
    //* Sort by Date
    const handleSortDate = () => {
        setSortDate(prev => {
            const newValue = prev === 1 ? null : prev === -1 ? 1 : -1
            const newParams = { ...params, sortByDate: newValue, page: 1}
            setParams(newParams)
            return newValue
        })
    }

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: ScrollEvent) : boolean=> {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
    }


    //! OJOOO AL CONCATENAR %21 puede ser === 0 pero podrían haber mas busquedas
    const handleEndReached = () => {
        if(!loading && (movies?.length ?? 0)%21 === 0){
            page.current = page.current + 1
            const newParams = { ...params, page: page.current }
            console.log('page params ----------> ',params.page)
            setParams(newParams)
        }
    }


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
                        {sortDate && (
                            <View>
                                {sortDate === -1 
                                    ? <SortDesc/> 
                                    : <SortAsc/>
                                }
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
                ref={scrollViewRef}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        handleEndReached()
                    }
                }}
                scrollEventThrottle={16}
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, {flex: 1}]}
            >
            
                {/* {movies && movies.length > 0 && params.page && params.page === 1 } */}
                {/* <Movies movies={moviesConcat ?? []}/> */}
                {/*
                * estoy tratando que NO muestre el movie not found si es la primera vez que se renderiza
                * esto no parece funcionar pero es un avance de la lógica
                */}
                {/* {movies && movies.length === 0 
                    ? (loading 
                        ? (
                            <View style={styles.sectionMovies}>
                                <Text>Loading...</Text>
                                <ActivityIndicator size={200} color="#0000ff" />
                            </View>
                        ) 
                        : <Movies movies={movies ?? []}/>
                    ) 
                    : (<Movies movies={movies ?? []}/>)
                } */}
                {loading 
                    ? (
                        <View style={styles.sectionMovies}>
                            <Text>Loading...</Text>
                            <ActivityIndicator size={200} color="#0000ff" />
                        </View>
                    ) 
                    : (<Movies movies={movies ?? []}/>)
                }              
            </ScrollView>
            
            <NavBar/>
            
        </SafeAreaView>
    )
}


//* STYLE SHEET
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
        paddingBottom: 10    
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
        borderRadius: 10,        
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