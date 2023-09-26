import React, { useState, useEffect } from 'react'
import { Image, Text, View, Share, SafeAreaView, Modal, ActivityIndicator, Pressable, FlatList, TextInput, StatusBar, Platform } from 'react-native'
import Video from 'react-native-video';
import { DRAWER_HEADER_SHOWN, baseShared, baseSite } from '../constants/Constants';
import { Icon } from '@rneui/base';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';
import { downloadFile } from '../constants/Functions';
import { format_size } from '../services/helpersFunction';
import { baseUri } from "../constants/Constants";
import { app_color_main } from '../services/data';
import { useSelector } from 'react-redux';
import HeaderCustom from '../components/HeaderCustom';
import { ModalComments } from '../components/ModalComments';

const Button = ({disabled=false, onHandlePress=undefined, iconType, iconName, iconColor=undefined, tag}) => {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: '#e4e4e4',
                borderRadius: 10,
                minWidth: 80,
                paddingHorizontal: 4,
                paddingVertical: 2,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10
            }}
            disabled={disabled}
            onPress={onHandlePress}
        >
            <Icon type={iconType} name={iconName} color={iconColor} />
            <Text style={{color:'#000', fontSize: 18}}> {tag} </Text>
        </TouchableOpacity>
    )
}

export default function VideoDetail({navigation, route}) {
    const { resumer, img, videoId, videoSlug, video, user_img, channelName, channelId, nom, vue: _vue, likes: _likes, dislikes: _dislikes } = route.params;

    const user = useSelector(state => state.user.data)
    
    const [likes, setLikes] = useState(_likes)
    const [dislikes, setDislikes] = useState(_dislikes)
    const [vue, setVue] = useState(_vue)
    const [comment, setComment] = useState(0);
    const [view, setView] = useState(false)
    const [isLike, setIsLike] = useState(null)
    const [isDislike, setIsDislike] = useState(null)
    const [isAbn, setIsAbn] = useState(false)

    const [visible, setVisible] = useState(false)
    const [paused, setPaused] = useState(true)

    const [begin, setBegin] = useState(false)

    const [activityView, setActivityView] = useState(true)

    const [loading, setLoading] = useState(true)

    const video_height = 350

    const [recommandationVideos, setRecommandationVideos] = useState([]);
    const [videosChannel, setVideosChannel] = useState([]);
    const [loadRecommandationVideos, setLoadRecommandationVideos] = useState(true)
    const [loadVideosChannel, setLoadVideosChannel] = useState(true)

    const onShowModal = () => {
        setPaused(true)
        setVisible(true)
    }
    const onCloseModal = () => {
        setPaused(false)
        setVisible(false)
    }

    const getRecommandationVideos = () => {
        var APIURL = baseUri + "getRecommandation.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            videoId: videoId,
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
            console.log('Response: ', json)
            // setComment(json.nbr)
            setRecommandationVideos(json)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            // setActivityView(false)
        })
    }

    const getVideosChannel = () => {
        var APIURL = baseUri + "getVideoByChannel.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            videoId: videoId,
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
            console.log('Response: ', json)
            // setComment(json.nbr)
            setVideosChannel(json)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            // setActivityView(false)
        })
    }

    const getComments = () => {
        var APIURL = baseUri + "countVideoComments.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            videoId: videoId,
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
            console.log('Response: ', json)
            // setComment(json.nbr)
            setComment(json.commentaires.nbr)
            setIsLike(json.likes.lk_likes==1)
            setIsDislike(json.likes.lk_dislikes==1)

            setIsAbn(json.abonne_chaine?true:false)

            setLikes(json.likes.likes||0);
            setDislikes(json.likes.dislikes||0)
            setVue(json.likes.vue||0)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            if(loading) {
                setLoading(false)
            }
            setActivityView(false)
        })
    }

    const likeVideo = () => {
        var APIURL = baseUri + "likeVideo.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            videoId: videoId,
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)
        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((json) => {
            console.log(json)
            getComments();
            // console.log('videos: ', json)
            //setComments(json.nbr)
        })
        .catch((error) => {
            console.log('errors: ', error)
        })
    }

    const dislikeVideo = () => {
        var APIURL = baseUri + "dislikeVideo.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            videoId: videoId,
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)
        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((json) => {
            getComments();
            // console.log(json)
            // console.log('videos: ', json)
            //setComments(json.nbr)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onHandleAbnChannel = () => {
        setActivityView(true)

        var APIURL = baseUri + `${isAbn?'delAbnChannel.php':'abnChannel.php'}`;

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            channelId: channelId,
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)
        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((json) => {
            console.log(json)
            getComments();
        })
        .catch((error) => {
            console.log('errors: ', error)
        })
    }

    const onMarkedVideoAsView = () => {
        setView(true)
        var APIURL = baseUri + "markedVideoAsView.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            videoId: videoId,
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((json) => {
            getComments();
            console.log(json)
            // console.log('videos: ', json)
            //setComments(json.nbr)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `(${nom})\n${baseShared + videoSlug}`,
                // url: 'https://utechaway.com'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };
    
    const getDataVideo = (item)=>{
        console.log('Item: ', item)
        navigation.navigate('video', {videoId: item.videoId, videoSlug: item.videoSlug, resumer: item.resumer, img: item.img, video: item.video, likes: item.likes, dislikes: item.dislikes, user_img: item.user_img, channelName: item.channelName, channelId: item.channelId, nom: item.nom, vue: item.vue })
    }

    const recommandationVideoRender = ({item, index}) => <TouchableOpacity onPress={()=>getDataVideo(item)} style={{}}>
        <Image 
            defaultSource={require('../assets/images/kati_icone.png')}
            source={{uri: baseSite+item.img}}
            style={{width: 250, height: 180, borderRadius: 20}}
            resizeMode='cover'
        />
    </TouchableOpacity>

    const videoChannelRender = ({item, index}) => <TouchableOpacity onPress={()=>getDataVideo(item)} style={{}}>
        <Image 
            defaultSource={require('../assets/images/kati_icone.png')}
            source={{uri: baseSite+item.img}}
            style={{width: 160, height: 200, borderRadius: 20}}
            resizeMode='cover'
        />
    </TouchableOpacity>

    useEffect(() => {
        getComments();
        getRecommandationVideos();
        getVideosChannel();
    }, [videoId])

    return(
        <SafeAreaView style={{backgroundColor: '#FFF', flex:1}}>
            <StatusBar backgroundColor={app_color_main} />
            <ModalComments label='videoId' itemId={videoId} itemName={nom} commentsUri='listVideoComments.php' addCommentUri='addVideoComments.php' visible={visible} hide={onCloseModal} refreshItemData={getComments} />

            <Pressable onPress={()=>navigation.goBack()} style={{position: 'absolute', top: Platform.OS == 'android' ? 3 : 50, left: 2, zIndex: 1}}>
                <Icon type='material-icon' name='arrow-back' size={20} color={app_color_main} reverse />
            </Pressable>
            
            {begin && (
                <Video
                    source={{ uri: baseSite + video }}
                    style={{
                        width: '100%',
                        height: video_height,
                        // position: 'absolute',
                        // top: 0,
                        // left: 0,
                        // zIndex: 1
                    }}
                    poster={baseSite + img}
                    posterResizeMode='cover'
                    controls={true}
                    resizeMode="cover"
                    paused={paused}
                    onProgress={times => {
                        const { currentTime, playableDuration, seekableDuration } = times
                        // console.log('Time: ', times)
                        if (currentTime >= seekableDuration / 3 && !view) {
                            console.log('Time => ', times)
                            onMarkedVideoAsView()
                        }
                    }}
                />
            )}

            {/* {begin
                ?
                <Video
                    source={{ uri: baseSite + video }}
                    style={{
                        width: '100%',
                        height: video_height,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                    poster={baseSite + img}
                    posterResizeMode='cover'
                    controls={true}
                    resizeMode="cover"
                    paused={paused}
                    onProgress={times => {
                        const { currentTime, playableDuration, seekableDuration } = times
                        // console.log('Time: ', times)
                        if (currentTime >= seekableDuration / 3 && !view) {
                            console.log('Time => ', times)
                            onMarkedVideoAsView()
                        }
                    }}
                />
                :
                <View style={{ marginBottom: 20 }}>
                    <Image source={{ uri: baseSite + img }} style={{ height: video_height, marginHorizontal: 0, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }} resizeMode='cover' />
                    <View style={{ position: 'absolute', bottom: -35, alignItems: 'center', width: '100%' }}>
                        <Icon
                            type='font-awesome-5'
                            name='play'
                            reverse
                            color={app_color_main}
                            size={40}
                            onPress={() => {
                                setBegin(true)
                                setPaused(false)
                            }}
                        />
                    </View>
                </View>
            } */}

            <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={{paddingBottom: 10}}>
                <View>
                    {!begin && (
                        <View style={{marginBottom: 20}}>
                            <Image source={{uri: baseSite+img}} style={{height: video_height, marginHorizontal:0, borderBottomLeftRadius: 50, borderBottomRightRadius: 50}} resizeMode='cover' />
                            <View style={{position:'absolute', bottom:-35, alignItems: 'center', width: '100%'}}>
                                <Icon 
                                    type='font-awesome-5' 
                                    name='play' 
                                    reverse 
                                    color={app_color_main} 
                                    size={40} 
                                    onPress={()=>{
                                        setBegin(true)
                                        setPaused(false)
                                    }} 
                                />
                            </View>
                        </View>
                    )}
                    <View
                        style={{
                            paddingTop: 5,
                            paddingHorizontal: 10,
                            // marginTop: begin?video_height:0
                        }}
                    >
                        <View style={{ }}>
                            <Text
                                style={{
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                }}
                            >
                                {nom}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderWidth: 0,
                                borderColor: 'red'
                            }}
                        >
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flex: 1,
                                borderWidth: 0,
                                borderColor: 'red'
                            }}>
                                <Image
                                    source={{ uri: baseSite+user_img }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 25,
                                    }}
                                />
                                <Text style={{
                                    paddingTop: 5,
                                    fontSize: 12,
                                    color: '#000',
                                    fontWeight: 'bold',
                                    paddingLeft: 5
                                }} >
                                    {channelName}
                                </Text>
                                {loading
                                    ? <ActivityIndicator color={app_color_main} style={{marginLeft: 30}} />
                                    : <>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#340444',
                                                borderRadius: 10,
                                                minWidth: 80,
                                                paddingVertical: 2,
                                                marginRight: 10,
                                                marginLeft: 30,
                                                paddingHorizontal: 5,
                                            }}
                                            onPress={onHandleAbnChannel}
                                        >
                                            <Text style= {{color: '#FFFFFF', textAlign: 'center'}} >{isAbn?"Se désabonner":"S'abonner"} </Text>
                                        </TouchableOpacity>
                                        {activityView && (<ActivityIndicator color={app_color_main} />)}
                                    </>
                                }
                            </View>
                            <TouchableOpacity onPress={onShare} style={{paddingHorizontal: 5}}>
                                <Icon type='ant-design' name='sharealt'></Icon>
                            </TouchableOpacity>

                        </View>

                        <ScrollView
                            style={{ marginTop: 10 }}
                            // contentStyle={{ minWidth: '100%' }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            <Button iconType='ant-design' iconName='like1' iconColor={isLike?app_color_main:undefined} tag={format_size(likes)} onHandlePress={likeVideo} />
                            <Button iconType='ant-design' iconName='dislike1' iconColor={isDislike?app_color_main:undefined} tag={format_size(dislikes)} onHandlePress={dislikeVideo} />
                            <Button iconType='font-awesome' iconName='eye' disabled tag={format_size(vue)} />
                            <Button iconType='material-community-icons' iconName='comment' onHandlePress={onShowModal} tag={format_size(comment)} />
                            <Button iconType='font-awesome' iconName='download' tag='Téléchagez' onHandlePress={()=>downloadFile(baseSite+video)} />
                        </ScrollView>

                    </View>

                </View>
                
                <View style={{marginTop: 30, paddingHorizontal: 10}}>
                    <Text style={{color: '#000', fontWeight: '500'}}>Nos Recommandations</Text>
                    <FlatList
                        horizontal
                        ListEmptyComponent={
                            !loadRecommandationVideos
                            ?
                            <ActivityIndicator color={app_color_main} size={30} />
                            :
                            <Text style={{color: 'gray', fontWeight: '100'}}>Aucune vidéo disponible</Text>
                        }
                        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                        renderItem={recommandationVideoRender}
                        data={recommandationVideos}
                        contentContainerStyle={{marginTop: 10}}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={{marginTop: 20, paddingHorizontal: 10}}>
                    <Text style={{color: '#000', fontWeight: '500'}}>Autres vidéos de la chaîne</Text>
                    <FlatList
                        horizontal
                        ListEmptyComponent={
                            loadVideosChannel
                            ?
                            <ActivityIndicator color={app_color_main} size={30} />
                            :
                            <Text style={{color: 'gray', fontWeight: '100'}}>Aucune vidéo disponible</Text>
                        }
                        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                        renderItem={videoChannelRender}
                        data={videosChannel}
                        contentContainerStyle={{marginTop: 10}}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

            </ScrollView>
            </View>
        </SafeAreaView>
    )
}