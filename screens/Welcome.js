import React from 'react';
import { CommonActions } from '@react-navigation/native';
import {
    View,
    Text,
    Image,
    StyleSheet,
    SafeAreaView,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { app_color_main } from '../services/data';
import LinearGradient from 'react-native-linear-gradient';


const imageWelcome = { uri: 'https://fairylandstudios.net/mobile_api/images/welcome/welcome.png' };

export default function Welcome({ navigation }) {

    //recuperation donnée sauvegarder
    const user = useSelector(state => state.user.data)

    const goToLogin = () => {
        navigation.navigate('login');
    }
    const goToregister = () => {
        navigation.navigate('register');
    }
    const redirect = () => {
        // navigation.navigate('accueil')
        //ecraser lecran de retour
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'accueil' }
                ]
            })
        )
    }
    useEffect(() => {
        if (Object.keys(user).length !== 0) redirect()
    }, [user])

    // old_color: '#aa090a'
    
    return(
        <SafeAreaView style={{flex:1, borderWidth: 0, borderColor: 'red'}}>
            <StatusBar backgroundColor={app_color_main} />
            <View style={{flex:1}}>
                <Image
                    resizeMode="contain"
                    source={require("../assets/images/welcome.png")}
                />
                <LinearGradient colors={['#FFF', '#FFF', app_color_main, '#000']} style={{flex:1}}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}} >
                        <Text style={{ textAlign: 'center', color: app_color_main, fontSize: 30, margin: 10,  fontWeight: 'bold'}} >Vivez le cinéma autrement</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            marginTop: 20
                        }}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={goToLogin}
                        >
                            <Text style={styles.button_label}>Connexion</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={goToregister}
                        >
                            <Text style={styles.button_label}>Inscription</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: app_color_main,
        paddingVertical: 15,
        paddingHorizontal: 15,
        // marginLeft: 20,
        width: "40%",
        borderRadius: 26,
    },
    button_label: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    vivez: {
        fontSize: 35,
    },
});