import React, { useEffect, useRef, useState } from 'react'
import { Animated, FlatList, Modal, SafeAreaView, StatusBar,
    StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, 
    useColorScheme, View, ScrollView,
    ActivityIndicator,
    NativeSyntheticEvent,
    NativeScrollEvent} 
    from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import NavBar from '../components/home/navBar.tsx'
import { Movies } from '../components/home/movies.tsx'
import { useMovies } from '../hooks/useMovies.tsx'
import { useSearch } from '../hooks/useSearch.tsx'
import { Carousel } from '../components/carrusel.tsx'
import { useScrollNavBar } from '../hooks/useNavBar.tsx'
import { Filter } from '../assets/filtrar.tsx'
import { CloseButton } from '../assets/closeButton.tsx'
import { HomeParams, Movie2Base } from '../types.ts'

function HomeScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark'
    const [params, setParams] = useState<HomeParams>({ sortByDate: -1 })
    const { movies, loading, getMovies } = useMovies({params})
    // const { panResponder, navbarTranslateY } = useScrollNavBar()
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const genres = ['Genres', 'Action', 'Animation', 'Adventure', 'Comedy','Crime','Documentary', 'Drama', 'Fantasy', 'History', 'Horror','Music','Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War']
    const [genreType, setGenreType] = useState<string>('Genres')
    const pageRef = useRef<number>(1)
    const [concatMovies, setConcatMovies] = useState<Movie2Base[]>([])

    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.blueDark : Colors.lighter,
    }
    
    //* renderiza movies cada vez queu cambien los params (genre or page)
    useEffect (() => {
        getMovies(params)
    },[params])


    useEffect (() => {
        if(movies && movies?.length > 0){
            setConcatMovies(prevConcatMovies => [...prevConcatMovies, ...movies])
        }
        console.log('moviesConcat ----> ',concatMovies.length)
    }, [movies])

    //* open or close modal to select Genre
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible)
    }    

    //* handler of Genre Type
    const handleGenreType = (genre: string) => {
        setGenreType(genre)
        setConcatMovies([])

        let newParams = { ...params, page: 1 }

        if (genre === 'Genres') {
            const { genre, ...restParams } = newParams // Crear una copia del objeto sin la key 'genre'
            newParams = restParams
        } else {
            newParams.genre = genre
        }
        pageRef.current = 1 // Reset page to 1 when changing genre
        setParams(newParams)       
        toggleModal()
    }


    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50
        if (isCloseToBottom && !loading) {
            pageRef.current += 1
            setParams((prevParams) => ({ ...prevParams, page: pageRef.current }))
        }
    }


    

    return (
        <SafeAreaView style={[backgroundStyle, { flex: 1}]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />

            <Animated.ScrollView                
                // {...panResponder.panHandlers}
                onScroll={handleScroll} 
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, {flex: 1}]}
                stickyHeaderIndices={[1]}
            >
                <View >
                    <Carousel movies={concatMovies?.slice(0, 5) ?? []}/>
                    <Text style={{position: 'relative', textAlign: 'center', fontSize: 40, fontWeight: 'bold'}}>TOP 5</Text>
                </View>
                <View style={styles.stickyButton}>
                    <TouchableOpacity onPress={toggleModal}>                    
                        <View style={styles.textView}>
                            <Filter/>
                            <Text style={styles.textStyle}>{genreType}</Text>                        
                        </View>
                    </TouchableOpacity>
                </View>

                {concatMovies.length > 0 
                    ? (
                        <>
                            <Movies movies={concatMovies ?? []}/>
                            <View style={styles.sectionMovies}>
                                <Text>Loading...</Text>
                                <ActivityIndicator size={200} color="#0000ff" />
                            </View>
                        </>
                    )
                    : (loading 
                        ? (
                            <View style={styles.sectionMovies}>
                                <Text>Loading...</Text>
                                <ActivityIndicator size={200} color="#0000ff" />
                            </View>
                        ) 
                        : (<Movies movies={concatMovies ?? []}/>)) 
                }                

            </Animated.ScrollView>

            <NavBar/>
            
            {/* Modal of Genre*/}
            <Modal 
                animationType='slide'
                visible={isModalVisible} 
                style={styles.modal} 
                transparent={true}>
                <View style={styles.modalBackground}>
                    <ScrollView 
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false} 
                        style={styles.genres}>

                        {genres.map((genre, index) => (
                            <TouchableOpacity key={index} onPress={() => handleGenreType(genre)}>
                                <Text style={styles.genreItem}>{genre}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.closeButton}>
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                            <CloseButton/>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>             
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
    sectionMovies: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    stickyButton: {
        width: '100%',
        backgroundColor: colors.blueDark
    },
    textView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        margin: 60,
        marginTop: 20,
        marginBottom: 15,
        padding: 5,
        backgroundColor: '#3C0C79',
        // backgroundColor: 'yellow',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 15,
    },
    textStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        paddingHorizontal: 10
    },    
    modal: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2224DD',
    },
    closeButton: {
        // position: 'relative',
        paddingBottom: 10,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    genres:{
        paddingTop: 150,
        // color: '#051AD7',
    },
    genreItem: {
        paddingVertical: 25,
        paddingHorizontal: 20,
        fontSize: 21,
        color: '#F3E7E7',
        textAlign: 'center',
    },
})

export default HomeScreen
