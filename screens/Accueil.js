import React, {useEffect, useRef, useState} from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, Dimensions, RefreshControl, TouchableOpacity, ScrollView, useWindowDimensions, SafeAreaView, StatusBar, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { WebView } from 'react-native-webview';
import Carousel from 'react-native-snap-carousel';
import { DRAWER_HEADER_SHOWN, baseSite, baseUri, refresh_colors } from '../constants/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { app_color_main } from '../services/data';
import HeaderCustom from '../components/HeaderCustom';
import { Icon } from '@rneui/base';
import { setVisibleLive, setVisibleLiveButton } from '../feature/videosdk.authtoken.slice';
import { setVisibleAllSystem } from '../feature/user.slice';

const _width = 115;
const _height = 140;

const ListCompo = ({str=undefined, loading, renderItem, data, onHandlePressNext=undefined}) => {
    return (
        <View style={{ marginTop: 30, marginBottom: 10, paddingHorizontal: 10 }}>
            {str != undefined && (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{ fontSize: 18, color: '#FFF', fontWeight: '500' }}>{str}</Text>
                    {onHandlePressNext != undefined && (
                        <Text style={{fontSize: 15, color: '#FFF'}} onPress={onHandlePressNext}>Voir Plus</Text>
                    )}
                </View>
            )}
            <FlatList
                horizontal
                ListEmptyComponent={
                    loading
                        ?
                        <ActivityIndicator color={app_color_main} size={30} />
                        :
                        <Text style={{ color: 'gray', fontWeight: '100' }}>Aucune vidéo disponible</Text>
                }
                ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
                data={data}
                renderItem={renderItem}
                contentContainerStyle={{ marginTop: 10 }}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

// Images
const Section1 = ({user, refresh, setRefresh}) => {

    const ref = useRef(null).current
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [indexActive, setIndexActive] = useState(0)

    const {width} = useWindowDimensions()
    
    const getImageSlide = () => {
        var APIURL = baseUri + "getImageSlide.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
            platform_os: Platform.OS
        };
        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then(json => {
            // console.log('Images: ', json)
            setImages(json)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(()=>{
            setLoading(false)
            setRefresh(false)
        })
    }

    const renderItem = ({item, index}) => (
        <View style={{width: '100%', height: 200, borderRadius: 20}}>
            <Image 
                source={{uri: baseUri+'images/'+item.img}}
                style={{width: '100%', height: '100%', borderRadius: 20}}
                resizeMode='cover'
            />
        </View>
        // <Text style={{color: '#FFF'}}>{JSON.stringify(item)}</Text>
    )

    useEffect(() => {
        getImageSlide();
    }, [])

    useEffect(() => {
        refresh&&getImageSlide();
    }, [refresh])

    return (
        <Carousel
            ref={ref}
            data={images}
            renderItem={renderItem}
            sliderWidth={width}
            itemWidth={width-100}
            // layout='tinder'
            autoplay={true}
            // autoplayDelay={1}
            // autoplayInterval={5}
            loopClonesPerSide={5}
            activeAnimationType='spring'
            // autoplayLoop
            loop
            enableSnap
            lockScrollWhileSnapping
            enableMomentum={false}
        />
    )
}

// Catégorie de vidéo
const Section2 = ({user, refresh, setRefresh, navigation}) => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const COLORS = ['rgb(234, 88, 12)', 'rgb(194, 65, 12)', 'rgb(245, 158, 11)', app_color_main, 'rgb(101, 163, 13)', 'rgb(22, 163, 74)', 'rgb(5, 150, 105)'];
    
    const getCategories = () => {
        var APIURL = baseUri + "getAllCategorie.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then(json => {
            // console.log('Categories => ', json)
            setCategories(json)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(()=>{
            setLoading(false)
            setRefresh(false)
        })
    }

    const entierAleatoire = (min=0, max=COLORS.length-1) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const renderItem = ({item, index}) => (
        <TouchableOpacity 
            onPress={()=>navigation.navigate('videos_by_categorie', {...item})} 
            style={{
                backgroundColor: COLORS[entierAleatoire()],
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 10
            }}
        >
            <Text style={{color: '#FFF', fontWeight: '600'}}>{item.intituler}</Text>
        </TouchableOpacity>
    )

    useEffect(() => {
        getCategories();
    }, [])

    useEffect(() => {
        refresh&&getCategories();
    }, [refresh])

    return (
        <ListCompo loading={loading} data={categories} renderItem={renderItem} />
    )
}

// Videos récemment ajoutées
const Section3 = ({user, refresh, setRefresh, navigation, navigateToDataVideo}) => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // "AllRecemmentAjouter.php"
    const getVideos = () => {
        var APIURL = baseUri + "video.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then(json => {
            // console.log('Section3 Videos: ', json)
            setVideos(json)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(()=>{
            setLoading(false)
            setRefresh(false)
        })
    }

    const renderItem = ({item, index}) => {
        const img = item.user_img?{uri: baseSite+item.img}:require('../assets/images/kati_icone.png')
        return (
            <TouchableOpacity onPress={()=>navigateToDataVideo(item)} style={[styles.contentContainerRender]}>
                <Image
                    defaultSource={require('../assets/images/kati_icone.png')}
                    source={img}
                    style={[styles.renderImg]}
                    resizeMode='cover'
                />
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        getVideos();
    }, [])

    useEffect(() => {
        refresh&&getVideos();
    }, [refresh])

    return (
        <ListCompo str='Récemment ajouté' loading={loading} data={videos} renderItem={renderItem} onHandlePressNext={() => navigation.navigate('videos_all_recent_add')} />
    )
}

