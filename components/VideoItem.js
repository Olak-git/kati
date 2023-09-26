import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { baseSite } from '../constants/Constants'
import { Icon } from '@rneui/base'
import { format_size } from '../services/helpersFunction'

export default function VideoItem({item, index, length, user, disabled=false}) {
    const navigation = useNavigation()

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

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={()=>navigateToDataVideo(item)} 
            style={{flexDirection: 'row', marginBottom: 20, paddingBottom: 10, borderBottomWidth: index!=length?1:0, borderColor: '#f4f4f4'}}
        >
            <Image
                defaultSource={require('../assets/images/kati_icone.png')}
                source={img}
                style={{height: 100, width: 100, borderRadius: 20}}
                resizeMode='cover'
            />
            <View style={{flex: 1, borderWidth: 0, borderColor: 'red', paddingLeft: 10, position: 'relative'}}>
                <View style={{ flex:1 }}>
                    <Text style={{color:'#FFF', fontWeight: '700', fontSize: 16}}>{item.nom}</Text>
                    <Text style={{color:'#FFF', fontWeight: '100'}}>{item.user_nom+' '+item.user_prenom}</Text>
                </View>

                {/* <View style={{position: 'absolute', bottom: 2, left: 2, right: 2, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center'}}> */}
                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
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