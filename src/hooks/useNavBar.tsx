import React, { useRef } from 'react'
import { Animated, PanResponder } from 'react-native'
import { useNavigation } from '@react-navigation/native'
// import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ProfileScreenNavigationProp } from '../types'


export function useScrollNavBar() {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const navbarTranslateY = useRef(new Animated.Value(0)).current

    const handleScreen = (screenName: 'Profile' | 'Home' | 'Search') => {
        navigation.navigate(screenName)
    }
    
    const hideNavBar = () => {
        Animated.timing(navbarTranslateY, {
            toValue: 46,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    const showNavBar = () => {
        Animated.timing(navbarTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start()
    }


    const handleScroll = (gestureState: any) => {
        if (gestureState.dy < 0) {
            console.log(gestureState.dy)
            hideNavBar()
        } else {
            console.log(gestureState.dy)
            showNavBar()
        }
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 0,
            // onPanResponderMove: (_, gestureState) => handleScroll(gestureState),
            onPanResponderRelease: (_, gestureState) => handleScroll(gestureState)
        })
    ).current

    return { navbarTranslateY, panResponder, handleScreen }
}
