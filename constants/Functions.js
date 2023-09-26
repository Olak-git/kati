import React from "react";
import { PermissionsAndroid } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

const requestDownload = (file, title = null) => {
    // const response = await 
    RNFetchBlob.config({
        fileCache: true,
        overwrite: true,
        indicator: true,
        addAndroidDownloads: {
            notification: true,
            description: 'Download file...',
            useDownloadManager: true,
            title: title
        },
    })
    .fetch('GET', file, {
        Authorization: 'Bearer access-token...',
        'Content-Type': 'application/octet-stream' //'BASE64' 
        // more headers  ..
    })
    // .uploadProgress((written, total) => {
    //     console.log('Upload: ', written/total)
    // })
    .progress((received, total) => {
        console.log('Progress: ', received / total)
    })
    .then((res) => {
        const status = res.info().status;
        if (status === 200) {
            console.log('Ress : ', res)
            console.log('This is file saved to ', res.path())
            // the conversion is done in native code
            let base64Str = res.base64()
            // the following conversions are done in js, it's SYNC
            let text = res.text()
            let json = res.json()
        }
    })
    // @ts-ignore
    .catch((errorMessage, statusCode) => {
        console.log('statusCode: ', statusCode)
        console.log('errorMessage: ', errorMessage)
    })
    // console.log('ResponseFetchBlob : ', response)
    // console.log('ResponseStatusFetchBlob : ', response.respInfo.status)
}

export const downloadFile = async (file, title=null) => {
    console.log(file)
    try {
        if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'File',
                    message: 'App needs access to your Files... ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('startDownload...');
                requestDownload(file, title)
            }
        } else {
            requestDownload(file, title)
        }
    } catch (e) {
        console.log('Error')
    }
}