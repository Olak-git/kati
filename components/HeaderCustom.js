import { View, Text, useWindowDimensions, Pressable } from 'react-native'
import React from 'react'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HEIGHT_HEADER } from '../constants/Constants';
import { app_color_main } from '../services/data';
import { Icon } from '@rneui/base';

export default HeaderCustom = ({ goBack=false, containerStyle={}, iconColor='#FFF', headerTitle=undefined, iconName=undefined }) => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const Drawer = createDrawerNavigator();
    const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());
    const closeDrawer = () => navigation.dispatch(DrawerActions.closeDrawer());

    return (
        <View style={[{
            width: width,
            height: HEIGHT_HEADER,
            backgroundColor: '#000',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10
        }, containerStyle]}>
            {goBack
                ?
                    <Pressable onPress={()=>navigation.goBack()}>
                        <Icon type='material-icon' name={iconName||'arrow-back'} size={30} color={iconColor} />
                    </Pressable>
                :
                    <Pressable onPress={openDrawer}>
                        <Icon type='octicon' name='three-bars' color={iconColor} />
                    </Pressable>
            }
            {headerTitle && (
                <Text style={{color: '#FFF', fontSize: 16}}>{headerTitle}</Text>
            )}
        </View>
    )
}