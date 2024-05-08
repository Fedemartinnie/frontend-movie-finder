import { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'

export default function useKeyboardStatus() {
    const [keyboardStatus, setKeyboardStatus] = useState(false)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus(true)
        })
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus(false)
        })

        return () => {
            keyboardDidHideListener.remove()
            keyboardDidShowListener.remove()
        }
    }, [])

    return { keyboardStatus }
}
