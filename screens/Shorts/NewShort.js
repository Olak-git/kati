import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Pressable, Image, Alert, Platform, KeyboardAvoidingView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { DRAWER_HEADER_SHOWN, baseSite, baseUri } from '../../constants/Constants'
import { app_color_main } from '../../services/data'
import HeaderCustom from '../../components/HeaderCustom'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '@rneui/base'
import { HelperText, TextInput, Button, IconButton, Divider } from 'react-native-paper';
import TextInputRN from '../../components/TextInputRN'
import { arrondir, getPercentage, storagePermission, timeFormat } from '../../services/helpersFunction';
import RNFetchBlob from 'rn-fetch-blob'
import NewFlVideo from '../../components/NewFlVideo'
import { hg, openFilePicker, openLaunchGalery, pickerFile } from '../../services/fileLaunch'
import { SwipeablePanel } from 'rn-swipeable-panel';

const NewShort = ({navigation, route}) => {
    const reff = useRef(null)

    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data)
    const path = user.img ? { uri: baseSite + user.img } : require('../../assets/images/kati_icone.png')
    // const path = require('../../assets/images/user-1.png')

    const [src, setSrc] = useState(require('../../assets/images/person.png'))

    const [loading, setLoading] = useState(false);

    const compress = true

    const [inputs, setInputs] = useState({
        titre: '',
        tags: '', // separer par des virgules
        video: {},
        img: {},
    })

    const [errors, setErrors] = useState({
        titre: null,
        tags: null,
        video: null
    })

    const [oldVideFileSize, setOldVideoFileSize] = useState(undefined)
    const [compressVideFileSize, setCompressVideoFileSize] = useState(undefined)

    const [duration, setDuration] = useState(0)
    const [poster, setPoster] = useState(null)

    const [visible, setVisible] = useState(false)
    const [percentProgress, setPercentProgress] = useState(undefined);

    const [cancellationVideoCompressId, setCancellationVideoCompressId] = useState(undefined)

    const [compressionActive, setCompressionActive] = useState(false)
    const [compressorProgress, setCompressorProgress] = useState(undefined)

    var APIURL = baseUri + "saveShortVideo.php";

    const [isPanelActive, setIsPanelActive] = useState(false);

    const openPanel = () => {
      setIsPanelActive(true);
    };
  
    const closePanel = () => {
      setIsPanelActive(false);
    };

    const clearPoster = () => {
        onHandleChangeText('video', {})
        onHandleChangeText('img', {})
        setDuration(0)
        setPoster(null)
        onChangeErrorText('video', null)
    }

    const onHandleChangeText = (key, text) => {
        setInputs(state => ({...state, [key]: text}))
    }

    const onChangeErrorText = (key, text) => {
        setErrors(state => ({...state, [key]: text}))
    }

    const clearErrors = () => {
        for(let k in errors) {
            onChangeErrorText(k, null);
        }
    }

    const resetValues = () => {
        clearErrors()
        clearPoster()
        onHandleChangeText('titre', '')
        onHandleChangeText('tags', '')
    }

    const setSizes = (old_size, compress_size) => {
        setOldVideoFileSize(old_size)
        setCompressVideoFileSize(compress_size)
    }

    const fch = () => {
        // APIURL = 'http://192.168.8.100:8888/projects/kati/saveShortFile.php'
        // APIURL = 'https://sass.utechaway.com/test_kati/mobile_api/saveShortVideo.php';
        // var APIURL = baseUri + "editPassword.php";

        console.log({ image: inputs.img });
        console.log({ vide: inputs.video });

        var data = [
            { name: 'img', filename: inputs.img.name, type: inputs.img.type, data: RNFetchBlob.wrap(inputs.img.uri) },
            { name: 'video', filename: inputs.video.name, type: inputs.video.type, data: RNFetchBlob.wrap(decodeURIComponent(Platform.OS=='android'?inputs.video.uri:inputs.video.uri.replace("file://", "")))},
            { name: 'other', data: JSON.stringify({
                titre: inputs.titre,
                tags: inputs.tags,
                userId: user.id
            })}
        ];

        console.log({ data });

        RNFetchBlob.fetch('POST', APIURL, {
            Authorization: 'Bearer access-token',
            otherHeader: "foo",
            // 'Content-Type': 'multipart/form-data',
            // "Content-Type": "application/octet-stream"
            // 'content-type': 'multipart/form-data,octet-stream',
            
            "accept":"multipart/form-data",
            'content-type': 'application/octet-stream'
        }, [...data])
        .uploadProgress({ interval : 250 },(written, total) => {
            var percentage = getPercentage(written, total);
            setPercentProgress(percentage)
            // console.log('progress: ', written / total)
        })
        // listen to download progress event
        .progress({ interval : 250 },(received, total) => {
            var percentage = getPercentage(received, total);
            setPercentProgress(percentage)
            // console.log('progress: ', received / total)
        })
        .then(resp => {
            console.log('data : ', resp.data)
            const { data } = resp
            const response = JSON.parse(data)
            if(response.success) {
                Alert.alert('Short ajouté avec succès.')
                resetValues()
            } else {
                const errors = response.errors
                for(let k in errors) {
                    onChangeErrorText(k, errors[k]);
                }
            }
        })
        .finally(() => {
            setPercentProgress(undefined)
            setLoading(false)
            console.log('End Loading');
        })
    }

    const onHandlePress = () => {
        let isValid = true
        clearErrors()

        if(!inputs.titre) {
            isValid = false
            onChangeErrorText('titre', 'Le champ titre est obligatoire.')
        } else if(!inputs.titre.trim()) {
            isValid = false
            onChangeErrorText('titre', 'Le champ titre ne peut pas être en blanc.')
        } else {
            onChangeErrorText('titre', null)
        }

        if(!inputs.tags) {
            isValid = false
            onChangeErrorText('tags', 'Le champ tags est obligatoire.')
        } else if(!inputs.tags.trim()) {
            isValid = false
            onChangeErrorText('tags', 'Le champ tags ne peut pas être en blanc.')
        } else {
            onChangeErrorText('tags', null)
        }

        if(Object.keys(inputs.video).length == 0) {
            isValid = false
            onChangeErrorText('video', 'Veuillez sélectionner la vidéo à uploader')
        } else {
            onChangeErrorText('video', null)
        }

        if(isValid) {
            // console.log({inputs});
            setLoading(true)
            setPercentProgress(undefined)
            
            // fs();
            fch();
        } else {
            Alert.alert('Un ou plusieurs champs sont vides')
        }
    }

    const openPicker = async (mode) => {
        const granted = await storagePermission();
        if(granted) {
            try {
                let result;
                if(mode=='galerie') {
                    result = await openLaunchGalery()
                } else {
                    result = await openFilePicker()
                }
                // const result = await pickerFile()

                if(result) {
                    closePanel()
                    await hg(result, onChangeErrorText, onHandleChangeText, setCompressionActive, setCancellationVideoCompressId, setCompressorProgress, setDuration, setPoster, compress, true, clearPoster, setSizes)
                }

            } catch(e) {
                console.log('Error: ', e)
            }
        }
    }

    useEffect(()=>{
        console.log('New Short');
    },[route])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <StatusBar backgroundColor={app_color_main} />

            <HeaderCustom goBack={Platform.OS=='android'} />

            <KeyboardAvoidingView
                behavior={Platform.OS=='ios'?'padding':'height'}
                style={{flex: 1}}
            >
                <ScrollView contentContainerStyle={{paddingBottom: 50}}>
                    {/* <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Image source={path} style={{ width: 80, height: 80, borderRadius: 10 }} />
                        <Text style={{marginTop: 20, color: '#FFF', fontWeight: '500'}} numberOfLines={1} ellipsizeMode='tail' >{user.nom.toUpperCase() + ' ' + user.pre}</Text>
                    </View> */}

                    <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 20, marginBottom: 30 }}>Ajoutez de nouvelles vidéos à votre store</Text>
                    <Divider style={{ marginHorizontal: 80, marginBottom: 30 }} />

                    <TextInputRN label='Titre' tag='titre' inputs={inputs} errors={errors} onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} />
                    <TextInputRN label='Tags' tag='tags' helpText='(Séparés par des virgules sans espace)' inputs={inputs} errors={errors} onHandleChangeText={onHandleChangeText} contentContainerStyle={styles.contentContainerInput} />

                    <View style={styles.contentContainerInput}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={openPanel}
                            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 15, borderRadius:5 }}
                        >
                            <Icon 
                                type='entypo'
                                name='video'
                                color='#000000'
                            />
                            <Text style={{ flex: 1, marginLeft: 10, color: '#000000' }} numberOfLines={1} lineBreakMode='middle' ellipsizeMode='middle' >{ Object.keys(inputs.video).length>0?inputs.video.name:'Aucun fichier choisi' }</Text>
                        </TouchableOpacity>
                        {errors.video && (
                            <HelperText type="error" visible style={{ marginBottom:5, fontSize: 15 }}>
                                { errors.video }
                            </HelperText>
                        )}
                        {compressionActive && (
                            <HelperText type="info" visible style={{ marginBottom:5, fontSize: 15, color: "#FFFFFF" }}>
                                Compression du fichier en cours...{compressorProgress!=undefined?`${getPercentage(compressorProgress,1)}%`:undefined}
                            </HelperText>
                        )}
                    </View>

                    {Object.keys(inputs.video).length != 0 && (
                        <NewFlVideo video_uri={inputs.video.uri} />
                    )}

                    {poster && (
                        <View style={[styles.contentContainerInput, { flexDirection: 'row' }]}>
                            <Image source={{ uri: poster }} style={{ width: 90, height: 100 }} />
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                <Text style={{ color: '#ffffff' }}>{inputs.video.name}</Text>
                                <Text style={{ color: '#ffffff', marginTop: 5 }}>{timeFormat(duration)}</Text>
                                {(oldVideFileSize!=undefined || compressVideFileSize!=undefined) && (
                                    <Text style={{ color: '#ffffff', marginTop: 0 }}>{format_size(compress?compressVideFileSize:oldVideFileSize)}</Text>
                                )}
                                {/* {oldVideFileSize && (
                                    <Text style={{ color: '#ffffff', marginTop: 0 }}>{format_size(oldVideFileSize)}</Text>
                                )}
                                {compressVideFileSize && (
                                    <Text style={{ color: '#ffffff', marginTop: 0 }}>{format_size(compressVideFileSize)}</Text>
                                )} */}
                            </View>
                            {!loading && (
                                <IconButton
                                    icon="trash-can-outline"
                                    iconColor='#FFFFFF'
                                    size={30}
                                    onPress={clearPoster}
                                />
                            )}
                        </View>
                    )}

                    <View style={styles.contentContainerInput}>
                        <Button mode="contained" onPress={onHandlePress} loading={loading} buttonColor={app_color_main} labelStyle={{ fontSize: 20, paddingVertical: 5 }}>
                            ENREGISTRER
                        </Button>

                        {percentProgress != undefined && (
                            <Text style={{ color: 'rgb(209, 213, 219)', textAlign: 'center', marginTop: 5 }}>{percentProgress}%</Text>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>


            <SwipeablePanel 
                isActive={isPanelActive}
                fullWidth={true}
                openLarge={false}
                showCloseButton={true}
                onClose={closePanel}
                onPressCloseButton={closePanel}
                smallPanelHeight={210}
                onlySmall
            >
                <View
                    style={{ 
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'flex-end'
                    }}
                >
                    <TouchableOpacity
                        onPress={()=>openPicker('galerie')}
                        style={{  }}
                    >
                        <Icon
                            type="font-awesome-5"
                            name="photo-video"
                            color='rgb(239, 68, 68)'
                        />
                        <Text style={{ color: '#000000', marginTop: 4 }}>{Platform.OS=='ios'?'Photos':'Galerie'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={()=>openPicker('folder')}
                        style={{  }}
                    >
                        <Icon
                            type="font-awesome"
                            name="folder"
                            color='rgb(59, 130, 246)'
                            size={26}
                        />
                        <Text style={{ color: '#000000', marginTop: 4 }}>Répertoire</Text>
                    </TouchableOpacity>
                </View>
            </SwipeablePanel>
        </SafeAreaView>
    )
}

export default NewShort;

const styles = StyleSheet.create({
    contentContainerInput: {
        marginHorizontal: 20,
        marginBottom: 30
    }
})