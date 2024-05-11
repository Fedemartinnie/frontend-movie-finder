/*import React from 'react'
import MyStack from './src/stack'

function App(): React.JSX.Element {
    return(    
        <MyStack/>
        
    )
}

export default App
*/

import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from './src/screens/splashScreen'
import LoginScreen from './src/screens/loginScreen'
import HomeScreen from './src/screens/HomeScreen'
import SearchScreen from './src/screens/searchScreen'
import ProfileScreen from './src/screens/ProfileScreen'

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
                            options={{ title: 'Home' }}
                        />
                        <Stack.Screen
                            name='Search'
                            component={SearchScreen}
                            options={{ title: 'Search' }}
                        />
                        <Stack.Screen
                            name='Profile'
                            component={ProfileScreen}
                            options={{ title: 'Profile' }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Splash"
                            component={SplashScreen}
                        />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            initialParams={{ setIsLoggedIn: (value: boolean) => setIsLoggedIn(value) }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App
