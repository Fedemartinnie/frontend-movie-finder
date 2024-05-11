import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

interface RouteParams {
  setIsLoggedIn: (value: boolean) => void // Define el tipo de setIsLoggedIn
}

const LoginScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { setIsLoggedIn }: RouteParams = route.params as RouteParams // Asigna el tipo RouteParams a route.params

    const handleGoogleLogin = () => {
        setIsLoggedIn(true) // Actualiza el estado isLoggedIn
    //navigation.navigate('Home') // Navega a la pantalla 'Home'
    }

    return (
        <View style={styles.container}>
            <Image style={styles.splashIcon} source={require('../assets/splash_icon.png')} />
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                <View style={styles.buttonContent}>
                    <Image style={styles.googleIcon} source={require('../assets/google.png')} />
                    <Text style={styles.buttonText}>Continuar con Google</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#052539',
    },
    splashIcon: {
        width: 150,
        height: 150,
        marginBottom: 200,
    },
    googleButton: {
        backgroundColor: '#fafafa',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    googleIcon: {
        width: 42,
        height: 42,
        marginRight: 5,
    },
    buttonText: {
        color: '#0a0a0a',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default LoginScreen
