import React, { useState, useEffect } from 'react'
import { Image, Text, View, Share, SafeAreaView, Modal, RefreshControl, ActivityIndicator, Pressable, FlatList, TextInput, StatusBar, StyleSheet, PixelRatio } from 'react-native'
import Video from 'react-native-video';
import { DRAWER_HEADER_SHOWN, HEIGHT_HEADER, refresh_colors, baseShared, baseSite } from '../constants/Constants';
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { downloadFile } from '../constants/Functions';
import { format_size } from '../services/helpersFunction';
import { baseUri } from "../constants/Constants";
import { app_color_main } from '../services/data';
import { useSelector } from 'react-redux';
import HeaderCustom from '../components/HeaderCustom';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { windowHeight, windowWidth } from '../services/ShortsData';

const _width = windowWidth/2 - 40;
const _height = 140;

const VideoItem = ({item, user}) => {
    const navigation = useNavigation();

    const img = item.user_img?{uri: item.user_img}:require('../assets/images/kati_icone.png')
    
    const navigateTo = ()=>{
        // console.log('Item: ', item)
        navigation.navigate('videos_by_channel', {...item})
    }

    return (
        <TouchableOpacity onPress={navigateTo} style={[styles.contentContainerRender]}>
            <Image
                defaultSource={require('../assets/images/kati_icone.png')}
                source={img}
                style={[styles.renderImg]}
                resizeMode='cover'
            />
            <View style={{position: 'absolute', width: '100%', bottom: 5, left: 0}}>
                <Text style={{color:'#FFF', fontWeight: '700', fontSize: 12, paddingHorizontal: 5, textAlign: 'center'}} numberOfLines={1}>{item.channelName}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default function AllChannels({navigation, route}) {

    const user = useSelector(state => state.user.data)
    const TITLE = 'CHAINE'

    const [refreshing, setRefreshing] = useState(false)
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true)

    const getChannels = () => {
        var APIURL = baseUri + "getAllChannels.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
        };

        // console.log('Data => ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((json) => {
            // console.log('Response: ', json)
            setChannels([...json])
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
            setRefreshing(false)
        })
    }

    const renderItem = (item, index) => {
        return (
            <VideoItem key={index.toString()} item={item} user={user} />
        )
    }

    const onRefresh = () => {
        setRefreshing(true)
    }

    useEffect(() => {
        if(refreshing) {
            getChannels()
        }
    }, [refreshing])

    useEffect(() => {
        getChannels();
    }, [])

    return(
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack />
            )}
            <LinearGradient colors={['#000', '#000', app_color_main]} style={{flex: 1}}>
            {loading
                ?
                    <ActivityIndicator size={30} style={{flex: 1}} />
                :
                    <ScrollView 
                        refreshControl={
                            <RefreshControl
                                colors={refresh_colors}
                                tintColor='#fff'
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                progressBackgroundColor='#ffffff'
                            />
                        }
                        contentContainerStyle={{paddingBottom: 10, position: 'relative', minHeight: channels.length == 0 ? windowHeight - (DRAWER_HEADER_SHOWN?56:HEIGHT_HEADER) : undefined}}
                    >
                        <Image
                            source={require('../assets/images/kati_icone.png')}
                            style={{height: 250, width: windowWidth}}
                            resizeMode='cover'
                        />
                        <Text style={{color: '#FFF', marginTop: -170, marginBottom: 60, textAlign: 'center', fontSize: 22, fontWeight: '700'}}>{TITLE}</Text>
                        
                        {channels.length == 0 ? (
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon type="entypo" name='folder-video' size={45} color='#FFF' />
                                <Text style={{color: '#FFF', fontSize: 16}}>Aucune chaîne disponible</Text>
                            </View>  
                        ) : (
                            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 0 }}>
                                {channels.map(renderItem)}
                            </View>
                        )}
                    </ScrollView>
            }
            </LinearGradient>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    contentContainerRender: {
        width: _width, 
        height: _height, 
        marginBottom: 20,
        borderRadius: 20, 
        borderWidth: 0, 
        borderColor: 'gray',
        borderColor: app_color_main,
        borderWidth: 2
    },
    renderImg: {
        width: '100%', height: '100%', borderRadius: 20,
        backgroundColor: 'black'
    }
});