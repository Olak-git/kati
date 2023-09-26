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

const _width = windowWidth/2 - 40;
const _height = 140;

const VideoItem = ({item, index, length, user}) => {
    const navigation = useNavigation();

    const img = item.img?{uri: baseSite+item.img}:require('../assets/images/kati_icone.png')

    const [isAbn, setIsAbn] = useState(false)
    
    const navigateToDataVideo = (item)=>{
        // console.log('Item: ', item)
        navigation.navigate('video', {videoId: item.videoId, videoSlug: item.videoSlug, resumer: item.resumer, img: item.img, video: item.video, likes: item.likes, dislikes: item.dislikes, user_img: item.user_img, channelName: item.channelName, channelId: item.channelId, nom: item.nom, vue: item.vue })
    }

    const getSubscribesToTheChannel = () => {
        var APIURL = baseUri + "subscribesToTheChannel.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            channelId: item.channelId,
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
            setIsAbn(json.abonne_chaine?true:false)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            
        })
    }

    useEffect(() => {
        // getSubscribesToTheChannel();
    }, [])

    return (
        <TouchableOpacity onPress={()=>navigateToDataVideo(item)} style={{flexDirection: 'row', marginBottom: 20, paddingBottom: 10, borderBottomWidth: index!=length?1:0, borderColor: '#f4f4f4'}}>
            <Image
                defaultSource={require('../assets/images/kati_icone.png')}
                source={img}
                style={{height: 100, width: 100, borderRadius: 20}}
                resizeMode='cover'
            />
            <View style={{flex: 1, borderWidth: 0, borderColor: 'red', paddingLeft: 10, position: 'relative'}}>
                <Text style={{color:'#FFF', fontWeight: '700', fontSize: 16}}>{item.nom}</Text>
                <Text style={{color:'#FFF', fontWeight: '100'}}>{item.user_nom+' '+item.user_prenom}</Text>

                <View style={{position: 'absolute', bottom: 2, left: 2, right: 2, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
                            <Icon type='ant-design' name='like1' color='#FFF' size={12} reverse reverseColor='#000' containerStyle={{margin:0}} />
                            <Text style={{color:'#FFF', fontSize: 12, fontWeight: '700', marginLeft: 5}}>{format_size(item.likes).padStart(3, '0')}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon type='ant-design' name='dislike1' color='#FFF' size={12} reverse reverseColor='#000' containerStyle={{margin:0}} />
                            <Text style={{color:'#FFF', fontSize: 12, fontWeight: '700', marginLeft: 5}}>{format_size(item.dislikes).padStart(3, '0')}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon type='font-awesome' name='eye' color='#FFF' size={15} />
                        <Text style={{color:'#FFF', fontSize: 12, fontWeight: '700', marginLeft: 5}}>{format_size(item.vue).padStart(3, '0')}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}


export default VideosByChannel = ({navigation, route}) => {

    const { channelId, channelName, user_img: channelImage } = route.params;

    const user = useSelector(state => state.user.data)

    const { width } = useWindowDimensions()
    
    const [refreshing, setRefreshing] = useState(false)
    const [videosChannel, setVideosChannel] = useState([]);
    const [loading, setLoading] = useState(true)

    const getVideosChannel = () => {
        var APIURL = baseUri + "getVideoByChannel.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            channelId: channelId,
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
            setVideosChannel(json)
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
            <VideoItem key={index.toString()} item={item} index={index} length={videosChannel.length-1} user={user} />
        )
    }

    const onRefresh = () => {
        setRefreshing(true)
    }

    useEffect(() => {
        if(refreshing) {
            getVideosChannel()
        }
    }, [refreshing])

    useEffect(() => {
        getVideosChannel();
    }, []) 

    return(
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack headerTitle={loading?channelName:undefined} />
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
                        contentContainerStyle={{paddingBottom: 10, position: 'relative', minHeight: videosChannel.length == 0 ? windowHeight - (DRAWER_HEADER_SHOWN?56:HEIGHT_HEADER) : undefined}}
                    >
                        <Image
                            source={{uri: channelImage}}
                            style={{height: 250, width: width}}
                            resizeMode='cover'
                        />
                        <Text style={{color: '#FFF', marginTop: -170, marginBottom: 60, textAlign: 'center', fontSize: 22, fontWeight: '700'}}>{channelName.toUpperCase()}</Text>
                        
                        {videosChannel.length == 0 ? (
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon type="entypo" name='folder-video' size={45} color='#FFF' />
                                <Text style={{color: '#FFF', fontSize: 16}}>Aucune vidéo disponible</Text>
                            </View>  
                        ) : (
                            <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                                {videosChannel.map(renderItem)}
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