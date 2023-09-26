import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Swiper from 'react-native-swiper';
import { baseSite, baseUri } from '../constants/Constants';

export default function Comments({ navigation }) {

    const [video, setVideo] = useState([]);

    const getVideoRecemmentAjoutes = () => {
        var APIURL = baseUri + "video.php";

        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        fetch(APIURL, {
            method: 'POST',
            headers: headers,
        })
            .then((Response) => Response.json())
            .then((json) => {
                // console.log('videos: ', json)
                setVideo(json)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const getDataRecemmentAjoutes = (item) => {
        // console.log(item)
        navigation.navigate('video', { videoId: item.videoId, resumer: item.resumer, img: item.img, video: item.video, likes: item.likes, dislikes: item.dislikes, user_img: item.user_img, channelName: item.channelName, nom: item.nom, vue: item.vue })
    }
    const _renderItem = (item) => {
        return (
            <TouchableOpacity
                onPress={() => getDataRecemmentAjoutes(item)}
            >
                <Image
                    style={{
                        width: 150,
                        height: 200,
                        borderRadius: 15
                    }}
                    source={{ uri: baseSite + item.img }}
                />
            </TouchableOpacity>

        )
    }
    const { widths } = Dimensions.get('window')

    useEffect(
        () => {
            getVideoRecemmentAjoutes()
            // console.log('Video =>', video)
        }, []
    )
    return (

        <ScrollView style={{ flex: 1, backgroundColor: '#000000', }} >
            {/* <Swiper autoplay height={240}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Image
                        style={{ flex: 1, width: widths }}
                        source={{ uri: 'https://fairylandstudios.net/mobile_api/images/cdr.jpg' }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Image
                        style={{ flex: 1, width: widths }}
                        source={{ uri: 'https://fairylandstudios.net/mobile_api/images/eap.jpg' }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Image
                        style={{ flex: 1, width: widths }}
                        source={{ uri: 'https://fairylandstudios.net/mobile_api/images/lcs.jpeg' }}
                    />
                </View>
            </Swiper> */}
            <View>
                <Text style={styles.text}>Récemment ajoutés</Text>
                <FlatList
                    horizontal
                    ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                    renderItem={({ item }) => _renderItem(item)}
                    data={video}
                />
            </View>

            {/* <View>
                <Text style={styles.text} >Meilleures sélections</Text>
                <FlatList
                    horizontal
                    ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                    renderItem={({ item }) => _renderItem(item)}
                    data={shows_second}
                />
            </View> */}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: 'bold',

    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
});