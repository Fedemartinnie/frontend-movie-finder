import React, { useRef, useState } from 'react'
import { View, Text, StatusBar, SafeAreaView, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import NavBar from '../components/home/navBar'
import { CamAvatar } from '../assets/camAvatar'
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { EditProfile } from '../assets/lapiz'
import { Asset, CameraOptions, ImageLibraryOptions, ImagePickerResponse, launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker'


function ProfileScreen(): React.JSX.Element {
    const[edit, setEdit] = useState<boolean>(false)
    const [firstName, setFirstName] = useState('María José')
    const [lastName, setLastName] = useState('Diaz')
    const [email, setEmail] = useState<string>('DiazCapo91@gmail.com')
    const [nickname, setNickname] = useState<string>('Diaz Capo')
    const [image, setImage] = useState<string | undefined>(undefined)
    // const [nickname, setNickname] = useState<string>({user.nickname})
    // const [firstName, setFirstName] = useState({user.name})
    // const [lastName, setLastName] = useState({user.lastname})
    // const [email, setEmail] = useState<string>({user.email})
    const previousFirst = useRef(firstName)
    const previousLast = useRef(lastName)
    const previousNick = useRef(nickname)


    const handleEdit = () => {
        previousFirst.current = firstName
        previousLast.current = lastName
        previousNick.current = nickname
        setEdit(!edit)
    }

    const handleCancel = () => {
        setFirstName(previousFirst.current)
        setLastName(previousLast.current)
        setNickname(previousNick.current)        
        setEdit(false)
    }

    //!!!TODO
    const handleSubmit = () => {       
        previousFirst.current = firstName
        previousLast.current = lastName
        previousNick.current = nickname 
        //TODO hacer llamado service para actualizar datos en db
        setEdit(false)
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
                            // source={{ uri: user.profileImage }}
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
                                {/* <Text style={styles.userName}>{nickname}</Text> */}
                            
                                <TouchableOpacity onPress={handleEdit}>
                                    <View style={styles.editIcon}>
                                        <EditProfile />
                                    </View>
                                </TouchableOpacity>                                           
                            </View>)
                        : (
                            <View style={[styles.userInfo, {marginLeft: '5%'}]}>
                                <TextInput 
                                    style={[styles.userName, {backgroundColor: colors.white,borderRadius: 5, color: colors.red, padding: 0}]}
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
                                style={[styles.optionTextInput, {backgroundColor: colors.white, color: colors.red, padding: 0, paddingHorizontal: 10}]}
                                value={firstName}
                                onChangeText={setFirstName}                            
                            />
                            
                            <TextInput 
                                style={[styles.optionTextInput, {backgroundColor: colors.white, color: colors.red, padding: 0, paddingHorizontal: 10}]}
                                value={lastName}
                                onChangeText={setLastName}                                
                            />                            
                        </View>
                        )                        
                    }
                    <Text style={styles.optionText}>{email}</Text>
                    {/* <Text style={styles.optionText}>{user.email}</Text>  */}
                    <TouchableOpacity>
                        <Text style={styles.optionText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.optionTextDanger}>Eliminar Cuenta</Text>
                    </TouchableOpacity>
                    
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
        marginVertical: 50,
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
        margin: 20,
        justifyContent: 'space-between',
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
function openCamera(): void {
    throw new Error('Function not implemented.')
}

