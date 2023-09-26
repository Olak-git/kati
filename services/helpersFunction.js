import { PermissionsAndroid, Platform } from 'react-native';
import FilePicker, { types } from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const getPercentage = (totalBytesSent, totalBytesExpectedToSend) => {
    // console.log('UPLOAD IS ' + totalBytesSent + ' DONE!');
    return Math.floor((totalBytesSent/totalBytesExpectedToSend) * 100);
}

export const storagePermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // {
        //     title: 'File',
        //     message:
        //         'App needs access to your Storage Memory... ',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        // },
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Storage Permission denied')
    }).catch((error) => {
        console.log('Ask Storage permission error: ', error)
    })
})

/**
 * 
 * @param {*} A: Number 
 * @param {*} B: Number
 * @returns float
 */
export const arrondir = (A, B) => {
    // @ts-ignore
    return parseFloat(parseInt(A * Math.pow(10, B) + .5) / Math.pow(10, B));
}
/**
 * 
 * @param {*} S: Number 
 * @returns string
 */
export const format_size = (S) => {
    let $unit = '';
    let $d = 0;
    const digit = 1000;
    if(S >= Math.pow(digit, 4)) {
        $d = 4;
        $unit = 'T';
    } else if(S >= Math.pow(digit, 3)) {
        $d = 3;
        $unit = 'G';
    } else if(S >= Math.pow(digit, 2)) {
        $d = 2;
        $unit = 'M';
    } else if(S >= Math.pow(digit, 1)) {
        $d = 1;
        $unit = 'K';
    }
    return arrondir(S / Math.pow(digit, $d), 2) + ' ' + $unit;
}

export const handleFilePicker = async () => {
    const permissionStorage = await storagePermission();
    if(permissionStorage) {
        try {
            const response = await FilePicker.pick({
                presentationStyle: 'pageSheet',
                type: [types.images],
                transitionStyle: 'coverVertical',
            })
            FilePicker.isCancel((err) => {
                console.log(err);
            })
            return response[0]

            if(file == 'profil')
                setAvatar({uri: response[0].uri})
            // @ts-ignore
            // console.log(response[0].name + '(' + format_size(response[0].size) + ')');
            handleOnChange(file, response[0])

        } catch(e) {
            return 'Error: '+e
            console.log(e)
        }
    }
}

export const timeFormat = (timer) => {
    const times = parseInt(timer);
    let heure = parseInt(times/3600)
    let reste = timer%3600;
    let minutes = parseInt(reste/60)
    let secondes = reste - (minutes * 60)
    const time = (heure!=0?heure.toString().padStart(2, '0') + ':' : '') + minutes.toString().padStart(2, '0') + ':' + secondes.toString().padStart(2, '0');
    return time;
}

export const openLaunchGalery = async () => {
    const granted = await storagePermission();
    if(granted) {
        try {
            const result = await launchImageLibrary({mediaType: 'photo', selectionLimit: 1})
            if(result.assets) {
                const $file = result.assets[0];
                console.log('$file: ', $file)
                return $file

                // if(file == 'profil') setAvatar({uri: $file.uri});
                // handleOnChange(file, {
                //     'fileCopyUri': null,
                //     'name': $file.fileName,
                //     'size': $file.fileSize,
                //     'type': $file.type,
                //     'uri': $file.uri
                // })
            }
            if(result.didCancel) {
                return 'Canceled';
                console.log('Canceled')
            }
            if(result.errorCode) {
                return 'Error Code '+result.errorCode+', '+result.errorMessage;
                console.log('Error Code ', result.errorCode, ', ', result.errorMessage)
            }
        } catch(e) {
            return 'Error: '+e
            console.log('Error: ', e)
        }
    }
}