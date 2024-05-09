import * as React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import HomeScreen from './screens/home'
import ProfileScreen from './screens/profile'
import { SearchScreen } from './screens/searchScreen'

const Stack = createNativeStackNavigator()

const MyStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{title: 'Home'}}
                />
                <Stack.Screen
                    name='Search'
                    component={SearchScreen}
                    options={{title: 'Search'}}
                />
                <Stack.Screen 
                    name='Profile'
                    component={ProfileScreen} 
                    options={{title: 'Profile Screen'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MyStack