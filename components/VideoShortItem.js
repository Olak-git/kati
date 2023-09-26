import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Modal, TextInput, Pressable, PixelRatio, FlatList, ActivityIndicator, Share, useWindowDimensions, Platform } from "react-native";
import Video from "react-native-video";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import {Icon} from "@rneui/base";
import { windowWidth, windowHeight } from "../services/ShortsData";
import { DRAWER_HEADER_SHOWN, HEIGHT_HEADER, baseSite, baseUri } from "../constants/Constants";
import { useRef } from "react";
import { ModalComments } from './ModalComments';
import moment from 'moment';

import SwipeUpDown from 'react-native-swipe-up-down';
import { useSelector } from "react-redux";
import { format_size } from "../services/helpersFunction";
import { app_color_main } from "../services/data";

// const timer = require('react-native-timer');

const Button = ({disabled=false, onPress=undefined, iconName, iconColor='#000', chaine=undefined}) => {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={styles.verticalBarItem} >
            {/* <IconFontAwesome name={iconName} size={30} color={iconColor} /> */}
            <Icon type='font-awesome' name={iconName} size={20} color={iconColor} reverse containerStyle={{marginVertical:0}} />
            {chaine!=undefined && (
                <Text style={styles.verticalBarText}>{format_size(chaine)}</Text>
            )}
        </TouchableOpacity>
    )
}

