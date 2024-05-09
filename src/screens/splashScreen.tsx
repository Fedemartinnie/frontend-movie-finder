import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'

type RootStackParamList = {
    Splash: undefined
    Login: undefined
}

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>

interface SplashScreenProps {
    navigation: SplashScreenNavigationProp
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isLoading) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        }
    }, [isLoading, navigation])

    return (
        <ImageBackground
            source={require('./assets/background_desenfocado.png')}
            style={styles.container}
        >
            <View style={styles.content}>
                <Image style={styles.splashIcon} source={require('./assets/splash_icon.png')} />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#052539'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    splashIcon: {
        width: 225,
        height: 225,
    },
})

export default SplashScreen
