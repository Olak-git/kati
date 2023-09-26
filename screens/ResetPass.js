import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, StatusBar, Image, ScrollView, Pressable, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DRAWER_HEADER_SHOWN, baseUri } from '../constants/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../feature/user.slice';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { app_color_main } from '../services/data';
import LinearGradient from 'react-native-linear-gradient';
import { HelperText, TextInput, Button } from 'react-native-paper';
import OTPInput from 'react-native-otp-forminput';
import { Icon } from '@rneui/base';
import TextInputRN from '../components/TextInputRN';

const COLOR_BASE = '#aa090a'

// const TextInputRN = ({label, inputs, errors, tag, onHandleChangeText, secure=false, keyboardType='default'}) => {
//     const [visible, setVisible] = useState(false)

//     return (
//         <View style={styles.contentContainerInput}>
//             <TextInput
//                 secureTextEntry={secure && !visible}
//                 right={secure?<TextInput.Icon icon="eye" onPress={()=>setVisible(!visible)} />:undefined}
//                 label={label} 
//                 value={inputs[tag]} 
//                 onChangeText={(text) => onHandleChangeText(tag, text)} 
//                 error={errors[tag]!=null}
//                 keyboardType={keyboardType}
//             />
//             <HelperText type="error" visible={errors[tag]!=null}>
//                 {errors[tag]}
//             </HelperText>
//         </View>
//     )
// }

const ConfirmationModal = ({visible, onCloseModal, inputs, errors, onHandleChangeText, navigation}) => {
    const [loading, setLoading] = useState(false);
    const [titleColor, setTitleColor] = useState(COLOR_BASE)
    const OTP_INPUT_DEFAULT_BORDER_COLOR = '#8FA2A3'
    const [otpInputBorderColor, setOtpInputBorderColor] = useState(OTP_INPUT_DEFAULT_BORDER_COLOR)
    const { email, otp } = inputs

    // 25458

    const generateNewPassword = () => {
        let valid = true
        if(inputs.code != otp) {
            valid = false
            Alert.alert('Mauvais code!')
            console.log('Code:: ', inputs.code)
        }
        if(valid) {
            setLoading(true)
            var APIURL = baseUri+"ressetPassword.php";
    
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
    
            var Data = {
                email: email,
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
                    Alert.alert(Response.msg)
                    Alert.alert(
                        'Réinitialisation Réussie', 
                        Response.msg, 
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    onCloseModal();
                                    navigation.goBack()
                                },
                            },
                        ]
                    );
                } else {
                    Alert.alert(Response.errors.email)
                }
            })
            .catch((Response) => {
                console.log('Error: ', Response)
            })
            .finally(() => {
                setLoading(false)
            })
        }
    }

    useEffect(()=>{
        console.log('OTP: ', otp)
        console.log('OTP Length: ', otp.toString().length)
    }, [otp])

    return (
        <Modal
            visible={visible}
            animated
            animationType='fade'
            presentationStyle='overFullScreen'
            transparent
            onShow={(event) => console.log('Modal Visible')}
            onRequestClose={() => {
                console.log('Badge')
            }}
        >
            <LinearGradient colors={[app_color_main, '#000', '#000', '#000']} style={{flex: 1}}>
                <Pressable onPress={onCloseModal} style={{position: 'absolute', top: 20, left: 20, zIndex: 1, padding: 10}}>
                    <Icon type="ant-design" name="close" color='#FFF' size={30} />
                </Pressable>
                <ScrollView 
                    onScroll={(e) => {
                        // console.log('Event Keys => ', Object.keys(e))
                        // console.log('Event => ', e.nativeEvent.contentOffset)
                        // if(e.nativeEvent.contentOffset.y > 150) {
                        //     if(titleColor == COLOR_BASE) {
                        //         setTitleColor('#FFF')
                        //     }
                        // } else {
                        //     if(titleColor != COLOR_BASE) {
                        //         setTitleColor(COLOR_BASE)
                        //     }
                        // }
                    }}
                    contentContainerStyle={{paddingTop: 100, paddingBottom: 20}}
                >
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={require('../assets/images/kati_icone.png')} resizeMode='stretch' style={{width: 150, height: 150}} />
                    </View>

                    <Text style={{fontSize: 20,fontWeight: 'bold',color: titleColor,textAlign: 'center',marginTop: 50,marginBottom: 30}}>Confirmation de l'identité</Text>

                    <View style={{marginHorizontal: 20}}>

                        <Text style={{color: '#FFF', textAlign: 'center', marginBottom: 10}}>Veuillez entrer le code envoyé à l'adresse email</Text>
                        <Text style={{color: '#FFF', textAlign: 'center', fontWeight: '700', fontSize: 18, marginBottom: 30}}>{email}</Text>

                        <View style={{marginBottom: 30}}>
                            <OTPInput
                                title="Code"
                                titleStyle={{color: '#FFF'}}
                                inputStyle={{color: '#000', fontWeight: '700'}}
                                // borderColor={otpInputBorderColor}
                                currentBorderColor={app_color_main}
                                type="outline"
                                numberOfInputs={otp.toString().length}
                                // onFilledCode
                                onChange={code => {
                                    const str = otp.toString().substr(0, code.toString().length)
                                    if(str != code) {
                                        setOtpInputBorderColor('rgb(153, 27, 27)')
                                    } else {
                                        setOtpInputBorderColor(OTP_INPUT_DEFAULT_BORDER_COLOR)
                                    }
                                    console.log('CODE: ', code);
                                    onHandleChangeText('code', code)
                                }}
                            />
                        </View>

                        <View style={styles.contentContainerInput}>
                            <Button mode="contained" onPress={generateNewPassword} loading={loading} buttonColor={app_color_main} style={{borderRadius: 40}} contentStyle={{paddingVertical: 8}} labelStyle={{fontSize: 18}}>
                                Envoyer
                            </Button>
                        </View>

                    </View>
                </ScrollView>
            </LinearGradient>
        </Modal>
    )
}

