import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useNetInfo } from '@react-native-community/netinfo'
// import SplashScreen from './src/screens/SplashScreen'
import SplashScreen from './src/screens/splashScreen'
import LoginScreen from './src/screens/loginScreen'
import HomeScreen from './src/screens/HomeScreen'
import SearchScreen from './src/screens/searchScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import { AuthProvider, useAuth } from './src/utils/authContext'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import requestNotificationPermission from './src/utils/requestNotificationPermission'
import { MovieScreen } from './src/screens/MovieScreen'
import { NoConnectionScreen } from './src/screens/NoConnectionScreen'
import {FavsWithProvider} from './src/context/favsWithProvider'


const Stack = createStackNavigator()

GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '676309797007-b73o5re6gnpb17vtbo4is61md6v9d4c0.apps.googleusercontent.com', // ID Android
    offlineAccess: true, // Para obtener tokens de actualización
})

const App = () => {
    const [isLoading, setIsLoading] = useState(true)    

    useEffect(() => {
        requestNotificationPermission() // Solicitar permisos de notificaciones
        setTimeout(() => {
            setIsLoading(false)
        }, 2000) // Simula la duración del splash
    }, [])

    return (
        <AuthProvider>
            <NavigationContainer>
                <RootNavigator isLoading={isLoading} />
            </NavigationContainer>
        </AuthProvider>
    )
}

const RootNavigator = ({ isLoading }: { isLoading: boolean }) => {
    const { isLoggedIn } = useAuth()
    const netInfo = useNetInfo()
    const [isConnected, setIsConnected] = useState(netInfo.isConnected)


    useEffect(() => {
        setIsConnected(netInfo.isConnected)
        console.log('netInfo: isConnected ??? --> \n',netInfo.isConnected)
    }, [netInfo.isConnected])


    return (
        <Stack.Navigator>
            {isLoading ? (            
                <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}} />
            ) : !isConnected ? (
                <Stack.Screen name="NoConnection" component={NoConnectionScreen} options={{ headerShown: false }} />
            )
                : isLoggedIn ? (
                    <>
                        <Stack.Screen
                            name='Home'
                            component={HomeScreen}
                            options={{
                                title: 'Home',
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name='Search'
                            component={SearchScreen}
                            options={{
                                title: 'Search',
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name='Profile'
                            component={ProfileScreen}
                            options={{ title: 'Profile',
                                headerStyle: {
                                    backgroundColor: '#3C0C79', // Color de fondo del header
                                },
                                headerTintColor: '#fff', // Color del título y de los íconos del header
                                headerTitleStyle: {
                                    fontWeight: 'bold', // Ejemplo de estilo adicional para el título
                                },
                            }}
                        />
                        <Stack.Screen
                            name='Favs'
                            component={FavsWithProvider}
                            
                            options={{ title: 'Favs',
                                headerStyle: {
                                    backgroundColor: '#3C0C79', // Color de fondo del header
                                },
                                headerTintColor: '#fff', // Color del título y de los íconos del header
                                headerTitleStyle: {
                                    fontWeight: 'bold', // Ejemplo de estilo adicional para el título
                                },
                            }}
                        />
                        <Stack.Screen
                            name='MovieScreen'
                            component={MovieScreen}
                            options={{
                                title: 'Movie',
                                headerShown: true
                            }}
                        />
                    </>
                ) : (
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen} 
                        options={{headerShown: false}} />
                )}
        </Stack.Navigator>
    )
}

export default App
