import React from 'react'
import { View, Text, StatusBar, SafeAreaView, StyleSheet } from 'react-native'
import NavBar from '../components/home/navBar'



function ProfileScreen(): React.JSX.Element {


    return (
        <SafeAreaView style={[{ flex: 1}]}>
            <StatusBar
            />                       
            <View style={styles.sectionError}>
                <Text style={{color: colors.red}}></Text>
            </View>          
            <NavBar/>                          
        </SafeAreaView>
    )
}

const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    blueDark: '#052539',
}

const styles = StyleSheet.create({    
    sectionError: {
        alignItems: 'center',
    },
    sectionNavbar: {

    }
})



export default ProfileScreen