const SubmitEmail = ({inputs, errors, onHandleChangeText}) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [titleColor, setTitleColor] = useState(COLOR_BASE)

    const getAuthToken = () => {
        setLoading(true)
        var APIURL = baseUri+"sendVerificationEmail.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        var Data = {
            email: inputs.email,
        };

        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((Response) => {
            console.log('Response: ', Response)
            if(Response.success) {
                onHandleChangeText('otp', Response.code_otp)
            } else {
                Alert.alert(Response.errors.email)
            }
        })
        .catch((Response) => {
            console.log('Error: ', Response)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <LinearGradient colors={[app_color_main, '#000', '#000', '#000']} style={{flex: 1}}>
            <Pressable onPress={()=>navigation.goBack()} style={{position: 'absolute', top: 20, left: 20, zIndex: 1, padding: 10}}>
                <Icon type="ant-design" name="left" color='#FFF' size={20} />
            </Pressable>
            <ScrollView 
                onScroll={(e) => {
                    // console.log('Event Keys => ', Object.keys(e))
                    // console.log('Event => ', e.nativeEvent.contentOffset)
                    // if(e.nativeEvent.contentOffset.y > 150) {
                    //     if(titleColor == COLOR_BASE) {
                    //         setTitleColor('#FFF')
                    //     }
                    // } else {
                    //     if(titleColor != COLOR_BASE) {
                    //         setTitleColor(COLOR_BASE)
                    //     }
                    // }
                }}
                contentContainerStyle={{paddingTop: 100, paddingBottom: 20}}
            >
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require('../assets/images/kati_icone.png')} resizeMode='stretch' style={{width: 150, height: 150}} />
                </View>

                <Text style={{fontSize: 20,fontWeight: 'bold',color: titleColor,textAlign: 'center',marginTop: 50,marginBottom: 30}}>Réinitialiser mon mot de passe</Text>

                <View style={{marginHorizontal: 20}}>

                    <Text style={{color: '#FFF', textAlign: 'center', marginBottom: 20}}>Veuillez entrer votre adresse email</Text>
                    <TextInputRN label='Email' inputs={inputs} errors={errors} tag='email' onHandleChangeText={onHandleChangeText} />

                    <View style={styles.contentContainerInput}>
                        <Button mode="contained" onPress={getAuthToken} loading={loading} buttonColor={app_color_main} style={{borderRadius: 40}} contentStyle={{paddingVertical: 8}} labelStyle={{fontSize: 18}}>
                            Envoyer
                        </Button>
                    </View>

                </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default function ResetPass({navigation}) {
    const dispatch = useDispatch();
    //recuperation donnée sauvegarder
    // const user = useSelector(state => state.user.data )
    // const dark = '#000';
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    const [visible, setVisible] = useState(false);

    const [inputs, setInputs] = useState({
        email: '',
        code: '',
        otp: ''
    })

    const [errors, setErrors] = useState({
        email: null,
        code: null
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

    const openModal = () => {
        setVisible(true)
    }

    const closeModal = () => {
        setVisible(false)
        onHandleChangeText('otp', '')
    }

    useEffect(() => {
        if(inputs.otp) {
            openModal()
        }
    }, [inputs])

    return(
        <SafeAreaView style={{flex:1}}>
            <StatusBar color={app_color_main} />
            <ConfirmationModal inputs={inputs} errors={errors} onHandleChangeText={onHandleChangeText} visible={visible} onCloseModal={closeModal} navigation={navigation} />
            <SubmitEmail inputs={inputs} errors={errors} onHandleChangeText={onHandleChangeText} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainerInput: {
        // marginHorizontal: 20,
        marginBottom: 5
    }
})