import React, { useRef, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, StyleSheet, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import NavBar from '../components/home/navBar';
import { CamAvatar } from '../assets/camAvatar';
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { EditProfile } from '../assets/lapiz';
import { CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { updateUser } from '../services/users';
import { User } from '../types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuth } from '../utils/authContext';
import { Camera, Gallery } from '../assets/photo';
import LoginScreen from './loginScreen';

type ProfileScreenProp = RouteProp<{ ProfileScreen: { user: User } }, 'ProfileScreen'>;

function ProfileScreen(): React.JSX.Element {
    const { logout, deleteAccount } = useAuth();
    const route = useRoute<ProfileScreenProp>();
    const { user } = route.params;
    const [edit, setEdit] = useState<boolean>(false);
    const [firstName, setFirstName] = useState(user.name);
    const [lastName, setLastName] = useState(user.lastname);
    const [email] = useState(user.email);
    const [splitEmail] = user.email.split('@');
    const [nickname, setNickname] = useState(user.nickname ? user.nickname : splitEmail[0]);
    const [image, setImage] = useState<string | undefined>(user.profileImage);
    const previousFirst = useRef<string>(user.name);
    const previousLast = useRef<string>(user.lastname);
    const previousNick = useRef<string>(user.nickname ? user.nickname : splitEmail[0]);
    const [error, setError] = useState<boolean>(false);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const hasNumberOrSymbol = (str: string) => /[0-9!@#$%^&*(),.?":{}|<>]/g.test(str);

    

    //* ACTUALIZA DATOS DE PERFIL DURANTE EDICION
    const handleEdit = () => {
        setEdit(!edit);
    };

    //* CANCELA LA EDICION REALIZADA
    const handleCancelEdit = () => {
        setFirstName(previousFirst.current);
        setLastName(previousLast.current);
        setNickname(previousNick.current);
        setEdit(false);
    };

    //* ACTUALIZA USUARIO --> PERSISTE EN DB + MANEJO ERROR SI ES NULL
    const handleSubmit = async () => {
        if (firstName === '' || lastName === '' || nickname === '' || hasNumberOrSymbol(firstName) || hasNumberOrSymbol(lastName)) {
            setError(true);
            console.log('no se permite campo vacio');
            return;
        } else {
            previousFirst.current = firstName;
            previousLast.current = lastName;
            previousNick.current = nickname;
            setFirstName(previousFirst.current);
            setLastName(previousLast.current);
            setNickname(previousNick.current);

            const newUser = {
                ...user,
                name: previousFirst.current,
                lastname: previousLast.current,
                nickname: previousNick.current,
            };
            await updateUser(newUser);
            setError(false);
            setEdit(false);
        }
    };

    //* CAMERA
    const openCamera = () => {
        setModalVisible(false);
        const options: CameraOptions = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
            saveToPhotos: true,
        };

        launchCamera(options, (response) => {
            handleResponse(response);
        });
    };

    //* GALERIA
    const openGallery = () => {
        setModalVisible(false);
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response) => {
            handleResponse(response);
        });
    };

    //* setImage Uri of mobile
    const handleResponse = (response: ImagePickerResponse) => {
        if (response.didCancel) {
            console.log('User cancelled the picker');
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
            setImage(response.assets[0].uri);
            console.log('Selected image: ', response.assets[0].uri);
            uploadImageToCloudinary(response.assets[0].uri);
        }
    };

    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddy10tgci/image/upload';
    const UPLOAD_PRESET = 'y4skh10n';

    const uploadImageToCloudinary = async (imageUri: string | undefined) => {
        const data = new FormData();
        data.append('file', {
            uri: imageUri,
            type: 'image/jpeg',
            name: 'upload.jpg',
        });
        data.append('upload_preset', UPLOAD_PRESET);
        data.append('cloud_name', 'ddy10tgci');
        console.log('ingresando a cloudinary ----> ', data);
        try {
            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: data,
            });
            const result = await response.json();
            console.log('RESULTADO CLOUDINARY: ----------------> \n', result.url);
            setImage(result.url);
            const newUser = {
                ...user,
                profileImage: result.url,
            };
            console.log('NEW USER -----> ', newUser);
            await updateUser(newUser);
            return result.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    //* ELIMINAR CUENTA
    const handleDeleteAccount = async () => {
        try {
            Alert.alert(
                "Confirmación eliminación",
                "¿Estás seguro de que quieres eliminar tu cuenta?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Eliminar",
                        style: "destructive",
                        onPress: async () => {
                            await deleteAccount();
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    //* CERRAR SESION
    const handleLogout = async () => {
        try {
            Alert.alert(
                "Confirmación de Cierre de Sesión",
                "¿Estás seguro de que quieres cerrar sesión?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Cerrar Sesión",
                        onPress: async () => {
                            await logout();
                        }
                    }
                ]
            );
        } catch {
            throw new Error('no se pudo cerrar sesión');
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar />
            <View style={{ flex: 1 }}>
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
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <CamAvatar />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {!edit
                        ? (
                            <View style={[styles.userInfo, { marginLeft: '11%' }]}>
                                <Text style={styles.userName}>{nickname}</Text>

                                <TouchableOpacity onPress={handleEdit}>
                                    <View style={styles.editIcon}>
                                        <EditProfile />
                                    </View>
                                </TouchableOpacity>
                            </View>)
                        : (
                            <View style={[styles.userInfo, { marginLeft: '5%' }]}>
                                <TextInput
                                    style={[styles.userName, { backgroundColor: colors.white, borderRadius: 5, color: colors.red, padding: 0, borderColor: colors.red, borderWidth: error ? 1 : 0 }]}
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
                        </>
                        )
                        : (<View >
                            <TextInput
                                style={[styles.optionTextInput, { backgroundColor: colors.white, color: colors.red, padding: 0, paddingHorizontal: 10, borderColor: colors.red, borderWidth: error ? 1 : 0 }]}
                                value={firstName}
                                onChangeText={setFirstName}
                            />

                            <TextInput
                                style={[styles.optionTextInput, { backgroundColor: colors.white, color: colors.red, padding: 0, paddingHorizontal: 10, borderColor: error ? colors.red : colors.white }]}
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                        )
                    }
                    <Text style={styles.optionText}>{email}</Text>
                    <TouchableWithoutFeedback onPress={handleLogout}>
                        <Text style={styles.optionText}>Cerrar Sesión</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={handleDeleteAccount}>
                        <Text style={styles.optionTextDanger}>Eliminar Cuenta</Text>
                    </TouchableWithoutFeedback>

                </View>
                {edit && (
                    <View style={styles.saveContainer}>
                        <TouchableOpacity onPress={handleCancelEdit}>
                            <Text style={styles.saveButton}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSubmit}>
                            <Text style={styles.saveButton}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <NavBar />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={openCamera} style={styles.optionButton}>
                                <Camera />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={openGallery} style={styles.optionButton}>
                                <Gallery />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.optionButton}>
                            <Text style={styles.optionText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const colors = {
    black: '#282828',
    blue: '#336699',
    red: '#993333',
    white: '#F2F2F2',
    blueDark: '#052539',
};

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
        paddingVertical: 7,
        marginHorizontal: 25,
        borderBottomColor: colors.black,
        borderWidth: 1,
        marginVertical: 5,
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
    saveContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 30,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
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
        paddingHorizontal: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: colors.blueDark,
        borderRadius: 10,
        alignItems: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
});

export default ProfileScreen;
