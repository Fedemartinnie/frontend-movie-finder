import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

//const URI = 'http://192.168.0.73:8000' //! ip fede
// const URI = 'http://192.168.1.6:8000'     //! ip jere
const URI = 'http://18.221.46.103:8000' //* AWS ip

const axiosInstance = axios.create({
    baseURL: URI,
})

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('authToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        } catch (error) {
            console.error('Error getting auth token from AsyncStorage', error)
            return Promise.reject(error)
        }
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance
