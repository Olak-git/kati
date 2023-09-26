import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, StatusBar, Image, ScrollView, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DRAWER_HEADER_SHOWN, baseUri } from '../constants/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setVisibleAllSystem } from '../feature/user.slice';
import { setVideoSdkToken, setVisibleLiveButton } from '../feature/videosdk.authtoken.slice';
import { CommonActions } from '@react-navigation/native';
import { app_color_main } from '../services/data';
import LinearGradient from 'react-native-linear-gradient';
import { HelperText, TextInput, Button } from 'react-native-paper';
import { Icon } from '@rneui/base';

const TextInputRN = ({label, inputs, errors, tag, onHandleChangeText, secure=false, keyboardType='default'}) => {
    const [visible, setVisible] = useState(false)

    return (
        <View style={styles.contentContainerInput}>
            <TextInput
                secureTextEntry={secure && !visible}
                right={secure?<TextInput.Icon icon="eye" onPress={()=>setVisible(!visible)} />:undefined}
                label={label} 
                value={inputs[tag]} 
                onChangeText={(text) => onHandleChangeText(tag, text)} 
                error={errors[tag]!=null}
                keyboardType={keyboardType}
            />
            <HelperText type="error" visible={errors[tag]!=null}>
                {errors[tag]}
            </HelperText>
        </View>
    )
}

export default function Login({navigation}) {
    const dispatch = useDispatch();
    //recuperation donnée sauvegarder
    const videoSdkAuthToken = useSelector(state => state.videosdk.token)
    const user = useSelector(state => state.user.data )
    const dark = '#000';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submited, setSubmited] = useState(false);

    const COLOR_BASE = '#aa090a'
    const [titleColor, setTitleColor] = useState(COLOR_BASE)

    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({
        email: null,
        password: null
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

    const Connected = () =>
        Alert.alert('Connexion réussie', 'Vous allez être rediriger vers votre tableau de bord', [
            {
                text: 'OK',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
,
        ]);
    const NotConnected = () =>
        Alert.alert('Echec de la connexion', 'verifiez vos identifiants', [
            {
                text: 'OK',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            ,
        ]);
    const redirect = ()=>{
        // navigation.navigate('accueil')
        //ecraser lecran de retour
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'drawer' }
                ]
            })
        )
    }
    
    const authenticate = async () => {
        setLoading(true)
        var APIURL = baseUri+"login.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        var Data = {
            email: email,
            password: password,
            ...inputs
        };

        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((Response) => {
            if(Response.success) {
                setLoading(false)
                if(Response.videosdk_auth_token && Response.videosdk_auth_token !== videoSdkAuthToken) {
                    dispatch(setVideoSdkToken(Response.videosdk_auth_token))
                }
                if(Response.show_all_system) {
                    dispatch(setVisibleAllSystem(Response.show_all_system))
                }
                if(Response.show_live_system) {
                    dispatch(setVisibleLiveButton(Response.show_live_system))
                }
                dispatch(setUser(Response.data))
            } else {
                NotConnected()
            }
        })
        .catch((Response) => {
            console.log('Error: ', Response)
        })
        .finally(() => {
            setLoading(false)
        })
    };

    // useEffect(() =>{
    //     console.log('user:', user)
    //     console.log('userId:', user.id)
    // }, [user]);

    // useEffect(()=>{
    //     // if(Object.keys(user).length != 0) redirect()
    // },[user])

    return(
        <SafeAreaView style={{flex:1}}>
            <StatusBar color={app_color_main} />
            <KeyboardAvoidingView
                behavior={Platform.OS=='ios'?'padding':'height'}
                style={{flex: 1}}
            >
                <LinearGradient colors={[app_color_main, '#000', '#000', '#000']} style={{flex: 1}}>
                    <Pressable onPress={()=>navigation.goBack()} style={{position: 'absolute', top: 20, left: 20, zIndex: 1, padding: 10}}>
                        <Icon type="ant-design" name="left" color='#FFF' size={20} />
                    </Pressable>
                    <ScrollView 
                        onScroll={(e) => {
                            // console.log('Event Keys => ', Object.keys(e))
                            // console.log('Event => ', e.nativeEvent.contentOffset)
                            if(e.nativeEvent.contentOffset.y > 150) {
                                if(titleColor == COLOR_BASE) {
                                    setTitleColor('#FFF')
                                }
                            } else {
                                if(titleColor != COLOR_BASE) {
                                    setTitleColor(COLOR_BASE)
                                }
                            }
                        }}
                        contentContainerStyle={{paddingTop: 100, paddingBottom: 50}}
                    >
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={require('../assets/images/kati_icone.png')} resizeMode='stretch' style={{width: 200, height: 200}} />
                        </View>

                        <Text style={{fontSize: 30,fontWeight: 'bold',color: titleColor,textAlign: 'center',marginTop: 50,marginBottom: 30}}>Espace connexion</Text>

                        <View style={{marginHorizontal: 20}}>

                            <TextInputRN label='Email' inputs={inputs} errors={errors} tag='email' onHandleChangeText={onHandleChangeText} keyboardType='email-address' />
                            <TextInputRN label='Mot de passe' inputs={inputs} errors={errors} tag='password' onHandleChangeText={onHandleChangeText} secure />

                            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 15}}>
                                <Pressable onPress={() => navigation.navigate('reset_pass')} style={{}}>
                                    <Text style={{color: '#FFF', textAlign: 'right'}}>Mot de passe oublié?</Text>
                                </Pressable>
                            </View>

                            <View style={styles.contentContainerInput}>
                                <Button mode="contained" onPress={authenticate} loading={loading} buttonColor={app_color_main} style={{borderRadius: 40}} contentStyle={{paddingVertical: 8}} labelStyle={{fontSize: 18}}>
                                    Connexion
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