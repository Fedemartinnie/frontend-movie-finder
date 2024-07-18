import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../utils/authContext'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

// const URI = 'http://192.168.0.73:8000' //! ip fede
// const URI = 'http://192.168.1.3:8000'     //!jere
const URI = 'http://3.140.255.162:8000' //* AWS ip
//const URI = 'http://192.168.1.48:8000' //* ip ivan

GoogleSignin.configure({
    webClientId: '676309797007-b73o5re6gnpb17vtbo4is61md6v9d4c0.apps.googleusercontent.com', // ID de cliente web
    offlineAccess: true, // Para obtener tokens de actualización
})

const LoginScreen = () => {
    const navigation = useNavigation()
    const { login } = useAuth()

    
    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            console.log(userInfo)
            const token = userInfo.idToken
            if (token) {
                const response = await axios.post(`${URI}/auth/google/callback`, {
                    idToken: token,
                    user: {
                        id: userInfo.user.id,
                        givenName: userInfo.user.givenName,
                        familyName: userInfo.user.familyName,
                        email: userInfo.user.email,
                        photo: userInfo.user.photo
                    }
                })
                if (response.status === 200) {
                    await AsyncStorage.setItem('authToken', token) // Guardar el token
                    login(token) // Actualizar el estado de autenticación
                    //navigation.navigate('Home') // Navegar a la pantalla principal
                } else {
                    Alert.alert('Login Error', 'Unable to authenticate with backend')
                }
            }
        } catch (error) {
            console.error('Error Code:', error)
            if (error === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Login Cancelled')
            } else if (error === statusCodes.IN_PROGRESS) {
                Alert.alert('Login In Progress')
            } else if (error === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Play Services Not Available')
            } else {
                Alert.alert('Login Error')
                console.log(error)
            }
        }
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
