import React from 'react'
import { Icon } from '@rneui/base';
import { View, Text } from 'react-native'
import { app_color_main } from '../services/data';

export const IconBar = ({focused, color, iconName, size}) => {
    return (
        <Icon 
            type='entypo' 
            name={iconName}
            color={focused?"#000000":color} 
            reverse={focused}
            reverseColor={focused?app_color_main:undefined} 
            containerStyle={{bottom:focused?13:undefined, borderWidth:1, borderColor:'#FFFFFF'}} 
        />
    )
}
export const Labelbar = ({focused, color, labelName}) => {
    return (
        <Text style={{color: focused?app_color_main:color, paddingBottom: 3}}>{labelName}</Text>
    )
}