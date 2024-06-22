import { useEffect, useRef, useState } from 'react'
import { Animated, PanResponder } from 'react-native'
import { useNavigation } from '@react-navigation/native'
// import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Favorite, ProfileScreenNavigationProp, User } from '../types'
import { getUser } from '../services/users'
import { getFavorites } from '../services/favorites'


export function useScrollNavBar() {
    const navigation = useNavigation<ProfileScreenNavigationProp>()
    const navbarTranslateY = useRef(new Animated.Value(0)).current
    const [isNavBarHidden, setIsNavBarHidden] = useState<boolean>(false)

    const handleScreen = async (screenName: 'Profile' | 'Home' | 'Search' | 'Favs') => {
        setIsNavBarHidden(false)
        
        switch(screenName) {
        case 'Profile':
            try {
                const user: User = await getUser()
                navigation.navigate(screenName, { user })
            } catch (error) {
                console.error('Error fetching user:', error)
            }
            break
            
        case 'Favs':
            try {
                const favorites: Favorite[] = await getFavorites()
                navigation.navigate(screenName, { favorites })
            } catch (error) {
                console.error('Error fetching favorites:', error)
            }
            break
    
        case 'Home':
        case 'Search':
        default:
            navigation.navigate(screenName)
            break
        }
    }
    
    
    const hideNavBar = () => {
        setIsNavBarHidden(true)
    }

    const showNavBar = () => {
        setIsNavBarHidden(false)
    }


    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 0,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    // console.log('SHOW NAVBAR: \n',gestureState.dy)
                    showNavBar()
                } 
                if(gestureState.dy < 0) {
                    // console.log('HIDE NAVBAR: ',gestureState.dy)
                    hideNavBar()
                }
            },
        })
    ).current

    useEffect(() => {
        // console.log('\n --> isnavbarhidden? ',isNavBarHidden)
        Animated.timing(navbarTranslateY, {
            toValue: isNavBarHidden ? 56 : 0, // Ajusta este valor según sea necesario
            duration: 300,
            useNativeDriver: true,
        }).start()
    }, [isNavBarHidden])


    return { navbarTranslateY, panResponder, handleScreen }
}
