import React, { useState, useEffect } from 'react'
import { View, FlatList, SafeAreaView, StatusBar } from 'react-native'

import { dataShorts, windowHeight } from '../services/ShortsData'
import VideoItem from '../components/VideoShortItem'
import { DRAWER_HEADER_SHOWN, HEIGHT_HEADER, baseUri } from "../constants/Constants";
import HeaderCustom from '../components/HeaderCustom';
import { app_color_main } from '../services/data';
import { useSelector } from 'react-redux';

export default function Shorts({navigation}) {
    const user = useSelector(state => state.user.data)
    const [activeVideoIndex, setActiveVideoIndex] = useState(0)
    const [video, setVideo] = useState([]);

    const getVideoShorts = () => {
        var APIURL = baseUri + "videoShorts.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const Data = {
            usersId: user.id,
            token: user.slug,
        }
        fetch(APIURL, {
            method: 'POST',
            body: JSON.stringify(Data),
            headers: headers,
        })
        .then((Response) => Response.json())
        .then((json) => {
            console.log('shorts: ', json)
            setVideo(json)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    useEffect(() => {
        getVideoShorts()
        return () => {
            setActiveVideoIndex(-1)
        }
    }, [])

    return(
        <SafeAreaView style={{flex:1, backgroundColor: '#000'}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom />
            )}
            <View style={{flex:1}}>
                <FlatList
                    data={video}
                    pagingEnabled
                    renderItem={({ item, index }) => (
                        <VideoItem key={index.toString()} data={item} isActive={activeVideoIndex === index} navigation={navigation} />
                    )}
                    onScroll={e => {
                        const index = Math.round(
                            e.nativeEvent.contentOffset.y / (windowHeight),
                        );
                        console.log('Index: ', index)
                        setActiveVideoIndex(index);
                    }}
                />
            </View>
        </SafeAreaView>
    )
}