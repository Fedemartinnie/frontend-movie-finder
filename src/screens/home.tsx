import React, { useRef } from 'react'
import {Button, Alert, SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,TextInput,useColorScheme,View} from 'react-native'
import {Colors/*, Header, DebugInstructions, LearnMoreLinks, ReloadInstructions*/} from 'react-native/Libraries/NewAppScreen'
import SearchBar from '../components/home/searcher'
import NavBar from '../components/home/navBar'
//import type { PropsWithChildren } from 'react'
import { Movies } from '../components/home/movies.tsx'
//import { useSearch } from '../hooks/useSearch.tsx'
import { useMovies } from '../hooks/useMovies.tsx'
import { useSearch } from '../hooks/useSearch.tsx'


function HomeScreen(): React.JSX.Element {
    const inputRef = useRef<TextInput>(null)
    const isDarkMode = useColorScheme() === 'dark'
    const { search, updateSearch } = useSearch()
    const { movies, loading, getMovies } = useMovies({searchText: search})

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    }

    const handleSearch = () => {
        // Logic of search text
        if (search.trim() !== '') {            
            getMovies(search)
            console.log(search)
            console.log(movies)
            Alert.alert('Búsqueda realizada', `Has buscado: ${search}`)
        } else {
            Alert.alert('Campo de búsqueda vacío', 'Por favor ingresa un término de búsqueda')
        }
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
                    style={{ flex: 1, height: 40, backgroundColor: colors.white , borderColor: 'gray', borderRadius: 10, borderWidth: 1,marginRight: 10, paddingHorizontal: 10, color: colors.black }}
                    placeholder="Avengers, The Matrix, Shrek ..."
                    placeholderTextColor={colors.black}
                    value={search}
                    onChangeText={text => updateSearch(text)}
                />
                <Button title="Search" onPress={handleSearch} />
            </View>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={[backgroundStyle, {flex: 1}]}>

                {/*<Header />*/}
                {loading ? (
                    <View>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                    <View>
                        <Movies movies={movies ?? []}/>
                    </View>
                )}                
            </ScrollView>
            <NavBar inputRef={inputRef}/>              
        </SafeAreaView>
    )
}

const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2'
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
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
})

export default HomeScreen
