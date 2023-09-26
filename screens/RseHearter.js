import { ActivityIndicator, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { WebView } from 'react-native-webview';
import { DRAWER_HEADER_SHOWN } from '../constants/Constants'
import HeaderCustom from '../components/HeaderCustom'
import { app_color_main } from '../services/data'

const RseHearter = () => {
    const [loading, setLoading] = useState(false)
    return (
        
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack iconName='close' />
            )}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Image source={require('../assets/images/rse_hearter.jpeg')} style={{ width: 80, height: 80, borderRadius: 10 }} />
                <Text style={{marginTop: 8, color: '#FFF', fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail' >RSE Hearter</Text>
            </View>
            <WebView 
                source={{ uri: 'https://www.rse-hearter.kati.watch/' }} 
                // style={{ flex:1, borderTopLeftRadius: 40, borderTopRightRadius: 40 }} 
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                containerStyle={{ flex:loading?0:1, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                onScroll={(e)=>{
                    // console.log('Scroll Event: ', e)
                }}
                // cacheEnabled={false}
                // cacheMode='LOAD_DEFAULT'
            />
            {loading && (
                <View style={{flex:1, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, justifyContent: 'center'}}>
                    <ActivityIndicator />
                </View>
            )}
        </SafeAreaView>
    )
}

export default RseHearter

const styles = StyleSheet.create({})