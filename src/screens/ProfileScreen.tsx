import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StatusBar, SafeAreaView, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import NavBar from '../components/home/navBar'
import { CamAvatar } from '../assets/camAvatar'
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { EditProfile } from '../assets/lapiz'
import { Asset, CameraOptions, ImageLibraryOptions, ImagePickerResponse, launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker'
import { getUser, updateUser } from '../services/users'
import { User } from '../types'
import { RouteProp, useRoute } from '@react-navigation/native'

type ProfileScreenProp = RouteProp<{
    ProfileScreen: { user: User }
}, 'ProfileScreen'>

function ProfileScreen(): React.JSX.Element {
    const route = useRoute<ProfileScreenProp>()
    const {user} = route.params
    const[edit, setEdit] = useState<boolean>(false)
    const [firstName, setFirstName] = useState(user.name)
    const [lastName, setLastName] = useState(user.lastname)
    const [email, setEmail] = useState(user.email)
    const [splitEmail, ...rest] = user.email.split('@')
    const [nickname, setNickname] = useState(user.nickname ? (user.nickname) : (splitEmail))
    const [image, setImage] = useState<string | undefined>(undefined)
    const previousFirst = useRef<string>(user.name)
    const previousLast = useRef<string>(user.lastname)
    const previousNick = useRef<string>(user.nickname ? (user.nickname) : (splitEmail))
    const [error, setError] = useState<boolean>(false)
    const hasNumberOrSymbol = (str: string) => /[0-9!@#$%^&*(),.?":{}|<>]/g.test(str)

    
    //* ACTUALIZA EDICION CON CADA TIPEO
    const handleEdit = () => { 
        previousFirst.current = user?.name
        previousLast.current = user?.lastname
        previousNick.current = user?.nickname
        setEdit(!edit)
    }

    //* CANCELA LA EDICION REALIZADA
    const handleCancel = () => {
        setFirstName(previousFirst.current)
        setLastName(previousLast.current)
        setNickname(previousNick.current)
        setEdit(false)
    }

    //!!!TODO
    //* ACTUALIZA USUARIO --> PERSISTE EN DB + MANEJO ERROR SI ES NULL
    const handleSubmit = async() => {  
        if(firstName === '' || lastName === '' || nickname === '' || hasNumberOrSymbol(firstName) || 
        hasNumberOrSymbol(lastName)){
            setError(true)
            console.log('no se permite campo vacio')
            return
        }
        else{
            previousFirst.current = firstName
            previousLast.current = lastName
            previousNick.current = nickname 
            //! envío los datos del user con los cambios que necesito pero no persiste en la bd
            const newUser = {
                ...user,
                name: previousFirst.current,
                lastname: previousLast.current,
                nickname: previousNick.current,
            }
            await updateUser(newUser)
            setError(false)
            setEdit(false)
        }
    }

    //* seleccionar camara o galeria para la foto 
    const openPicker = () => {
        Alert.alert(            
            'Select Image',
            'Choose your image source',
            [
                {
                    text: 'Camera',
                    onPress: () => openCamera()
                },
                {
                    text: 'Gallery',
                    onPress: () => openGallery()
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ],
            { cancelable: true }
        )
    }
        
    const openCamera = () => {
        const options: CameraOptions = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
            saveToPhotos: true,  // Optional: save photo in the gallery after capture
        }

        launchCamera(options, (response) => {
            handleResponse(response)
        })
    }

    const openGallery = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
            selectionLimit: 1,
        }

        launchImageLibrary(options, (response) => {
            handleResponse(response)
        })
    }

    //* setImage Uri of mobile
    const handleResponse = (response: ImagePickerResponse) => {
        if (response.didCancel) {
            console.log('User cancelled the picker')
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage)
        } else if (response.assets && response.assets.length > 0) {
            setImage(response.assets[0].uri)
            console.log('Selected image: ', response.assets[0].uri)
            uploadImageToCloudinary(response.assets[0].uri)
        }    
    }


    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddy10tgci/image/upload'
    const UPLOAD_PRESET = 'y4skh10n'

    const uploadImageToCloudinary = async (imageUri: string | undefined) => {
        const data = new FormData()
        data.append('file', {
            uri: imageUri,
            type: 'image/jpeg', // or 'image/png'
            name: 'upload.jpg',
        })
        data.append('upload_preset', UPLOAD_PRESET) // Replace with your upload preset
        data.append('cloud_name', 'ddy10tgci')
        console.log('ingresando a cloudinary ----> ',data)
        try {
            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: data,
            })
            const result = await response.json()
            console.log('RESULTADO CLOUDINARY: ----------------> \n',result.url)
            setImage(result.url)
            const newUser = {
                ...user,
                profileImage: result.url 
            }
            console.log('NEW USER -----> ', newUser)
            await updateUser(newUser)
            return result.secure_url
        } catch (error) {
            console.error('Error uploading image:', error)
            throw error
        }
    }


    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar/>
            <View style={{flex: 1}}>
                <View style={styles.profileContainer}>

                    <View style={styles.imageView}>
                        <Image
                            source={{ 
                                uri: image 
                                    ? image
                                    : ('https://www.pngitem.com/pimgs/m/501-5015090_ironman-helmet-png-image-iron-man-face-png.png') 
                                
                            }}
                            style={styles.image}
                        />
                        <View style={styles.cameraIcon}>
                            <TouchableOpacity onPress={openPicker}>
                                <CamAvatar />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {!edit 
                        ? (
                            <View style={[styles.userInfo, {marginLeft: '11%'}]}>
                                <Text style={styles.userName}>{nickname}</Text>
                            
                                <TouchableOpacity onPress={handleEdit}>
                                    <View style={styles.editIcon}>
                                        <EditProfile />
                                    </View>
                                </TouchableOpacity>                                           
                            </View>)
                        : (
                            <View style={[styles.userInfo, {marginLeft: '5%'}]}>
                                <TextInput 
                                    style={[styles.userName, {backgroundColor: colors.white,borderRadius: 5, color: colors.red, padding: 0, borderColor: colors.red, borderWidth: error ? 1 : 0}]}
                                    value={nickname}
                                    onChangeText={setNickname}
                                />

                                <View style={styles.editIcon}>
                                        
                                </View>
                            </View>)
                    }
                </View>

                <View style={styles.options}>
                    {!edit 
                        ? (<>
                            <Text style={styles.optionText}>{firstName}</Text>
                            <Text style={styles.optionText}>{lastName}</Text>
                            {/* <Text style={styles.optionText}>{user.name}</Text>
                            <Text style={styles.optionText}>{user.lastname}</Text>
                            */}                    
                        </>
                        )
                        : (<View >
                            <TextInput 
                                style={[styles.optionTextInput, {backgroundColor: colors.white, color: colors.red, padding: 0, paddingHorizontal: 10, borderColor: colors.red, borderWidth: error ? 1 : 0}]}
                                value={firstName}
                                onChangeText={setFirstName}                            
                            />
                            
                            <TextInput 
                                style={[styles.optionTextInput, {backgroundColor:colors.white, color: colors.red, padding: 0, paddingHorizontal: 10, borderColor: colors.red, borderWidth: error ? 1 : 0}]}
                                value={lastName}
                                onChangeText={setLastName}                                
                            />                            
                        </View>
                        )                        
                    }
                    <Text style={styles.optionText}>{email}</Text>
                    {/* <Text style={styles.optionText}>{user.email}</Text>  */}
                    <TouchableWithoutFeedback>
                        <Text style={styles.optionText}>Cerrar Sesión</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <Text style={styles.optionTextDanger}>Eliminar Cuenta</Text>
                    </TouchableWithoutFeedback>
                    
                </View>
                {edit && (
                    //!* aca poner el button cancelar con space-between
                    <View style={styles.saveContainer}>
                        <TouchableOpacity onPress={handleCancel}>
                            <Text style={styles.saveButton}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSubmit}>
                            <Text style={styles.saveButton}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                )}
                
            </View>
            <NavBar />
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
    safeContainer: {
        flex: 1,
        backgroundColor: colors.blueDark,
    },
    profileContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    imageView: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3C0C79',
        borderRadius: 12,
        padding: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    userName: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    editIcon: {
        marginLeft: 15,
    },
    options: {
        marginTop: 20,
    },
    optionTextInput: {
        backgroundColor: colors.white,
        fontSize: 16,
        color: colors.red,
        paddingVertical: 10,
        marginHorizontal: 25,
        borderBottomColor: colors.red,
        borderWidth: 1,
    },
    optionText: {
        
        color: colors.white,
        fontSize: 16,
        borderBottomColor: colors.white,
        borderBottomWidth: 1,
        paddingVertical: 15,
        marginHorizontal: 25,
    },
    optionTextDanger: {
        color: 'red',
        fontSize: 16,
        borderBottomColor: colors.white,
        borderBottomWidth: 1,
        paddingVertical: 15,
        marginHorizontal: 25,
    },
    saveContainer:{
        flex: 1,
        flexDirection: 'row',
        margin: 30,
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    saveButton: {
        justifyContent: 'space-around',
        color: 'yellow',
        fontSize: 24,
        textAlign: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 25,
        paddingVertical: 5,
        paddingHorizontal: 15
    }
    
})



export default ProfileScreen