export default function VideoItem({ data, isActive, navigation }) {
    const user = useSelector(state => state.user.data)
    const ref = useRef(null)

    const [comments, setComments] = useState(0)
    const [lkLike, setLkLike] = useState(null)
    const [lkDislike, setLkDislike] = useState(null)
    const [likes, setLikes] = useState(data.likes)
    const [dislikes, setDislikes] = useState(data.dislikes)
    const [vues, setVues] = useState(data.vue)
    
    const [paused, setPaused] = useState(!isActive)
    const [visible, setVisible] = useState(false)

    const [view, setView] = useState(false)

    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        // ...or any prop you want
    });
    const [isPanelActive, setIsPanelActive] = useState(false);

    const openPanel = () => {
        setIsPanelActive(true);
    };

    const closePanel = () => {
        setIsPanelActive(false);
    };

    const onShowModal = () => {
        setPaused(true)
        setVisible(true)
    }

    const onCloseModal = () => {
        setPaused(false)
        setVisible(false)
    }

    const getComments = () => {
        var APIURL = baseUri + "countCommentsAndGetLikesDislikes.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            shortsId: data.shortsId,
            users_id: user.id,
            token: user.slug,
        };
        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then((json) => {
            console.log('videos: ', json)
            setComments(json.commentaires.nbr)
            setLkLike(json.likes.lk_likes||0)
            setLkDislike(json.likes.lk_dislikes||0)

            setLikes(json.likes.likes||0);
            setDislikes(json.likes.dislikes||0)
            setVues(json.likes.vue||0)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const onPaused = () =>{
        setPaused(!paused)
    }
    
    const likeVideoShorts = () => {
        var APIURL = baseUri + "likeVideoShorts.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            shortsId: data.shortsId,
            usersId: user.id,
            token: user.slug,
        };
        console.log('short_id: ', Data)
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

    const dislikeVideoShorts = () => {
        var APIURL = baseUri + "dislikeVideoShorts.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            shortsId: data.shortsId,
            usersId: user.id,
            token: user.slug,
        };
        console.log('short_id: ', Data)
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

    const onMarkedShortVideoAsView = () => {
        setView(true)
        var APIURL = baseUri + "markedShortAsView.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            shortsId: data.shortsId,
            usersId: user.id,
            token: user.slug,
        };
        console.log('short_id: ', Data)
        fetch(APIURL, {
            method: 'POST',
            // headers: headers,
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
                message:'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
                // message:'React Native | A framework for building native apps using React',
                url: 'https://utechaway.com'
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

    useEffect(() => {
        if(isActive) getComments()
        // if(isActive) console.log('Data: ', data)
        return () => {
            setPaused(true)
        }
    }, [isActive])

    useEffect(() => {
        setPaused(!isActive)
        console.log('isActive: ', isActive)
    }, [isActive])

    useEffect(() => {

    }, [paused])

    const {height} = useWindowDimensions()

    // Show component
    return (
        // <View style={{ flex: 1, borderWidth: 2, borderColor: 'red' }}>
        <>
        <ModalComments label='shorts' itemId={data.shortsId} itemName={data.nom} commentsUri='listComments.php' addCommentUri='addComments.php' visible={visible} hide={onCloseModal} refreshItemData={getComments} />

        <View 
            style={{
                width: windowWidth, 
                height: Platform.OS == 'android' ? windowHeight - (DRAWER_HEADER_SHOWN?56:HEIGHT_HEADER) : windowHeight - (DRAWER_HEADER_SHOWN?56:HEIGHT_HEADER) - 21 - (DRAWER_HEADER_SHOWN?48:HEIGHT_HEADER), 
                backgroundColor: '#000',
                borderWidth: 0,
                borderColor: 'red',
            }} 
        >
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex:3,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                onPress={onPaused}
            >
                {paused && (
                    <Icon type="font-awesome-5" name="play" size={50} color={app_color_main} reverse reverseColor="#FFF" />
                )}
            </TouchableOpacity>
            <Video
                ref={ref}
                source={{ uri: baseSite+data.video }}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}
                resizeMode="cover"
                paused={paused}
                onLoad={(dt)=>{
                    // console.log('Boff: ', dt)
                }}
                // textTracks={[{index:1, title: 'Yan', language: 'fr', type: 'text/vtt'}]}
                onProgress={times=>{
                    const {currentTime, playableDuration, seekableDuration} = times
                    // console.log('Time: ', times)
                    if(currentTime>=seekableDuration/3 && !view) {
                        console.log('Time => ', times)
                        onMarkedShortVideoAsView()
                    }
                }}
            />

            <View style={styles.bottomSection} >
                <View style={styles.bottomLeftsection} >
                    <Text style={styles.channelName}>{data.channelName}</Text>
                    <Text style={styles.caption}>{data.nom}</Text>
                </View>
                <View style={styles.bottomRightsection} >
                    <Image source={require('../assets/images/kati_icone.png')} style={styles.icone} />
                </View>
            </View>
            <View style={styles.verticalBar} >
                {/* <View style={[styles.verticalBarItem, styles.avatarContainer]} >
                    <Image style={styles.avatar} source={{ uri: data.img }} />

                    <View style={styles.followButton}>
                        <IconFontAwesome name="bell" size={20} color="red" />
                    </View>
                </View> */}

                <Button onPress={onShowModal} iconName='comments' chaine={comments} />
                <Button onPress={likeVideoShorts} iconName='thumbs-o-up' chaine={likes} iconColor={lkLike && lkLike == 1 ? app_color_main:"#000"} />
                <Button onPress={dislikeVideoShorts} iconName='thumbs-o-down' chaine={dislikes} iconColor={lkDislike && lkDislike == 1 ? app_color_main:"#000"} />
                <Button disabled iconName='eye' chaine={vues} />
                {/* <Button onPress={onShare} iconName='share-alt' /> */}

                {/* <View style={styles.verticalBarItem} >
                    <Icon name="eye" size={30} color="#FFFFFF" />
                    <Text style={styles.verticalBarText}>{likes}</Text>
                </View> */}
                {/* <View style={styles.verticalBarItem} >
                    <Icon name="whatsapp" size={30} color="#04c404" />
                </View> */}
            </View>

        </View>
        </>
        // </View>
    )
}
const styles = StyleSheet.create({
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        bottom: 1
    },

    verticalBarItem: {
        marginBottom: 24,
        alignItems: 'center'
    },
    verticalBar: {
        position: 'absolute',
        right: 15,
        bottom: 150,
        zIndex: 4

    },
    verticalBarText: {
        color: '#FFFFFF',
        marginTop: 4,
        // backgroundColor: '#000',
        // paddingVertical: 2,
        // paddingHorizontal: 10,
        // textAlign: 'center',
        // borderRadius: 10
    },
    icone: {
        marginBottom: 40,
        width: 40,
        height: 40,
        right: 8

    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        height: 100,
        width: '100%',
        paddingHorizontal: 8,
        paddingBottom: 16
    },
    bottomLeftsection: {
        flex: 4,
    },
    bottomRightsection: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    channelName: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    caption: {
        color: '#FFFFFF',
        marginVertical: 8
    }

})