// Videos tendance
const Section4 = ({user, refresh, setRefresh, navigation, navigateToDataVideo}) => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getVideos = () => {
        var APIURL = baseUri + "getVideoTendance.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then(json => {
            // console.log('Section4 videos: ', json)
            setVideos(json)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(()=>{
            setLoading(false)
            setRefresh(false)
        })
    }

    const renderItem = ({item, index}) => {
        const img = item.user_img?{uri: baseSite+item.img}:require('../assets/images/kati_icone.png')
        return (
            <TouchableOpacity onPress={()=>navigateToDataVideo(item)} style={[styles.contentContainerRender]}>
                <Image
                    defaultSource={require('../assets/images/kati_icone.png')}
                    source={img}
                    style={[styles.renderImg]}
                    resizeMode='cover'
                />
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        getVideos();
    }, [])

    useEffect(() => {
        refresh&&getVideos();
    }, [refresh])

    return (
        <ListCompo str='Vidéos Tendances' loading={loading} data={videos} renderItem={renderItem} />
    )
}

// Videos les plus regardées
const Section5 = ({user, refresh, setRefresh, navigation, navigateToDataVideo}) => {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getVideos = () => {
        var APIURL = baseUri + "getBestLiked.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then(json => {
            // console.log('Section5 videos: ', json)
            setVideos(json)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(()=>{
            setLoading(false)
            setRefresh(false)
        })
    }

    const renderItem = ({item, index}) => {
        const img = item.user_img?{uri: baseSite+item.img}:require('../assets/images/kati_icone.png')
        return (
            <TouchableOpacity onPress={()=>navigateToDataVideo(item)} style={[styles.contentContainerRender]}>
                <Image
                    defaultSource={require('../assets/images/kati_icone.png')}
                    source={img}
                    style={[styles.renderImg]}
                    resizeMode='cover'
                />
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        getVideos();
    }, [])

    useEffect(() => {
        refresh&&getVideos();
    }, [refresh])

    return (
        <ListCompo str='Les plus regardés' loading={loading} data={videos} renderItem={renderItem} />
    )
}

