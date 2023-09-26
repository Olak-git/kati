import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { DRAWER_HEADER_SHOWN, baseSite, baseUri } from '../constants/Constants'
import { app_color_main } from '../services/data'
import HeaderCustom from '../components/HeaderCustom'
import { useSelector } from 'react-redux'
import { Icon } from '@rneui/base'
import { HelperText, TextInput, Button } from 'react-native-paper';
import TextInputRN from '../components/TextInputRN'

const EditPassword = ({navigation}) => {
    const user = useSelector(state => state.user.data)
    const path = user.img ? { uri: baseSite + user.img } : require('../assets/images/kati_icone.png')
    // const path = require('../assets/images/user-1.png')

    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    })

    const [errors, setErrors] = useState({
        current_password: null,
        new_password: null,
        confirm_password: null
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

    const onHandlePress = () => {
        let isValid = true
        clearErrors()

        if(isValid) {
            setLoading(true)
            var APIURL = baseUri + "editPassword.php";

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
                if(json.success) {
                    Alert.alert('Mot de passe mis à jour avec succès.');
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

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack />
            )}
            <ScrollView contentContainerStyle={{paddingBottom: 50}}>
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <Image source={path} style={{ width: 80, height: 80, borderRadius: 10 }} />
                    <Text style={{marginTop: 20, color: '#FFF', fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.pre}</Text>
                </View>

                <TextInputRN label='Mot de passe actuel' inputs={inputs} errors={errors} tag='current_password' onHandleChangeText={onHandleChangeText} secure contentContainerStyle={styles.contentContainerInput} />

                <TextInputRN label='Nouveau mot de passe' inputs={inputs} errors={errors} tag='new_password' onHandleChangeText={onHandleChangeText} secure contentContainerStyle={styles.contentContainerInput} />
                
                <TextInputRN label='Confirmation' inputs={inputs} errors={errors} tag='confirm_password' onHandleChangeText={onHandleChangeText} secure contentContainerStyle={styles.contentContainerInput} />

                <View style={styles.contentContainerInput}>
                    <Button mode="contained" onPress={onHandlePress} loading={loading} buttonColor={app_color_main} labelStyle={{ fontSize: 20, paddingVertical: 5 }}>
                        Enregistrer
                    </Button>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default EditPassword

const styles = StyleSheet.create({
    contentContainerInput: {
        marginHorizontal: 20,
        marginBottom: 10
    }
})