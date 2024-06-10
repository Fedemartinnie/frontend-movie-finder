import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const axiosInstance = axios.create({
    baseURL: 'http://192.168.0.73:8000'
})


axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance