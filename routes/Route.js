import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Shorts from '../screens/Shorts';
import Login from '../screens/Login';
import Welcome from '../screens/Welcome';
import Accueil from '../screens/Accueil';

import VideoDetail from '../screens/Video';
import { Drawer } from './Drawer';
import { useDispatch, useSelector } from 'react-redux';
import Comments from '../screens/Comments';
import VideosByCategorie from '../screens/VideosByCategorie';
import { app_color_main } from '../services/data';
import VideosByChannel from '../screens/VideosByChannel';
import VideosAllRecentAdd from '../screens/VideosAllRecentAdd';
import AllChannels from '../screens/AllChannels';
import EditProfile from '../screens/EditProfile';
import EditPassword from '../screens/EditPassword';
import Register from '../screens/Register';
import ResetPass from '../screens/ResetPass';
import Search from '../screens/Search';
import { ShortBottomTabs } from './ShortBottomTabs';
import { VideoBottomTabs } from './VideoBottomTabs';

// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

export default function Route() {
    const user = useSelector(state => state.user.data)

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={Object.keys(user).length==0?'welcome':'drawer'}
                screenOptions={{
                    header: () => null
                }}
            >
                {/* <Stack.Screen name="bottom" component={Bottom} />
                <Stack.Screen name="drawer" component={MyDrawer} /> */}

                {Object.keys(user).length == 0
                ?
                    <Stack.Group>
                        <Stack.Screen name="welcome" component={Welcome} />
                        <Stack.Screen name="login" component={Login} />
                        <Stack.Screen name="register" component={Register} />
                        <Stack.Screen name="reset_pass" component={ResetPass} 
                            options={{
                                animation:'fade_from_bottom'
                            }}
                        />
                    </Stack.Group>
                :
                    <Stack.Group>
                        <Stack.Screen name="drawer" component={Drawer} />
                        <Stack.Screen name="short_tabs" component={ShortBottomTabs} />
                        <Stack.Screen name="video_tabs" component={VideoBottomTabs} />

                        <Stack.Screen name="accueil" component={Accueil} />
                        <Stack.Screen name="video" component={VideoDetail} />
                        <Stack.Screen name="short" component={Shorts} />
                        <Stack.Screen name="Comments" component={Comments} />

                        <Stack.Screen name="videos_by_categorie" component={VideosByCategorie} />
                        <Stack.Screen name="videos_by_channel" component={VideosByChannel} />
                        <Stack.Screen name="all_channel" component={AllChannels} />
                        <Stack.Screen name="videos_all_recent_add" component={VideosAllRecentAdd} />
                        <Stack.Screen name="videos_search" component={Search} />

                        <Stack.Screen name="edit_profile" component={EditProfile}
                            options={{
                                animation:'slide_from_right'
                            }}
                        />
                        <Stack.Screen name="edit_password" component={EditPassword}
                            options={{
                                animation:'slide_from_right'
                            }}
                        />
                    </Stack.Group>
                }

            </Stack.Navigator>
        </NavigationContainer>
    );
}