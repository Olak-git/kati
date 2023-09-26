import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, StatusBar, Image, ScrollView, Pressable, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { DRAWER_HEADER_SHOWN, baseUri } from '../constants/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setVisibleAllSystem } from '../feature/user.slice';
import { setVideoSdkToken, setVisibleLiveButton } from '../feature/videosdk.authtoken.slice';
import { CommonActions } from '@react-navigation/native';
import { app_color_main } from '../services/data';
import LinearGradient from 'react-native-linear-gradient';
import { HelperText, TextInput, Button } from 'react-native-paper';
import { Icon } from '@rneui/base';
import TextInputRN from '../components/TextInputRN';
import { handleFilePicker, openLaunchGalery } from '../services/helpersFunction';

export default function Register({navigation}) {
    const dispatch = useDispatch();

    const videoSdkAuthToken = useSelector(state => state.videosdk.token)
    const user = useSelector(state => state.user.data)

    const COLOR_BASE = '#aa090a'
    const [titleColor, setTitleColor] = useState(COLOR_BASE)

    const [loading, setLoading] = useState(false);

    const [paddingBtm, setPaddingBtm] = useState(0);

    const [src, setSrc] = useState(require('../assets/images/person.png'))

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

    const saveFile = (jsonUser) => {
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
            formData.append('usersId', jsonUser.id)
            formData.append('token', jsonUser.slug)
            fetch(APIURL, {
                method: 'POST',
                headers: headers,
                body: formData
            })
            .then((Response) => Response.json())
            .then((json) => {
                if(json.success) {
                    const copy = {...jsonUser, img: json.img}
                    
                    if(json.videosdk_auth_token && json.videosdk_auth_token !== videoSdkAuthToken) {
                        dispatch(setVideoSdkToken(json.videosdk_auth_token))
                    }

                    dispatch(setUser({...copy}))
                    Alert.alert('Profil créé avec succès.');
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

    const onHandle = () => {
        let isValid = true
        clearErrors()

        if(isValid) {
            setLoading(true)
            var APIURL = baseUri + "register.php";

            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                ...inputs,
                usersId: user.id
            };
            console.log('Data: ', Data)
            fetch(APIURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(Data)
            })
            .then((Response) => Response.json())
            .then((json) => {
                if(json.success) {

                    if(json.show_all_system) {
                        dispatch(setVisibleAllSystem(json.show_all_system))
                    }
                    if(json.show_live_system) {
                        dispatch(setVisibleLiveButton(json.show_live_system))
                    }

                    if(Object.keys(inputs.img).length!=0) {
                        saveFile(json.user)
                    } else {
                        if(json.videosdk_auth_token && json.videosdk_auth_token !== videoSdkAuthToken) {
                            dispatch(setVideoSdkToken(json.videosdk_auth_token))
                        }
                        dispatch(setUser({...json.user}))
                        Alert.alert('Profil créé avec succès.');
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
                setLoading(false)
            })
        }
    }

    const onSelectImage = async () => {
        let response = null
        let file = {}
        if(Platform.OS !== 'android') {
            response = await handleFilePicker()
            // {"fileCopyUri": null, "name": "IMG-20230603-WA0003.jpg", "size": 160983, "type": "image/jpeg", "uri": "content://com.android.providers.media.documents/document/image%3A32442"}
            setSrc({uri: response.uri})
            file = {
                'fileCopyUri': null,
                'name': response.name,
                'size': response.size,
                'type': response.type,
                'uri': response.uri
            }
        } else {
            response = await openLaunchGalery()
            file = {
                'fileCopyUri': null,
                'name': response.fileName,
                'size': response.fileSize,
                'type': response.type,
                'uri': response.uri
            }
            // {"fileName": "rn_image_picker_lib_temp_dd652cd1-2636-4d55-8920-ab05f45459d8.jpg", "fileSize": 4183358, "height": 3024, "type": "image/jpeg", "uri": "file:///data/user/0/com.kati/cache/rn_image_picker_lib_temp_dd652cd1-2636-4d55-8920-ab05f45459d8.jpg", "width": 4032}
            setSrc({uri: response.uri})
        }
        console.log('Response: ', response)
        onHandleChangeText('img', file)
    }

    const [keyboardStatus, setKeyboardStatus] = useState(undefined);

    useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus("Keyboard Shown");
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus("Keyboard Hidden");
      });
  
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    return (
        <SafeAreaView style={{flex:1}}>
            <StatusBar color={app_color_main} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex:1 }}
            >
                <LinearGradient colors={[app_color_main, '#000', '#000', '#000']} style={{ flex: 1 }}>
                    <Pressable onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 20, left: 20, zIndex: 1, padding: 10 }}>
                        <Icon type="ant-design" name="left" color='#FFF' size={20} />
                    </Pressable>

                    <ScrollView
                        onScroll={(e) => {
                            // console.log('Event Keys => ', Object.keys(e))
                            // console.log('Event => ', e.nativeEvent.contentOffset)
                            if (e.nativeEvent.contentOffset.y > 150) {
                                if (titleColor == COLOR_BASE) {
                                    setTitleColor('#FFF')
                                }
                            } else {
                                if (titleColor != COLOR_BASE) {
                                    setTitleColor(COLOR_BASE)
                                }
                            }
                        }}
                        contentContainerStyle={{ paddingTop: 100, paddingBottom: 80 }}
                    >
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/images/kati_icone.png')} resizeMode='stretch' style={{ width: 200, height: 200 }} />
                        </View>

                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: titleColor, textAlign: 'center', marginTop: 50, marginBottom: 30 }}>Espace inscription</Text>

                        <View style={{ marginHorizontal: 20 }}>

                            <TextInputRN label='Nom' inputs={inputs} errors={errors} tag='nom' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} />
                            <TextInputRN label='Prénom(s)' inputs={inputs} errors={errors} tag='pre' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} />
                            <TextInputRN label='Username' inputs={inputs} errors={errors} tag='username' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} />
                            <TextInputRN label='Email' inputs={inputs} errors={errors} tag='email' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} keyboardType='email-address' />
                            <TextInputRN label='Mot de passe' inputs={inputs} errors={errors} tag='password' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} secure />
                            <TextInputRN label='téléphone' inputs={inputs} errors={errors} tag='tel' onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} keyboardType='phone-pad' />

                            {/* <View style={{alignItems: 'center', marginBottom: 30}}>
                                    <Pressable onPress={onSelectImage} style={{width: 150, height: 150, borderWidth: 1, borderColor: '#ccc'}}>
                                        <Icon type='ant-design' name='camera' color='#FFF' containerStyle={{position: 'absolute', top: 5, right: 5}} />
                                        <Image 
                                            source={src}
                                            style={{width: '100%', height: '100%'}}
                                            resizeMode='cover'
                                        />
                                    </Pressable>
                                    <Text style={{color: '#FFF', fontSize: 12, marginTop: 2}}>(Photo de profil)</Text>
                                </View> */}

                            <View style={styles.contentContainerInput}>
                                <Button mode="contained" onPress={onHandle} loading={loading} buttonColor={app_color_main} style={{ borderRadius: 40 }} contentStyle={{ paddingVertical: 8 }} labelStyle={{ fontSize: 18 }}>
                                    Inscription
                                </Button>
                            </View>

                        </View>
                    </ScrollView>
                </LinearGradient>
            </KeyboardAvoidingView>


        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainerInput: {
        // marginHorizontal: 20,
        marginBottom: 5
    }
})