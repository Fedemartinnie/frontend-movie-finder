import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Home } from '../../assets/home'
import { Searcher } from '../../assets/search'
import { Profile } from '../../assets/profile'
import { InputRefProps } from '../../types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
//import { Screen } from 'react-native-screens'

type RootStackParamList = {
    Home: undefined
    Profile: undefined
}

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile' | 'Home'>;


const NavBar: React.FC<InputRefProps> = ({inputRef}) => {    
    const navigation = useNavigation<ProfileScreenNavigationProp>()    

    const handleScreen = (screenName: 'Profile' | 'Home') => {
        navigation.navigate(screenName)
    }

    const handleSearcherPress = () => {
        if(inputRef.current){
            inputRef.current.focus()
        }
    }

    return (
        <View style={styles.navbar}>  
            <TouchableOpacity style={styles.iconContainer} onPress={() => handleScreen('Home')}>
                <View style={{ width: 35, height: 35 }}>
                    <Home />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={handleSearcherPress}>
                <View style={{ width: 35, height: 35 }}>
                    <Searcher/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => handleScreen('Profile')}>
                <View style={{ width: 35, height: 35 }}>
                    <Profile />
                </View>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#282828',                
        borderColor: '#F2F2F2',
        borderStyle: 'solid',
        borderTopWidth: 1, 
    },
    iconContainer: {
        padding: 5,
    },
})


export default NavBar