// Les chaines
const Section6 = ({user, refresh, setRefresh, navigation}) => {

    const [chaines, setChaines] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getChannels = () => {
        var APIURL = baseUri + "getChannel.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
        };
        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then(json => {
            // console.log('Section6 videos: ', json)
            setChaines(json)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(()=>{
            setLoading(false)
            setRefresh(false)
        })
    }

    const renderItem = ({item, index}) => {
        const img = item.user_img?{uri: item.user_img}:require('../assets/images/kati_icone.png')
        return (
            <TouchableOpacity onPress={()=>navigation.navigate('videos_by_channel', {...item})} style={{width: 100, height: 100, borderRadius: 100, borderWidth: 1, borderColor: '#fff', elevation: 5}}>
                <Image 
                    // loadingIndicatorSource={require('../assets/images/kati_icone.png')}
                    defaultSource={require('../assets/images/kati_icone.png')}
                    source={img}
                    style={{width: '100%', height: '100%', borderRadius: 100}}
                    resizeMode='cover'
                />
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        getChannels();
    }, [])

    useEffect(() => {
        refresh&&getChannels();
    }, [refresh])

    return (
        <ListCompo str='Chaine' loading={loading} data={chaines} renderItem={renderItem} onHandlePressNext={() => navigation.navigate('all_channel')} />
    )
}

export default function Accueil({navigation}) {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.data)
    const show_all_system = useSelector(state => state.user.show_all_system)

    const [loading, setLoading] = useState(true)
    const [refresh1, setRefresh1] = useState(false)
    const [refresh2, setRefresh2] = useState(false)
    const [refresh3, setRefresh3] = useState(false)
    const [refresh4, setRefresh4] = useState(false)
    const [refresh5, setRefresh5] = useState(false)
    const [refresh6, setRefresh6] = useState(false)
    const refreshing = refresh1||refresh2||refresh2||refresh4||refresh5||refresh6

    const navigateToDataVideo = (item)=>{
        console.log('Item: ', item)
        navigation.navigate('video', {videoId: item.videoId, videoSlug: item.videoSlug, resumer: item.resumer, img: item.img, video: item.video, likes: item.likes, dislikes: item.dislikes, user_img: item.user_img, channelName: item.channelName, channelId: item.channelId, nom: item.nom, vue: item.vue })
    }

    const onRefresh = () => {
        setLoading(true)
        setRefresh1(true);
        setRefresh2(true);
        setRefresh3(true);
        setRefresh4(true);
        setRefresh5(true);
        setRefresh6(true);
    }

    const checkSystem = () => {
        var APIURL = baseUri + "showAllSystem.php";
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            usersId: user.id,
            token: user.slug,
            platform_os: Platform.OS
        };
        console.log('Data: ', Data)

        fetch(APIURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(Data)
        })
        .then((Response) => Response.json())
        .then(json => {
            if(json.show_all_system) {
                dispatch(setVisibleAllSystem(json.show_all_system))
            }
            if(json.show_live_system) {
                dispatch(setVisibleLiveButton(json.show_live_system))
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(()=>{
            setLoading(false)
        })
    }

    useEffect(()=>{
        // rafraichir chaque 5min
        const timer = setInterval(checkSystem, 300000)
        return ()=>{
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        if(loading) {
            checkSystem()
        }
    }, [loading])

    return !show_all_system ? (
            <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
                <StatusBar backgroundColor={app_color_main} />
                {!DRAWER_HEADER_SHOWN && (
                    <HeaderCustom />
                )}
                <WebView 
                    source={{ uri: 'https://www.rse-hearter.kati.watch/' }} 
                    // style={{ flex:1, borderTopLeftRadius: 40, borderTopRightRadius: 40 }} 
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    containerStyle={{ flex:loading?0:1, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                    // cacheEnabled={false}
                    // cacheMode='LOAD_DEFAULT'
                    // textInteractionEnabled
                />
            </SafeAreaView>
        ) : (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor={app_color_main} />
            {!DRAWER_HEADER_SHOWN && (
                <HeaderCustom />
            )}
            <ScrollView 
                refreshControl={
                    <RefreshControl
                        colors={refresh_colors}
                        tintColor='#fff'
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressBackgroundColor='#ffffff'
                    />
                }
                style={{ flex: 1, backgroundColor: '#000'}} 
                contentContainerStyle={{paddingBottom: 20}} 
            >

                <Section1 user={user} refresh={refresh1} setRefresh={setRefresh1} />

                <Section2 user={user} refresh={refresh2} setRefresh={setRefresh2} navigation={navigation} />

                <Pressable 
                    onPress={()=>navigation.navigate('videos_search')}
                    style={{
                        backgroundColor: '#ccc',
                        borderRadius: 5,
                        padding: 10,
                        marginTop: 10,
                        marginHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Icon type='ant-design' name='search1' color='grey' />
                    <Text style={{ color: 'grey', flex: 1, marginLeft: 5 }}>Rechercher</Text>
                </Pressable>

                <Section3 user={user} refresh={refresh3} setRefresh={setRefresh3} navigation={navigation} navigateToDataVideo={navigateToDataVideo} />

                <Section4 user={user} refresh={refresh4} setRefresh={setRefresh4} navigation={navigation} navigateToDataVideo={navigateToDataVideo} />

                <Section5 user={user} refresh={refresh5} setRefresh={setRefresh5} navigation={navigation} navigateToDataVideo={navigateToDataVideo} />

                <Section6 user={user} refresh={refresh6} setRefresh={setRefresh6} navigation={navigation} navigateToDataVideo={navigateToDataVideo} />

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
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    contentContainerRender: {
        width: _width, 
        height: _height, 
        borderRadius: 20, 
        borderWidth: 0, 
        borderColor: 'gray'
    },
    renderImg: {
        width: '100%', height: '100%', borderRadius: 20
    },
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