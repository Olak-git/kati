import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewShort from '../screens/Shorts/NewShort';
import ShortsList from '../screens/Shorts/ShortsList';
import { IconBar, Labelbar } from '../components/CustomBottomTab';

const Tab = createBottomTabNavigator();

export const ShortBottomTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName='new_short_bt_tabs'
            screenOptions={{
                // tabBarButton: (props) => <TouchableOpacity {...props} style={{color: 'red'}} />
            }}
        >
            <Tab.Screen name="new_short_bt_tabs" component={NewShort} initialParams={{}} 
                options={{
                    tabBarIcon: (props) => {
                        return <IconBar {...props} iconName='add-to-list' />
                    },
                    tabBarLabel: (props) => <Labelbar {...props} labelName='Nouvel Short' />,
                }}
            />
            <Tab.Screen name="shorts_list_bt_tabs" component={ShortsList} initialParams={{}} 
                options={{
                    tabBarIcon: (props) => {
                        return <IconBar {...props} iconName='list' />
                    },
                    tabBarLabel: (props) => <Labelbar {...props} labelName='Shorts' />,
                }}
            />
        </Tab.Navigator>
    )
}
