import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Pressable, Image, Alert, Platform, KeyboardAvoidingView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { DRAWER_HEADER_SHOWN, baseSite, baseUri } from '../constants/Constants'
import { app_color_main } from '../services/data'
import HeaderCustom from '../components/HeaderCustom'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from '@rneui/base'
import { HelperText, TextInput, Button } from 'react-native-paper';
import { setUser } from '../feature/user.slice'
import { handleFilePicker, openLaunchGalery } from '../services/helpersFunction'
import TextInputRN from '../components/TextInputRN'

const EditProfile = ({navigation}) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data)
    const path = user.img ? { uri: baseSite + user.img } : require('../assets/images/kati_icone.png')
    // const path = require('../assets/images/user-1.png')

    const [src, setSrc] = useState(require('../assets/images/person.png'))

    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        nom: '',
        pre: '',
        username: '',
        email: '',
        tel: '',
        img: {}
    })

    const [errors, setErrors] = useState({
        nom: null,
        pre: null,
        username: null,
        email: null,
        tel: null,
        img: null
    })

    const onHandleChangeText = (key, text) => {
        setInputs(state => ({...state, [key]: text}))
    }

    const onChangeErrorText = (key, text) => {
        setErrors(state => ({...state, [key]: text}))
    }

    const clearErrors = () => {
        for(let k in errors) {
            onChangeErrorText(k, null);
        }
    }

    const saveFile = () => {
        let isValid = true
        if(isValid) {
            var APIURL = baseUri + "saveProfileUser.php";

            var headers = {
                'Accept': 'application/json',
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer access-token',
            };
            const formData = new FormData();
            formData.append('img', inputs.img)
            formData.append('usersId', user.id)
            formData.append('token', user.slug)
            fetch(APIURL, {
                method: 'POST',
                headers: headers,
                body: formData
            })
            .then((Response) => Response.json())
            .then((json) => {
                if(json.success) {
                    dispatch(setUser({img: json.img}))
                    Alert.alert('Profil édité avec succès.');
                } else {
                    const _errors = json.errors;
                    console.log('Errors: ', _errors);
                    for(let k in _errors) {
                        if(k!='unknown') {
                            onChangeErrorText(k, _errors[k]);
                        } else {
                            Alert.alert(_errors[k]);
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
        }
    }

    const onHandlePress = () => {
        let isValid = true
        clearErrors()

        if(isValid) {
            setLoading(true)
            var APIURL = baseUri + "editProfile.php";

            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                ...inputs,
                usersId: user.id,
                token: user.slug,
            };
            console.log('Data: ', Data)
            fetch(APIURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(Data)
            })
            .then((Response) => Response.json())
            .then((json) => {
                console.log('Response Server: ', json)
                if(json.success) {
                    const copy = {...inputs}
                    delete(copy.img)
                    dispatch(setUser({...copy}))
                    if(Object.keys(inputs.img).length!=0) {
                        saveFile()
                    } else {
                        Alert.alert('Profil édité avec succès.');
                    }
                } else {
                    const _errors = json.errors;
                    console.log('Errors: ', _errors);
                    for(let k in _errors) {
                        if(k!='unknown') {
                            onChangeErrorText(k, _errors[k]);
                        } else {
                            Alert.alert(_errors[k]);
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                if(Object.keys(inputs.img).length==0) setLoading(false)
            })
        }
    }

    const onSelectImage = async () => {
        let response = null
        let file = {}
        if(Platform.OS == 'android') {
            response = await handleFilePicker()
            // {"fileCopyUri": null, "name": "IMG-20230603-WA0003.jpg", "size": 160983, "type": "image/jpeg", "uri": "content://com.android.providers.media.documents/document/image%3A32442"}
            setSrc({uri: response.uri})
            file = {
                fileCopyUri: null,
                name: response.name,
                size: response.size,
                type: response.type,
                uri: response.uri,
            }
        } else {
            response = await openLaunchGalery()
            file = {
                fileCopyUri: null,
                name: response.fileName,
                size: response.fileSize,
                type: response.type,
                uri: response.uri,
            }
            // {"fileName": "rn_image_picker_lib_temp_dd652cd1-2636-4d55-8920-ab05f45459d8.jpg", "fileSize": 4183358, "height": 3024, "type": "image/jpeg", "uri": "file:///data/user/0/com.kati/cache/rn_image_picker_lib_temp_dd652cd1-2636-4d55-8920-ab05f45459d8.jpg", "width": 4032}
            setSrc({uri: response.uri})
        }
        console.log('Response: ', response)
        onHandleChangeText('img', file)
    }

    useEffect(() => {
        if(Object.keys(user).length != 0) {
            onHandleChangeText('nom', user.nom)
            onHandleChangeText('pre', user.pre)
            onHandleChangeText('username', user.username)
            onHandleChangeText('email', user.email)
            onHandleChangeText('tel', user.tel)
        }
    }, [user])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack />
            )}
            <KeyboardAvoidingView
                behavior={Platform.OS=='ios'?'padding':'height'}
                style={{flex: 1}}
            >
                <ScrollView contentContainerStyle={{paddingBottom: 50}}>
                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Image source={path} style={{ width: 80, height: 80, borderRadius: 10 }} />
                        <Text style={{marginTop: 20, color: '#FFF', fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.pre}</Text>
                    </View>

                    <TextInputRN label='Nom' inputs={inputs} errors={errors} tag='nom' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} />
                    <TextInputRN label='Prénom(s)' inputs={inputs} errors={errors} tag='pre' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} />
                    <TextInputRN label='Pseudo' inputs={inputs} errors={errors} tag='username' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} />
                    <TextInputRN label='Email' inputs={inputs} errors={errors} tag='email' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} keyboardType='email-address' />
                    <TextInputRN label='téléphone' inputs={inputs} errors={errors} tag='tel' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} keyboardType='phone-pad' />

                    <View style={{alignItems: 'center', marginBottom: 30, marginTop: 10}}>
                        <Pressable onPress={onSelectImage} style={{width: 150, height: 150, borderWidth: 1, borderColor: '#ccc'}}>
                            <Icon type='ant-design' name='camera' color='#FFF' containerStyle={{position: 'absolute', top: 5, right: 5, zIndex: 1}} />
                            <Image 
                                source={src}
                                style={{width: '100%', height: '100%'}}
                                resizeMode='cover'
                            />
                        </Pressable>
                        <Text style={{color: '#FFF', fontSize: 12, marginTop: 2}}>(Proto de profil)</Text>
                    </View>

                    <View style={styles.contentContainerInput}>
                        <Button mode="contained" onPress={onHandlePress} loading={loading} buttonColor={app_color_main} labelStyle={{ fontSize: 20, paddingVertical: 5 }}>
                            Enregistrer
                        </Button>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    contentContainerInput: {
        marginHorizontal: 20,
        marginBottom: 10
    }
})