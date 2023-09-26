import React, { useState, useEffect } from 'react'
import { Image, Text, View, Share, SafeAreaView, Modal, RefreshControl, ActivityIndicator, Pressable, FlatList, TextInput, StatusBar, StyleSheet, PixelRatio, useWindowDimensions } from 'react-native'
import Video from 'react-native-video';
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
import { useNavigation } from '@react-navigation/native';
import { windowHeight, windowWidth } from '../services/ShortsData';

const _width = windowWidth/2 - 40;
const _height = 140;

const VideoItem = ({item, user}) => {
    const navigation = useNavigation();

    const img = item.img?{uri: baseSite+item.img}:require('../assets/images/kati_icone.png')

    const { width } = useWindowDimensions()
    const _width = width/2 - 40;
    const _height = 140;

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
        getSubscribesToTheChannel();
    }, [])

    return (
        <TouchableOpacity onPress={()=>navigateToDataVideo(item)} style={[styles.contentContainerRender, {width: _width, height: _height}]}>
            <Image
                defaultSource={require('../assets/images/kati_icone.png')}
                source={img}
                style={[styles.renderImg]}
                resizeMode='cover'
            />
            {isAbn && (
                <View style={{position: 'absolute', top: -10, left: -8, transform: [{rotate: '-25deg'}]}}>
                    <Icon type='material-icon' name='notifications-active' color='#FFF' size={23} />
                </View>
            )}
            <View style={{position: 'absolute', top: 2, right: 2, flexDirection: 'row', alignItems: 'center'}}>
                <Icon type='font-awesome' name='eye' color='#FFF' size={15} />
                <Text style={{color:'#FFF', fontSize: 12, fontWeight: '700', marginLeft: 5}}>{format_size(item.vue).padStart(3, '0')}</Text>
            </View>
            <View style={{position: 'absolute', bottom: 2, left: 2, right: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon type='ant-design' name='like1' color='#FFF' size={12} reverse reverseColor='#000' containerStyle={{margin:0}} />
                    <Text style={{color:'#FFF', fontSize: 12, fontWeight: '700', marginLeft: 3}}>{format_size(item.likes).padStart(3, '0')}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color:'#FFF', fontSize: 12, fontWeight: '700', marginRight: 0}}>{format_size(item.dislikes).padStart(3, '0')}</Text>
                    <Icon type='ant-design' name='dislike1' color='#FFF' size={12} reverse reverseColor='#000' containerStyle={{margin:0}} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function VideosByCategorie({navigation, route}) {
    const { categorieId, intituler, image } = route.params;
    const { width } = useWindowDimensions()

    const user = useSelector(state => state.user.data)
    
    const [refreshing, setRefreshing] = useState(false)
    const [videosCategorie, setVideosCategorie] = useState([]);
    const [loading, setLoading] = useState(true)

    const getVideosCategorie = () => {
        var APIURL = baseUri + "getVideoByCategorie.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            categorieId: categorieId,
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
            setVideosCategorie([...json])
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
            getVideosCategorie()
        }
    }, [refreshing])

    useEffect(() => {
        getVideosCategorie();
    }, [categorieId])

    return(
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack headerTitle={loading?intituler:undefined} />
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
                        contentContainerStyle={{paddingBottom: 10, position: 'relative', minHeight: videosCategorie.length == 0 ? windowHeight - (DRAWER_HEADER_SHOWN?56:HEIGHT_HEADER) : undefined}}
                    >
                        <Image
                            source={{uri: image}}
                            style={{height: 250, width: width}}
                            resizeMode='cover'
                        />
                        <Text style={{color: '#FFF', marginTop: -170, marginBottom: 60, textAlign: 'center', fontSize: 22, fontWeight: '700'}}>{intituler.toUpperCase()}</Text>
                        
                        {videosCategorie.length == 0 ? (
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon type="entypo" name='folder-video' size={45} color='#FFF' />
                                <Text style={{color: '#FFF', fontSize: 16}}>Aucune vidéo disponible</Text>
                            </View>  
                        ) : (
                            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 0 }}>
                                {videosCategorie.map(renderItem)}
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
        // width: _width, 
        // height: _height, 
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