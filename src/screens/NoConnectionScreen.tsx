import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NoConnectionInfo } from '../assets/noConnection'

export function NoConnectionScreen(): React.JSX.Element {

    return(
        <View style={styles.container}>
            <View style={styles.noConnection}>
                <NoConnectionInfo/>
                <Text style={styles.text}>Error en la red</Text>
                <Text style={styles.text}>Revisá tu conexión a internet</Text>
            </View>
        </View>
    )
}


const colors = {
    black: '#282828',
    blue: '#336699', 
    red: '#993333', 
    white: '#F2F2F2',
    blueDark: '#052539',
    violet: '#3C0C79'
}


const styles = StyleSheet.create ({
    container:{
        flex: 1,
        backgroundColor: colors.blueDark,
        height: '100%'
    },
    noConnection:{
        flex: 1,
        marginVertical: '30%',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        fontSize: 24,
        color: colors.white,
        marginTop: 50,
    }
})