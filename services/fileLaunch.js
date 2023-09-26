import FilePicker, { types } from 'react-native-document-picker'
import { createThumbnail } from "react-native-create-thumbnail";
import { compressVideo } from './compressor';
import { getRealPath, getVideoMetaData, generateFilePath } from 'react-native-compressor';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
import { storagePermission } from './helpersFunction';

export const openLaunchGalery = async () => {
    const granted = await storagePermission();
    let result
    if(granted) {
        try {
            const response = await launchImageLibrary({
                mediaType: 'video', 
                videoQuality: 'high',
                // durationLimit: 60,
                selectionLimit: 1,
                // formatAsMp4: true,
            })
            console.log('Result => ', response);
            if(response.assets) {
                result = response.assets[0]
            }
            if(response.didCancel) {
                console.log('Canceled')
            }
            if(response.errorCode) {
                Alert.alert('Error Code ' + result.errorCode + ', ' + result.errorMessage)
                console.log('Error Code ', result.errorCode, ', ', result.errorMessage)
            }
        } catch(e) {
            console.log('Error: ', e)
        }
    }
    return result;
}

export const openFilePicker = async () => {
    const permissionStorage = await storagePermission();
    let result;
    if(permissionStorage) {
        try {
            const response = await FilePicker.pick({
                presentationStyle: 'pageSheet',
                type: [types.video],
                transitionStyle: 'coverVertical',
            })
            FilePicker.isCancel((error) => {
                console.log({ error });
            })
            result = response[0]
        } catch(e) {
            console.log(e)
        }
    }
    return result;
}

export const pickerFile = async () => {
    let result = undefined;
    if(Platform.OS == 'ios') {
        const response = await FilePicker.pick({
            presentationStyle: 'pageSheet',
            type: [types.video],
            transitionStyle: 'coverVertical',
        })
        FilePicker.isCancel(() => {
            console.log(err);
        })
        result = response[0]
    } else {
        const response = await launchImageLibrary({
            mediaType: 'video', 
            videoQuality: 'high',
            // durationLimit: 60,
            selectionLimit: 1,
            // formatAsMp4: true,
        })
        console.log('Result => ', response);
        if(response.assets) {
            result = response.assets[0]
        }
        if(result.didCancel) {
            console.log('Canceled')
        }
        if(result.errorCode) {
            Alert.alert('Error Code ' + result.errorCode + ', ' + result.errorMessage)
            console.log('Error Code ', result.errorCode, ', ', result.errorMessage)
        }
    }

    return result
}

/*
    compress: can_compress
    onChangeErrorText: callaction_handlechange_error
    onHandleChangeText: callaction_handlechange_text
    setCompressionActive: callaction_setcompressionactive
    setCancellationVideoCompressId: callaction_setcancelation_videocompress_id
    setCompressorProgress: callaction_setcompressor_progress
    setDuration: callaction_setduration
    setPoster: callaction_setposter
*/
export const hg = async (file, callaction_handlechange_error, callaction_handlechange_text, callaction_setcompressionactive, callaction_setcancelation_videocompress_id, callaction_setcompressor_progress, callaction_setduration, callaction_setposter, compress, control_duration=true, clear_poster=undefined, set_sizes=undefined) => {
    callaction_handlechange_error('video', null)

    const $file = file;
    console.log('$file: ', $file)

    var duration = $file.duration
    if(duration==undefined) {
        const meta_data = await getVideoMetaData($file.uri);
        duration = meta_data.duration
        // console.log({ meta_data });
    }

    // console.log({ duration });

    if(control_duration && duration>90) {
        callaction_handlechange_error('video', 'La durée de votre vidéo depasse la limite de 90s')
    } else {

        if(clear_poster!=undefined) {
            clear_poster()
        }

        var path_video_compress, metaData, realPath, randomFilePathForSaveFile;
        if(compress) {

            // const res = await RNFetchBlob.fs.stat($file.uri)
            // console.log({ res });
            
            callaction_setcompressionactive(true)
            callaction_setcompressor_progress(0)
            randomFilePathForSaveFile = await generateFilePath('mp4');
            path_video_compress = await compressVideo($file.uri, callaction_setcancelation_videocompress_id, callaction_setcompressor_progress)
            metaData = await getVideoMetaData(path_video_compress);
            realPath = await getRealPath(path_video_compress, 'video');
            callaction_setcompressionactive(false)
            callaction_setcompressor_progress(undefined)
        }
    
        // console.log({ path_video_compress });
        // console.log({ metaData });
        // console.log({ realPath });
        // console.log({ randomFilePathForSaveFile });

        callaction_setduration(duration)

        callaction_handlechange_text('video', {
            'name': $file.name||$file.fileName, //$file[Platform.OS=='ios'?'name':'fileName'], //'video.'+metaData.extension,
            'size': compress?parseFloat(metaData.size):($file.size||$file.fileSize), //$file[Platform.OS=='ios'?'size':'fileSize'],
            'type': $file.type,
            'uri': compress?path_video_compress:$file.uri
        })

        if(compress && set_sizes!=undefined) {
            set_sizes($file[Platform.OS=='ios'?'size':'fileSize'], metaData.size)
        }

        // setVisible(true)
        createThumbnail({
            url: compress?realPath:$file.uri,
            timeStamp: 1000,
            format: 'png'
        })
        .then(response => {
            callaction_handlechange_text('img', {
                name: 'image.png',
                size: response.size,
                type: response.mime,
                uri: response.path,
            })
            callaction_setposter(response.path)                  
        })
        .catch(err => console.log({ err }))
        .finally(() => {
            // setVisible(false)
        })
    }
}