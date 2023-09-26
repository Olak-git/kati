import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
export default function Login() {
    const dark = '#000';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submited, setSubmited] = useState(false);
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
    useEffect(() => {
        const authenticate = async () => {
            axios.post("https://fairylandstudios.net/mobile_api/login.php",
                JSON.stringify({
                    email: email,
                    password: password,
                })
            ).then((Response) => {
                Connected;
                setSubmited(false);
            }).catch(() => {
                NotConnected
            });
        };

        if (submited) authenticate();
    }, [submited]);
    return (
        <View
            style={{
                marginTop: 100,
            }}
        >
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: '#aa090a',
                    textAlign: 'center',
                    marginTop: 50,
                    margin: 30,

                }}
            >
                Espace connexion
            </Text>
            <View>
                <TextInput
                    placeholder='Email'
                    autoCapitalize='none'
                    placeholderTextColor={dark}
                    style={{
                        fontSize: 20,
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                        marginVertical: 10,
                        backgroundColor: '#acacac',
                    }}
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    onChangeText={(text) => setPassword(text)}
                    placeholder='Mot de passe'
                    autoCapitalize='none'
                    secureTextEntry
                    placeholderTextColor={dark}
                    style={{
                        fontSize: 20,

                        borderBottomColor: '#aa090a',
                        padding: 20,
                        margin: 20,
                        borderRadius: 10,
                        marginVertical: 10,
                        backgroundColor: '#acacac',
                    }}
                />
            </View>
            <View>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: '600',
                        alignSelf: 'flex-end',
                        color: '#aa090a',
                        padding: 10,
                    }}
                >
                    Mot de passe oublié ?
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => setSubmited(true)}
                style={{
                    backgroundColor: '#aa090a',
                    paddingVertical: 20,
                    paddingHorizontal: 15,
                    marginLeft: 20,
                    width: "80%",
                    borderRadius: 20,
                }}

            >
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    Connexion
                </Text>
            </TouchableOpacity>
        </View>
    );
}