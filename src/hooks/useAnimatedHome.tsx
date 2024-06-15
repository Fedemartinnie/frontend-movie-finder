import React, { useRef, useState, useEffect } from 'react'
import { Animated } from 'react-native'

export default function useAnimatedHome() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const rotateAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (isModalVisible) {
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1000, // Duración del giro al abrir
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 1000, // Duración del giro al cerrar
                useNativeDriver: true,
            }).start()
        }
    }, [isModalVisible])

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    return {rotation, isModalVisible, setIsModalVisible}
}