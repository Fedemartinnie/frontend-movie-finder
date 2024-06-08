import React, { useState } from 'react'
import { View, Text, StatusBar, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native'
import NavBar from '../components/home/navBar'
import { CamAvatar } from '../assets/camAvatar'
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { EditProfile } from '../assets/lapiz'


function ProfileScreen(): React.JSX.Element {
    const[edit, setEdit] = useState<boolean>(false)
    const [firstName, setFirstName] = useState('María José')
    const [lastName, setLastName] = useState('Diaz')

    const handleEdit = () => {
        setEdit(!edit)
    }

    //!!!TODO
    const handleSubmit = () => {
        // Aquí puedes manejar el envío de los datos, por ejemplo, una llamada a una API
        console.log('First Name:', firstName)
        console.log('Last Name:', lastName)
        // Puedes desactivar el modo de edición después de enviar los datos
        setEdit(false)
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar/>
            <View style={{flex: 1}}>
                <View style={styles.profileContainer}>

                    <View style={styles.imageView}>
                        <Image
                            source={{ uri: 'https://www.pngitem.com/pimgs/m/501-5015090_ironman-helmet-png-image-iron-man-face-png.png' }} // Cambia esto por la URL correcta de la imagen
                            style={styles.image}
                        />
                        <View style={styles.cameraIcon}>
                            <CamAvatar />
                        </View>
                    </View>

                    {!edit 
                        ? (
                            <View style={[styles.userInfo, {marginLeft: '11%'}]}>
                                <Text style={styles.userName}>Fede Nie</Text>
                            
                                <TouchableOpacity onPress={handleEdit}>
                                    <View style={styles.editIcon}>
                                        <EditProfile />
                                    </View>
                                </TouchableOpacity>                                           
                            </View>)
                        : (
                            <View style={[styles.userInfo]}>
                                <Text style={styles.userName}>Fede Nie</Text>
                                <View style={styles.editIcon}>
                                        
                                </View>
                            </View>)
                    }
                </View>

                <View style={styles.options}>
                    {!edit 
                        ? (<>
                            <Text style={styles.optionText}>María José</Text>
                            <Text style={styles.optionText}>Diaz</Text>
                            <Text style={styles.optionText}>Cerrar Sesión</Text>
                            <Text style={styles.optionTextDanger}>Eliminar Cuenta</Text>
                        </>
                        )
                        : (<>
                            <TextInput 
                                style={styles.optionText}
                                value={firstName}
                                onChangeText={setFirstName}
                                onSubmitEditing={handleSubmit}
                                returnKeyType="done"
                            >
                                María José
                            </TextInput>
                            <TextInput 
                                style={styles.optionText}
                                value={lastName}
                                onChangeText={setLastName}
                                onSubmitEditing={handleSubmit}
                                returnKeyType="done"
                            >
                                    Diaz
                            </TextInput>
                            <Text style={styles.optionText}>Cerrar Sesión</Text>
                            <Text style={styles.optionTextDanger}>Eliminar Cuenta</Text>
                        </>
                        )

                    }
                    
                </View>
                {edit && (
                    //!* aca poner el button cancelar con space-between
                    <View style={styles.saveContainer}>
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
    optionText: {
        color: '#fff',
        fontSize: 16,
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        paddingVertical: 20,
        marginHorizontal: 25,
    },
    optionTextDanger: {
        color: 'red',
        fontSize: 16,
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        paddingVertical: 20,
        marginHorizontal: 25,
    },
    saveContainer:{
        // alignContent: 'flex-end',
        alignItems: 'flex-end',
        margin: 30
    },
    saveButton: {
        color: 'yellow',
        fontSize: 24,
        // fontWeight: 'bold'
        textAlign: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 25,
        paddingVertical: 5,
        paddingHorizontal: 15
    }
    
})



export default ProfileScreen
