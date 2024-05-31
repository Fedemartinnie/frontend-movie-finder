

import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from './src/screens/splashScreen'
import LoginScreen from './src/screens/loginScreen'
import HomeScreen from './src/screens/HomeScreen'
import SearchScreen from './src/screens/searchScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import { MovieScreen } from './src/screens/MovieScreen'
import { FavsScreen } from './src/screens/FavsScreen'

const Stack = createStackNavigator()

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isLoggedIn ? (
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
                            options={{ title: 'Profile' }}
                        />
                        <Stack.Screen
                            name='Favs'
                            component={FavsScreen}
                            options={{ title: 'Favs' }}
                        />
                        <Stack.Screen
                            name='MovieScreen'
                            component={MovieScreen}
                            options={{ 
                                title: 'Movie',
                                headerShown: false                               
                            }}
                            //initialParams={{MovieScreen: (id: string)=> id}}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Splash"
                            component={SplashScreen}
                            options={{
                                title: 'Splash',
                                headerShown: false
                            }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                title: 'Login',
                                headerShown: false
                            }}
                            initialParams={{ setIsLoggedIn: (value: boolean) => setIsLoggedIn(value) }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App
