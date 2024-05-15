import React, { useEffect, useState } from 'react'
import { Animated, FlatList, Modal, SafeAreaView, StatusBar,
    StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import NavBar from '../components/home/navBar.tsx'
import { Movies } from '../components/home/movies.tsx'
import { useMovies } from '../hooks/useMovies.tsx'
import { useSearch } from '../hooks/useSearch.tsx'
import { Carousel } from '../components/carrusel.tsx'
import { useScrollNavBar } from '../hooks/useNavBar.tsx'
import { Filter } from '../assets/filtrar.tsx'
import { CloseButton } from '../assets/closeButton.tsx'

function HomeScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark'
    const { search } = useSearch()
    const { movies, loading, getMovies } = useMovies({searchText: search})
    const { panResponder, navbarTranslateY } = useScrollNavBar()
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror'] // Ejemplo de array de géneros
    const [genreType, setGenreType] = useState<string | null>(null)

    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.blueDark : Colors.lighter,
    }
    

    useEffect (() => {
        getMovies('X-Men')            
    },[])

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible)
    }    

    const handleGenreType = (genre: string) => {
        setGenreType(genre)
        toggleModal()
    }

    return (
        <SafeAreaView style={[backgroundStyle, { flex: 1}]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />                        
            <Animated.ScrollView                
                {...panResponder.panHandlers}
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, {flex: 1}]}
            >
                <Carousel movies={movies ?? []}/>
                <TouchableOpacity onPress={toggleModal}>
                    <View style={styles.textView}>
                        <Filter/>
                        {genreType 
                            ? <Text style={styles.textStyle}>{genreType}</Text>
                            : <Text style={styles.textStyle}>Géneros</Text>
                        } 
                    </View>
                </TouchableOpacity>
                {loading ? (
                    <View style={styles.sectionMovies}>
                        <Text>Loading...</Text>
                    </View>
                ) : (                
                    <Movies movies={movies ?? []}/>                    
                )}                
            </Animated.ScrollView>            
            <NavBar/>             
            <Modal visible={isModalVisible} style={styles.modal}>
                <View style={styles.modalBackground}>
                    {genres.map((genre, index) => (
                        <TouchableOpacity key={index} onPress={() => handleGenreType(genre)}>
                            <Text style={styles.genreItem}>{genre}</Text>
                        </TouchableOpacity>
                    ))}
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
    highlight: {
        fontWeight: '700',
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
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        paddingHorizontal: 10
    },
    closeButton: {
        position: 'absolute',
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    modal: {
        flex: 1,
        backgroundColor: '#052539',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F2224', // Color de fondo del modal
    },
    genreItem: {
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        // fontSize: 18,
        // color: 'black',
        // justifyContent:'center',
        // alignItems: 'center',    
        paddingVertical: 30,
        paddingHorizontal: 20,
        fontSize: 18,
        color: '#F3E7E7', // Color de los items de género
        justifyContent: 'center',
        alignItems: 'center',      
    },
})

export default HomeScreen
