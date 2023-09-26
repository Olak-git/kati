import React, { useState, useEffect } from 'react'
import { Image, Text, View, Share, SafeAreaView, Modal, ActivityIndicator, Pressable, FlatList, TextInput, PixelRatio } from 'react-native'
import { app_color_main } from '../services/data';
import { Icon } from '@rneui/base';
import { baseSite, baseUri } from '../constants/Constants';
import { useSelector } from 'react-redux';
import moment from 'moment';

export const ModalComments = ({label, itemId, itemName, commentsUri, addCommentUri, visible, hide, refreshItemData}) => {

    const user = useSelector(state => state.user.data)
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cment, setCment] = useState('');
    const [active, setActive] = useState(false);
    const [load, setLoad] = useState(false)

    const getListComments = () => {
        var APIURL = baseUri + commentsUri;
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        const Data = {
            [label]: itemId,
            token: user.slug,
        }
        fetch(APIURL, {
            method: 'POST',
            body: JSON.stringify(Data),
            headers: headers
        })
        .then((Response) => Response.json())
        .then((json) => {
            console.log('Response => ', json)
            setComments([...json])
            setCment('');
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setLoading(false);
            setActive(false);
        })
    }

    const onHandleComment = () => {
        let valid = true

        if(cment.trim()) {
            setLoad(true)
            setActive(true)
            var APIURL = baseUri + addCommentUri;
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            const Data = { 
                [label]: itemId, 
                usersId: user.id, 
                commentaire: cment,
                token: user.slug,
            }
            console.log('Data: ', Data)
            console.log('APIURL: ', APIURL)
            fetch(APIURL, {
                method: 'POST',
                body: JSON.stringify(Data),
                headers: headers,
            })
            .then((Response) => Response.json())
            .then((json) => {
                getListComments();
                refreshItemData()
            })
            .catch((error) => {
                console.log('error: ', error)
            })
            .finally(() => {
                setLoad(false)
                setLoading(false)
            })
        }
    }

    const renderItem = ({item, index}) => {
        const path = item.img ? { uri: baseSite+item.img } : require('../assets/images/kati_icone.png')
        return (
            <View style={{flexDirection: 'row', marginBottom: 15}}>
                <Image source={path} resizeMode="center" style={{width: PixelRatio.getPixelSizeForLayoutSize(20), height: PixelRatio.getPixelSizeForLayoutSize(20), borderRadius: 200, borderColor: '#E4E4E4', borderWidth: 1, marginRight: 10}} />
                <View style={{flex: 1}}>
                    <Text numberOfLines={1} style={{color:'#000', fontWeight: '600'}}>{item.username}</Text>
                    <Text style={{ marginTop: 3, color: '#333'}}>{item.commentaire}</Text>
                    <Text style={{marginTop: 5, color: 'gray'}}>{item.dat}</Text>
                </View>
            </View>
        )
    }

    useEffect(() => {
        if(visible) {
            getListComments()
            console.log(`${label}: `, itemId)
        }

        const m = moment('2023-06-09 12:02:45').format('YYYY-DD-MM à hh:mm:ss')
        console.log('Mom: ', m)
    }, [itemId, visible])

    return (
        <>
        {/* <Modal visible={active} animationType="fade" transparent>
            <View style={{backgroundColor: 'rgba(255,255,255,.4)', flex: 1, justifyContent: 'center'}}>
                <ActivityIndicator color='orange' />
            </View>
        </Modal> */}

        <Modal visible={visible} transparent animationType="slide">
            <View style={{backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, paddingTop: Platform.OS == 'android' ? 0:40}}>
                <Pressable onPress={hide}>
                    <Icon type='ant-design' name='close' size={30} />
                </Pressable>
                <Text style={{paddingVertical: 10, backgroundColor: '#E4E4E4', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, color: '#000', fontSize: 17, fontWeight: '500', flex: 1, textAlign: 'center'}}>{itemName}</Text>
            </View>
            <View style={{ backgroundColor: '#FFF', flex: 1 }}>
                <FlatList 
                    ListEmptyComponent={
                        loading
                            ?
                                <ActivityIndicator />
                            :
                                <View style={{}}>
                                    <Text style={{color: 'gray', textAlign: 'center'}}>Soyez le premier à laisser un commentaire.</Text>
                                </View>
                    }
                    data={comments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    style={{paddingHorizontal: 10, paddingTop: 10}}
                    contentContainerStyle={{paddingBottom: 10}}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={{ backgroundColor: '#FFF', borderColor: '#E4E4E4', borderTopWidth: 1, paddingTop: 5, paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TextInput placeholder="votre commentaire..." value={cment} onChangeText={(e) => setCment(e)} style={{ borderColor: '#E4E4E4', borderWidth: 1, borderRadius: 5, flex: 1, paddingHorizontal: 5, marginLeft: 5, marginRight: 3, textAlignVertical: 'top', minHeight: 40, maxHeight: 60 }} multiline />
                <Pressable disabled={load} onPress={onHandleComment} style={{ backgroundColor: '#FFF', padding: 10 }}>
                    {load
                        ?   <ActivityIndicator color={app_color_main} />
                        :   <Icon type='feather' name='send' color={app_color_main} />
                    }
                </Pressable>
            </View>
        </Modal>
        </>
    )
}