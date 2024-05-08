import React, { useRef } from 'react'
import { Animated, PanResponder } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type RootStackParamList = {
    Home: undefined
    Profile: undefined
}

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile' | 'Home'>

export function useScrollNavBar() {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const navbarTranslateY = useRef(new Animated.Value(0)).current

    const hideNavBar = () => {
        Animated.timing(navbarTranslateY, {
            toValue: 30,
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

    const handleScreen = (screenName: 'Profile' | 'Home') => {
        navigation.navigate(screenName)
    }

    const handleScroll = (gestureState: any) => {
        if (gestureState.dy < 0) {
            hideNavBar()
            console.log(gestureState.dy)
        } else {
            showNavBar()
        }
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 0,
            onPanResponderRelease: (_, gestureState) => handleScroll(gestureState)
        })
    ).current

    return { navbarTranslateY, panResponder, handleScreen }
}
