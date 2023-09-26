import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, RefreshControl, TouchableOpacity, View, Image, Modal, useWindowDimensions, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DRAWER_HEADER_SHOWN, baseSite, baseUri, refresh_colors } from '../../constants/Constants'
import { app_color_main } from '../../services/data'
import HeaderCustom from '../../components/HeaderCustom'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from '@rneui/base'
import VideoItem from '../../components/VideoItem'

const ShortsList = ({navigation, route}) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data)
    const path = user.img ? { uri: baseSite + user.img } : require('../../assets/images/kati_icone.png')

    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [shorts, setShorts] = useState([])

    const getShorts = () => {
        var APIURL = baseUri + "getShortVideosListByUser.php";

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
            console.log('Response: ', json)
            setShorts([...json])
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
            <VideoItem key={index.toString()} item={item} index={index} length={shorts.length-1} user={user} disabled={true} />
        )
    }

    const onRefresh = () => {
        setRefreshing(true)
    }

    useEffect(() => {
        if(refreshing) {
            getShorts()
        }
    }, [refreshing])

    useEffect(()=>{
        getShorts()
        console.log('Shorts List');
    },[route])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <StatusBar backgroundColor={app_color_main} />

            <HeaderCustom goBack={Platform.OS=='android'} />
            
            <View colors={['#000', '#000', app_color_main]} style={{flex: 1}}>
            {loading
                ?
                    <ActivityIndicator size={30} style={{flex: 1}} color='#FFFFFF' />
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
                        contentContainerStyle={{paddingBottom: 10, position: 'relative', marginTop: shorts.length == 0?40:undefined}}
                    >
                        {shorts.length == 0 ? (
                            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                <Icon type="entypo" name='folder-video' size={45} color='#FFF' />
                                <Text style={{color: '#FFF', fontSize: 16}}>Aucune vidéo disponible</Text>
                            </View>  
                        ) : (
                            <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                                {shorts.map(renderItem)}
                            </View>
                        )}
                    </ScrollView>
            }
            </View>
        </SafeAreaView>
    )
}

export default ShortsList;

const styles = StyleSheet.create({})