import React from 'react'
import { Animated, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Home } from '../../assets/home'
import { Searcher } from '../../assets/search'
import { Profile } from '../../assets/profile'
import { InputRefProps } from '../../types'
import useKeyboardStatus from '../../hooks/useKeyboardStatus'
import { useScrollNavBar } from '../../hooks/useNavBar'



const NavBar: React.FC<InputRefProps> = ({inputRef}) => {    
    const { keyboardStatus } = useKeyboardStatus()
    const { navbarTranslateY, panResponder, handleScreen } = useScrollNavBar()    

    const handleSearcherPress = () => {
        if(inputRef.current){
            inputRef.current.focus()
        }
    }

    if (keyboardStatus) {
        return null
    }

    return (        
        <Animated.View style={[
            styles.navbar,
            {
                transform: [{ translateY: navbarTranslateY}]
            }
        ]}
        {...panResponder.panHandlers}>  
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
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#201E1E',                
        borderColor: '#F2F2F2',
        borderStyle: 'solid',
        borderTopWidth: 1, 
    },
    iconContainer: {
        padding: 5,
    },
})

export default NavBar
