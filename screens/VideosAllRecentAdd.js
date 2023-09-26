import React, { useState, useEffect } from 'react'
import { Image, Text, View, Share, SafeAreaView, Modal, RefreshControl, StyleSheet, ActivityIndicator, Pressable, FlatList, TextInput, StatusBar, useWindowDimensions } from 'react-native'
import { DRAWER_HEADER_SHOWN, HEIGHT_HEADER, baseShared, baseSite, refresh_colors } from '../constants/Constants';
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
import { windowHeight, windowWidth } from '../services/ShortsData';
import { useNavigation } from '@react-navigation/native';
import VideoItem from '../components/VideoItem';

const _width = windowWidth/2 - 40;
const _height = 140;

export default VideosAllRecentAdd = ({navigation, route}) => {

    const user = useSelector(state => state.user.data)

    const { width } = useWindowDimensions()

    const TITLE = 'Vidéos récemment ajoutés'
    
    const [refreshing, setRefreshing] = useState(false)
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true)

    const getVideos = () => {
        var APIURL = baseUri + "AllRecemmentAjouter.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
        };

        console.log('Data => ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((json) => {
            // console.log('Response: ', json)
            setVideos(json)
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
            <VideoItem key={index.toString()} item={item} index={index} length={videos.length-1} user={user} />
        )
    }

    const onRefresh = () => {
        setRefreshing(true)
    }

    useEffect(() => {
        if(refreshing) {
            getVideos()
        }
    }, [refreshing])

    useEffect(() => {
        getVideos();
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
                        contentContainerStyle={{paddingBottom: 10, position: 'relative', minHeight: videos.length == 0 ? windowHeight - (DRAWER_HEADER_SHOWN?56:HEIGHT_HEADER) : undefined}}
                    >
                        <Image
                            source={require('../assets/images/kati_icone.png')}
                            style={{height: 250, width: width}}
                            resizeMode='cover'
                        />
                        <Text style={{color: '#FFF', marginTop: -170, marginBottom: 60, textAlign: 'center', fontSize: 22, fontWeight: '700'}}>{TITLE}</Text>
                        
                        {videos.length == 0 ? (
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon type="entypo" name='folder-video' size={45} color='#FFF' />
                                <Text style={{color: '#FFF', fontSize: 16}}>Aucune vidéo disponible</Text>
                            </View>  
                        ) : (
                            <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                                {videos.map(renderItem)}
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
        width: '100%', height: '100%', borderRadius: 20
    }
});