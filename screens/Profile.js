import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image, Modal, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { DRAWER_HEADER_SHOWN, baseSite } from '../constants/Constants'
import { app_color_main } from '../services/data'
import HeaderCustom from '../components/HeaderCustom'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from '@rneui/base'
import ModalLoad from '../components/ModalLoad'
import { Button, Modal as ModalPaper } from 'react-native-paper'
import { deleteUser } from '../feature/user.slice'

const Tab = ({onHandlePress=undefined, iconType='ant-design', iconName, iconColor=app_color_main, iconSize=20, label, gradientColors=['#FFF', '#000'], labelStyle}) => {
    return (
        <LinearGradient start={{x: 0., y: 0.25}} end={{x: 1, y: 1.0}} colors={gradientColors} style={{marginHorizontal: 30, marginBottom: 20, borderRadius: 40, paddingVertical: 6, paddingHorizontal: 10}}>
            <TouchableOpacity
                onPress={onHandlePress}
                style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10, paddingHorizontal: 3, paddingVertical: 4, borderColor: '#eee', borderBottomWidth: 0 }}
            >
                <Icon type={iconType} name={iconName} size={iconSize} color={iconColor} containerStyle={{marginRight: 5}} />
                <Text style={[{color: '#000', fontSize: 18}, labelStyle]}>{label}</Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}

const Profile = ({navigation}) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data)
    const path = user.img ? { uri: baseSite + user.img } : require('../assets/images/kati_icone.png')
    // const path = require('../assets/images/user-1.png')

    const [visible, setVisible] = useState(false)
    const [show, setShow] = useState(false)

    const { width: window_width } = useWindowDimensions()

    const signOut = async () => {
        hideDelModal()
        // await dispatch(setStopped(true));
        setVisible(true);
        setTimeout(async () => {
            setVisible(false);
            await dispatch(deleteUser());
        }, 5000)
    }

    const showDelModal = () => setShow(true)
    const hideDelModal = () => setShow(false)

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <StatusBar backgroundColor={app_color_main} />
            
            <ModalLoad visible={visible} />

            <Modal 
                visible={show}
                transparent
                animationType='fade'
                presentationStyle='overFullScreen'
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <View style={{backgroundColor:'#FFF', minWidth: 200, width: window_width - 50, height: 200, padding: 10, justifyContent: 'center', borderRadius: 20}}>
                        <Text style={{fontSize: 18, color: '#000', textAlign: 'center'}}>Votre compte va être supprimé. Vous allez perdre toutes vos données.</Text>
                        <View style={{marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Button onPress={hideDelModal} mode='contained' buttonColor='#000' style={{marginBottom: 20}}>Annuler</Button>
                            <Button onPress={signOut} mode='contained'  style={{marginBottom: 20}}>Continuer</Button>
                        </View>
                    </View>
                </View>
            </Modal>

            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack={false} />
            )}
            <ScrollView contentContainerStyle={{paddingBottom: 50}}>
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <Image source={path} style={{ width: 80, height: 80, borderRadius: 10 }} />
                    <Text style={{marginTop: 20, color: '#FFF', fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.pre}</Text>
                </View>

                <Tab iconName='edit' label='Editer mon profil' onHandlePress={() => navigation?.navigate('edit_profile')} />
                <Tab iconName='edit' label='Editer mon mot de passe' onHandlePress={() => navigation?.navigate('edit_password')} />
                <Tab iconName='close' label='Supprimer mon compte' onHandlePress={showDelModal} />
                <Tab iconName='logout' iconColor='#FFF' label='Déconnexion' labelStyle={{color: '#FFF'}} gradientColors={['red', '#000']} onHandlePress={signOut} />

            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({})