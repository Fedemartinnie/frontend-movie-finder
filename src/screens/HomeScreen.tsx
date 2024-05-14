import React, { useEffect } from 'react'
import { Animated, SafeAreaView, StatusBar,
    StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import NavBar from '../components/home/navBar.tsx'
import { Movies } from '../components/home/movies.tsx'
import { useMovies } from '../hooks/useMovies.tsx'
import { useSearch } from '../hooks/useSearch.tsx'
import { Carousel } from '../components/carrusel.tsx'
import { useScrollNavBar } from '../hooks/useNavBar.tsx'
import { Filter } from '../assets/filtrar.tsx'


function HomeScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark'
    const { search } = useSearch()
    const { movies, loading, getMovies } = useMovies({searchText: search})
    const { panResponder, navbarTranslateY } = useScrollNavBar()

    const backgroundStyle = {
        backgroundColor: isDarkMode ? colors.blueDark : Colors.lighter,
    }
    

    useEffect (() => {
        getMovies('X-Men')            
    },[])

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
                <TouchableOpacity>
                    <View style={styles.textView}>
                        <Filter/>
                        <Text style={styles.textStyle}>Géneros</Text>
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
    }
})

export default HomeScreen
