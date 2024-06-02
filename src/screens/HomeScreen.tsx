import React, { useEffect, useState } from 'react'
import { Animated, FlatList, Modal, SafeAreaView, StatusBar,
    StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, 
    useColorScheme, View, ScrollView,
    ActivityIndicator} 
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
import { HomeParams } from '../types.ts'

function HomeScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark'
    // const { search } = useSearch()
    const [params, setParams] = useState<HomeParams>({ sortByDate: -1, page: 1 })
    const { movies, loading, getMovies } = useMovies({params})
    // const { panResponder, navbarTranslateY } = useScrollNavBar()
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const genres = ['Genres', 'Action', 'Animation', 'Adventure', 'Comedy','Crime','Documentary', 'Drama', 'Fantasy', 'History', 'Horror','Music','Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War']
    const [genreType, setGenreType] = useState<string>('Genres')

    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.blueDark : Colors.lighter,
    }
    
    //! params.sortByDate: 1, page (incrementar con cada endScroll)
    useEffect (() => {
        getMovies(params)            
    },[params])

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible)
    }    

    const handleGenreType = (genre: string) => {
        setGenreType(genre)
        const newParams = { ...params, genre: genre }
        setParams(newParams)
        console.log(params)
        toggleModal()
    }

    return (
        <SafeAreaView style={[backgroundStyle, { flex: 1}]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />

            <Animated.ScrollView                
                // {...panResponder.panHandlers}
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, {flex: 1}]}
            >
                {/* ! habilitar el carousel */}
                <Carousel movies={movies ?? []}/>

                <TouchableOpacity onPress={toggleModal}>
                    <View style={styles.textView}>
                        <Filter/>
                        <Text style={styles.textStyle}>{genreType}</Text>                        
                    </View>
                </TouchableOpacity>
                {loading ? (
                    <View style={styles.sectionMovies}>
                        <Text>Loading...</Text>
                        <ActivityIndicator size={200} color="#0000ff" />
                    </View>
                ) : (                
                    <Movies movies={movies ?? []}/>                    
                )}                
            </Animated.ScrollView>

            <NavBar/>

            <Modal visible={isModalVisible} style={styles.modal} transparent={true}>
                <View style={styles.modalBackground}>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.genres}>
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
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    textView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        margin: 60,
        marginTop: 20,
        marginBottom: 15,
        padding: 5,
        backgroundColor: 'yellow',
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 20,
    },
    textStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#052539',
        paddingHorizontal: 10
    },    
    modal: {

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
