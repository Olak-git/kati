import { View, Text, StatusBar, Platform, Image, Pressable, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon } from '@rneui/base'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient';
import { baseSite } from '../constants/Constants'
import { deleteUser, setUser } from '../feature/user.slice'
import { app_color_main } from '../services/data';

 const DrawerMenuText = ({ text }) => {
    return (
        <Text style={ { flex: 1, paddingHorizontal: 4, fontWeight: '300', color: '#FFF', fontSize: 16, }}>{text}</Text>
    )
}

// interface DrawerMenuProps {
//     navigation?: any,
//     containerStyle?: StyleProp<ViewStyle>,
//     iconType?: string,
//     iconName: string,
//     iconSize?: number,
//     textMenu: string,
//     screenName?: string,
//     screenParams?: any
// }
const DrawerMenu = ({ navigation, iconImage=undefined, iconType = 'font-awesome-5', iconName, iconSize = 25, textMenu, screenName, screenParams = {} }) => {

    return (
        <LinearGradient start={{x: 0., y: 0.25}} end={{x: 1, y: 1.0}} colors={['#000', app_color_main]} style={{marginHorizontal: 10, marginBottom: 20, borderRadius: 40, paddingVertical: 7, paddingHorizontal: 10}}>
            <TouchableOpacity
                onPress={() => navigation?.navigate(screenName, screenParams)}
                style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 3, paddingVertical: 4, borderColor: '#eee', borderBottomWidth: 0 }}
            >
                {iconImage
                ?
                    <Image source={iconImage} style={{width: iconSize, height: iconSize, marginRight: 5, borderRadius: 50}} />
                :
                    <Icon type={iconType} name={iconName} size={iconSize} color='#CCC' containerStyle={{marginRight: 5}} />
                }
                <DrawerMenuText text={textMenu} />
            </TouchableOpacity>
        </LinearGradient>
    )
}


const CustomSideMenu = ({navigation}) => {

    const show_all_system = useSelector(state => state.user.show_all_system)
    const show_live_system = useSelector(state => state.videosdk.visible)
    const user = useSelector(state => state.user.data)
    const path = user.img ? { uri: baseSite + user.img } : require('../assets/images/kati_icone.png')
    // const path = require('../assets/images/user-1.png')

    const { height } = useWindowDimensions();
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false)


    // const onSignOut = async () => {
    //     await dispatch(setStopped(true));
    //     setVisible(true);
    //     setTimeout(async () => {
    //         setVisible(false);
    //         await dispatch(deleteUser());
    //     }, 5000)
    // }

    return (
        <LinearGradient colors={['#FFF', app_color_main, '#000000']} style={{flex: 1}}>
            <View style={[ { height: '100%', paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 40 }]}>
                {/* <View style={{ paddingHorizontal: 4, paddingVertical: 3, minHeight: 120, backgroundColor: 'red' }}>
                </View> */}
                <View style={{ alignItems: 'center', borderBottomWidth: 2, borderColor: '#000', marginBottom: 20 }}>
                    <Image source={path} style={{ width: 80, height: 80, borderRadius: 10 }} />
                    <Text style={{marginBottom: 8, marginTop: 5, color: '#000', fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.pre}</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 10}}>
                    <View style={{paddingHorizontal: 4, paddingVertical: 3}}>
                        <DrawerMenu navigation={navigation} screenName='accueil_dr' iconType='ant-design' iconName='home' textMenu='Accueil' />
                        {(show_all_system) && (
                            <DrawerMenu navigation={navigation} screenName='shorts_dr' iconType='entypo' iconName='folder-video' textMenu='Shorts' />
                        )}
                        <DrawerMenu navigation={navigation} screenName='profile_dr' iconType='ionicon' iconName='ios-settings-sharp' textMenu='Paramètres' />
                        {(show_all_system && show_live_system) && (
                            <DrawerMenu navigation={navigation} screenName='live_dr' iconType='material-icon' iconName='live-tv' textMenu='Lives' />
                        )}
                        <DrawerMenu navigation={navigation} screenName={Platform.OS=='ios'?'new_short_dr':'short_tabs'} iconType='entypo' iconName='add-to-list' textMenu='New Shorts' />
                        <DrawerMenu navigation={navigation} screenName={Platform.OS=='ios'?'new_video_dr':'video_tabs'} iconType='entypo' iconName='add-to-list' textMenu='New Videos' />
                        {/* {show_all_system && (
                            <DrawerMenu navigation={navigation} screenName='rse_hearter_dr' iconImage={require('../assets/images/rse_hearter.jpeg')} textMenu='Rse Hearter' />
                        )} */}

                        {/* {show_all_system
                            ? <>
                                <DrawerMenu navigation={navigation} screenName='accueil_dr' iconType='ant-design' iconName='home' textMenu='Accueil' />
                                <DrawerMenu navigation={navigation} screenName='shorts_dr' iconType='entypo' iconName='folder-video' textMenu='Shorts' />
                                <DrawerMenu navigation={navigation} screenName='profile_dr' iconType='ionicon' iconName='ios-settings-sharp' textMenu='Paramètres' />
                                {show_live_system && (
                                    <DrawerMenu navigation={navigation} screenName='live_dr' iconType='material-icon' iconName='live-tv' textMenu='Lives' />
                                )}

                                <DrawerMenu navigation={navigation} screenName={Platform.OS=='ios'?'new_short_dr':'short_tabs'} iconType='entypo' iconName='add-to-list' textMenu='New Shorts' />
                                <DrawerMenu navigation={navigation} screenName={Platform.OS=='ios'?'new_video_dr':'video_tabs'} iconType='entypo' iconName='add-to-list' textMenu='New Videos' />

                                <DrawerMenu navigation={navigation} screenName='rse_hearter_dr' iconImage={require('../assets/images/rse_hearter.jpeg')} textMenu='Rse Hearter' />
                            </>
                            : <>
                                <DrawerMenu navigation={navigation} screenName='accueil_dr' iconType='ant-design' iconName='home' textMenu='Accueil' />
                                <DrawerMenu navigation={navigation} screenName='profile_dr' iconType='ionicon' iconName='ios-settings-sharp' textMenu='Paramètres' />
                                <DrawerMenu navigation={navigation} screenName={Platform.OS=='ios'?'new_short_dr':'short_tabs'} iconType='entypo' iconName='add-to-list' textMenu='New Shorts' />
                                <DrawerMenu navigation={navigation} screenName={Platform.OS=='ios'?'new_video_dr':'video_tabs'} iconType='entypo' iconName='add-to-list' textMenu='New Videos' />
                            </>
                        } */}

                        {/* <TouchableOpacity
                            onPress={onSignOut}
                            style={[tw`flex-row items-center py-2 px-3`]}>
                            <Icon type="font-awesome-5" name="power-off" size={22} color='#CCCCCC' />
                            <DrawerMenuText text='Déconnexion' textStyle={tw`text-red-600`} />
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    )
}

export default CustomSideMenu