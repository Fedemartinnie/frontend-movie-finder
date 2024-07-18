import React, { createContext, useState, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logout as logoutt, deleteAccount as deleteAccountt } from '../services/users'

interface AuthContextType {
    isLoggedIn: boolean,
    isDeleted: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>
    deleteAccount:() => void
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    const [authToken, setAuthToken] = useState<string | null>(null)

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem('authToken')
            if (token) {
                setAuthToken(token)
                setIsLoggedIn(true)
            }
        }
        loadToken()
    }, [])

    const login = async (token: string) => {
        await AsyncStorage.setItem('authToken', token)    
        console.log(AsyncStorage.getItem('authToken'))
        setAuthToken(token)
        setIsLoggedIn(true)
    }

    const logout = async () => {
        console.log('ASYNC STORAGE TOKEN --> \n',AsyncStorage.getItem('authToken'))
        console.log('TOKEN --> \n',authToken)
        await logoutt()
        await AsyncStorage.removeItem('authToken')
        // await AsyncStorage.setItem('authToken', '')
        console.log('ASYNC STORAGE TOKEN --> \n',AsyncStorage.getItem('authToken'))

        setAuthToken(null)
        setIsLoggedIn(false)
    }

    const deleteAccount = async () => {
        await deleteAccountt()
        await AsyncStorage.removeItem('authToken')
        setIsLoggedIn(false); // Cerrar sesión al eliminar la cuenta
        setIsDeleted(true);
        console.log(isDeleted)
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                setIsDeleted,
                login,
                deleteAccount,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}