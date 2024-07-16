import { Alert } from 'react-native'
import { User } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

interface Config {
    headers?: {
        [key: string]: string
    }
    
}

//const URI = 'http://192.168.0.73:8000' //! ip fede
const URI = 'http://192.168.1.3:8000' //! ip jere
// const URI = 'http://18.221.46.103:8000' //* AWS ip
// const URI = 'http://192.168.1.48:8000' //* ip ivan

//TODO
//! users Service
//* LOGOUT USER

export const logout = async() => {
    try {
        const token = await AsyncStorage.getItem('authToken')
        console.log('TOKEN -------------> ', token)
        
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }

        const response = await fetch(`${URI}/users/id`,{
            method: 'PUT',         
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if(response.status === 200){
            
            await AsyncStorage.clear()
            await AsyncStorage.removeItem('authToken')
            const token = await AsyncStorage.getItem('authToken')
            console.log('CERRANDO SESION')
            console.log('-----------> ' ,token)
            // Desconectar del servicio de Google Sign-In
            // await GoogleSignin.revokeAccess()
            await GoogleSignin.signOut()
            return response
        }

    }catch{
        throw new Error('Error Loging Out')
    }
}

//* DELETE ACCOUNT
export const deleteAccount = async() => {
    try {
        const token = await AsyncStorage.getItem('authToken')
        
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }
        
        const response = await fetch(`${URI}/users/id`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log('RESPONSE ------------>', response)
        console.log(response.status)
        console.log(response.ok)
        if (response.ok) {
            await AsyncStorage.clear()
            await AsyncStorage.removeItem('authToken')
            const token = null;
            console.log('ELIMINACION CUENTA')
            await GoogleSignin.signOut()
            return response
        } else {
            throw new Error('Error eliminando la cuenta')
        }
        
    }catch{
        throw new Error('Error Loging Out')
    }
}

//* GET USER
export const getUser = async() => {
    try{
        const token = await AsyncStorage.getItem('authToken')
        
        if (!token) {
            throw new Error('No se pudo encontrar el token de autenticación')
        }

        const response = await fetch(`${URI}/users/id`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const user: User = await response.json()
        return user

    }catch{
        throw new Error('error al obtener datos del usuario')
    }
}

//* UPDATE USER
export const updateUser = async(user: User) => {
    console.log('profileImage service: -------> \n',user.profileImage)
    try{
        const token = await AsyncStorage.getItem('authToken')
        if(!token){
            throw new Error('No se pudo encontrar el token de autenticación')
        }
        const {accessToken, email, name, lastname, profileImage, refreshTokens, nickname } = user
        const response = await fetch(`${URI}/users/id`,{
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify({
                accessToken, 
                email, 
                name, 
                lastname, 
                profileImage, 
                refreshTokens,
                nickname,            
            })
                            
        }) 

        if(response.ok){
            console.log('cambios impactaron correctamente')
        }
    }catch {
        throw new Error('error al obtener datos del usuario')
    }
}