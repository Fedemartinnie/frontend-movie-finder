import React from 'react'
import { Animated, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Home } from '../../assets/home'
import { Searcher } from '../../assets/search'
import { Profile } from '../../assets/profile'
import useKeyboardStatus from '../../hooks/useKeyboardStatus'
import { useScrollNavBar } from '../../hooks/useNavBar'
import { HeartFav } from '../../assets/heartFav'


const NavBar: React.FC = () => {    
    const { keyboardStatus } = useKeyboardStatus()
    const { navbarTranslateY, handleScreen } = useScrollNavBar()
    
    if (keyboardStatus) {
        return null
    }


    return (        
        <Animated.View style={[
            styles.navbar,
            { transform: [{ translateY: navbarTranslateY }] },            
        ]}        
        >  
            <TouchableOpacity style={styles.iconContainer} onPress={() => handleScreen('Home')}>
                <View style={{ width: 35, height: 35 }}>
                    <Home />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => handleScreen('Search')}>
                <View style={{ width: 35, height: 35 }}>
                    <Searcher/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconContainer, { marginTop: 10 }]} onPress={() => handleScreen('Favs')}>
                <View style={{ width: 35, height: 35 }}>
                    <HeartFav/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={() => handleScreen('Profile')}>
                <View style={{ width: 35, height: 35 }}>
                    <Profile />
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    blueDark: '#052539',
    violet: '#3C0C79'
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#201E1E',              
        // backgroundColor: colors.violet,              
        borderColor: '#F2F2F2',
        borderStyle: 'solid',
        borderTopWidth: 1, 
    },
    iconContainer: {
        padding: 5,
    },
})

export default NavBar