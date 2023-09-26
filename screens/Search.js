import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, ScrollView, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native'

import { dataShorts, windowHeight } from '../services/ShortsData'
import VideoItem from '../components/VideoShortItem'
import { DRAWER_HEADER_SHOWN, HEIGHT_HEADER, baseSite, baseUri } from "../constants/Constants";
import HeaderCustom from '../components/HeaderCustom';
import { app_color_main } from '../services/data';
import { useSelector } from 'react-redux';
import { Icon } from '@rneui/base';
import SearchBar from '../components/SearchBar';

const _width = 115;
const _height = 150;

export default function Search({navigation}) {
    const user = useSelector(state => state.user.data)

    const [loading, setLoading] = useState(true)
    const [filterLoading, setFilterLoading] = useState(false)
    const [videos, setVideos] = useState([]);
    const [master, setMaster] = useState([]);
    const [emptyText, setEmptyText] = useState('Aucun résultat disponible.')
    const [searchText, setSearchText] = useState('')

    const getVideos = () => {
        var APIURL = baseUri + "getAllVideos.php";

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
            console.log('Videos: ', json)
            setVideos([...json])
            setMaster([...json])
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const filter = (text) => {
        // Check if searched text is not blank
        if (text) {
            setFilterLoading(true)
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData= master.filter(function (item) {
                // Applying filter for the inserted text in search bar
                // @ts-ignore
                const ctext = `${item.nom} ${item.user_nom}`;
                const itemData = ctext.trim()
                                ? ctext.toUpperCase()
                                : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setEmptyText('Aucun résultat trouvé');
            setVideos([...newData]);
            setSearchText(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setEmptyText('Aucune résultat disponible.');
            setVideos([...master]);
            setSearchText('');
            setFilterLoading(false);
        }
    }

    const navigateToDataVideo = (item)=>{
        console.log('Item: ', item)
        navigation.navigate('video', {videoId: item.videoId, videoSlug: item.videoSlug, resumer: item.resumer, img: item.img, video: item.video, likes: item.likes, dislikes: item.dislikes, user_img: item.user_img, channelName: item.channelName, channelId: item.channelId, nom: item.nom, vue: item.vue })
    }

    const renderItem = (item, index) => {
        const img = item.user_img?{uri: baseSite+item.img}:require('../assets/images/kati_icone.png')
        return (
            <TouchableOpacity key={index.toString()} onPress={()=>navigateToDataVideo(item)} style={[styles.contentContainerRender]}>
                <Image
                    defaultSource={require('../assets/images/kati_icone.png')}
                    source={img}
                    style={[styles.renderImg]}
                    resizeMode='cover'
                />
                <Text style={{color: '#FFF', marginTop: 5}} numberOfLines={2}>{item.nom}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon type='ionicon' name='checkmark-done' size={16} color='grey' />
                    <Text style={{color: 'grey', fontSize: 12, marginLeft: 3}} numberOfLines={1}>{item.user_nom}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    
    useEffect(() => {
        console.log('Yakou')
        getVideos()
    }, [])

    return(
        <SafeAreaView style={{flex:1, backgroundColor: '#000'}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack />
            )}
            <SearchBar 
                iconSearchColor='grey'
                iconSearchSize={20}
                loadingColor='grey'
                containerStyle={{height: 50, marginBottom: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 0, backgroundColor: 'rgb(229, 231, 235)'}}
                inputContainerStyle={{borderBottomWidth: 0}}
                placeholder='Rechercher'
                value={searchText}
                showLoading={filterLoading}
                onChangeText={filter}
                onEndEditing={() => setFilterLoading(false)}
            />

            <View style={{flex:1}}>
                {loading
                    ?   <ActivityIndicator size={30} style={{flex: 1}} />
                    :   videos.length > 0
                        ?   <ScrollView snapToAlignment='center' contentContainerStyle={{paddingTop: 20}}>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                                    {videos.map(renderItem)}
                                </View>
                            </ScrollView>
                        :   <Text style={{color: 'gray'}}>{ emptyText }</Text>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    contentContainerRender: {
        width: _width, 
        // height: _height, 
        borderRadius: 20, 
        borderWidth: 0, 
        borderColor: 'gray',
        marginBottom: 20,
        marginHorizontal: 4
    },
    renderImg: {
        width: _width, 
        height: _height, 
        borderRadius: 20
    },
});