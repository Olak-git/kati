import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewVideo from '../screens/Videos/NewVideo';
import VideosList from '../screens/Videos/VideosList';
import { IconBar, Labelbar } from '../components/CustomBottomTab';

const Tab = createBottomTabNavigator();

export const VideoBottomTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName='new_short_bt_tabs'
        >
            <Tab.Screen name="new_video_bt_tabs" component={NewVideo} initialParams={{}} 
                options={{
                    tabBarIcon: (props) => {
                        return <IconBar {...props} iconName='add-to-list' />
                    },
                    tabBarLabel: (props) => <Labelbar {...props} labelName='Nouvel Video' />,
                }}
            />
            <Tab.Screen name="videos_list_bt_tabs" component={VideosList} initialParams={{}} 
                options={{
                    tabBarIcon: (props) => {
                        return <IconBar {...props} iconName='list' />
                    },
                    tabBarLabel: (props) => <Labelbar {...props} labelName='Videos' />,
                }}
            />
        </Tab.Navigator>
    )
}
