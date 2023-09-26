import React, { useEffect, useState } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import WebView from "react-native-webview";
import { ActivityIndicator } from "react-native-paper";
import { DRAWER_HEADER_SHOWN } from '../../constants/Constants'
import HeaderCustom from '../../components/HeaderCustom'
import { app_color_main } from "../../services/data";

const Live = ({navigation}) => {
    
    const [fetchLoading, setFetchLoading] = useState(true)
    const [url, setUrl] = useState('https://live.kati.watch')

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom goBack iconName='close' />
            )}
            <WebView
                source={{uri: url}}
                cacheEnabled
                scrollEnabled
                // style={{ flex: 1 }}
                onLoadStart={() => setFetchLoading(true)}
                onLoadEnd={() => setFetchLoading(false)}
            />
            {fetchLoading && (
                <ActivityIndicator size={25} color="#FFF" style={{flex: 1, backgroundColor: '#000'}} />
            )}
        </SafeAreaView>
    )
}

export default Live;