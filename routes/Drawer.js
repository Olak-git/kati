import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useEffect } from "react";
import { Text } from 'react-native';
import { useSelector } from "react-redux";
import Accueil from "../screens/Accueil";
import Shorts from "../screens/Shorts";
import { DrawerActions } from '@react-navigation/native';
import CustomSideMenu from "../components/CustomSideMenu";
import { DRAWER_HEADER_SHOWN } from "../constants/Constants";
import Profile from "../screens/Profile";
import RseHearter from "../screens/RseHearter";
import SdkLive from "../screens/SdkLive/SdkLive";
import Live from "../screens/Live/Live";
import { ShortBottomTabs } from "./ShortBottomTabs";
import { VideoBottomTabs } from "./VideoBottomTabs";

export const Drawer = ({ navigation }) => {
    const Drawer = createDrawerNavigator();

    const user = useSelector((state) => state.user.data);
    const src = user.img ? { uri: user.img } : { uri: 'https://i.pravatar.cc/150?img=45'} ;

    const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());
    const closeDrawer = () => navigation.dispatch(DrawerActions.closeDrawer());

    useEffect(()=>{
        console.log('[user] => ', user)
    }, [user])

    return (
        <Drawer.Navigator initialRouteName='accueil_dr'
            drawerContent={(props) => <CustomSideMenu {...props} navigation={navigation} />}
            screenOptions={{
                drawerType: 'front',
                // headerTintColor: 'red',
                headerShown: DRAWER_HEADER_SHOWN,
                headerTitle: '',
            }}
        >
            <Drawer.Screen name='accueil_dr' component={Accueil} options={{
                drawerActiveBackgroundColor: '#fff',
            }} />
            <Drawer.Screen name='shorts_dr' component={Shorts} options={{
                drawerLabel: 'Videos',
                drawerActiveBackgroundColor: '#fff',
            }} />
            <Drawer.Screen name='profile_dr' component={Profile} options={{
                drawerLabel: 'Profile',
                drawerActiveBackgroundColor: '#fff',
            }} />
            <Drawer.Screen name='live_dr' component={Live} options={{
                drawerLabel: 'Live',
                drawerActiveBackgroundColor: '#fff',
            }} />
            <Drawer.Screen name='new_short_dr' component={ShortBottomTabs} options={{
                drawerLabel: 'Live',
                drawerActiveBackgroundColor: '#fff',
            }} />
            <Drawer.Screen name='new_video_dr' component={VideoBottomTabs} options={{
                drawerLabel: 'Live',
                drawerActiveBackgroundColor: '#fff',
            }} />
            <Drawer.Screen name='rse_hearter_dr' component={RseHearter} options={{
                drawerLabel: 'Rse Heater',
                drawerActiveBackgroundColor: '#fff',
            }} />
        </Drawer.Navigator>
    )
}