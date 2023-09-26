
import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Video from "react-native-video";
import { IconButton } from 'react-native-paper';
import { format_size, timeFormat } from '../services/helpersFunction';
import { useEffect } from 'react';
import { useRef } from 'react';

export default function NewFlVideo({ video_uri }) {
    const videoref = useRef(null)
    const [replay, setReplay] = useState(false)
    const [paused, setPaused] = useState(true)
    const [duration, setDuration] = useState(undefined)
    const [currentTime, setCurrentTime] = useState(undefined)

    const onPaused = () => {
        if(replay) {
            videoref?.current?.seek(0)
            setCurrentTime(0)
            setReplay(false)
        }
        setPaused(!paused)
    }

    const onHandleStoped = () => {
        setPaused(true)
        setReplay(true)
    }

    useEffect(()=>{
        if(parseInt(currentTime) == parseInt(duration)) {
            onHandleStoped()
        }
    }, [currentTime, duration])

    return (
        <View style={{ 
            marginBottom: 20,
         }}>
            <Video
                ref={videoref}
                source={{ uri: video_uri }}
                style={[styles.contentContainerInput, {
                    height: 200,
                }]}
                resizeMode="cover"
                paused={paused}
                // poster={poster} 
                onLoad={(payload) => {
                    setDuration(payload.duration)
                }}
                onProgress={(payload) => {
                    const { currentTime, playableDuration, seekableDuration } = payload;
                    // convertTime(currentTime, seekableDuration);
                    setCurrentTime(currentTime)
                    // console.log({ vDuration: duration });
                    // console.log({ payload });
                }}
                volume={0.02}        
            />

            {currentTime!=undefined && (
                <Text style={{ color: '#000', backgroundColor: 'rgba(255,255,255,0.4)', position: 'absolute', bottom: 35, left: 20, padding: 8 }}>{timeFormat(parseInt(currentTime))}</Text>
            )}
            <IconButton
                icon={replay?'replay':(paused?'play':'pause')}
                // iconColor='#000000'
                size={30}
                onPress={onPaused}
                style={{ 
                    position: 'absolute',
                    bottom: 35,
                    right: 20
                }}
                mode='contained'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contentContainerInput: {
        marginHorizontal: 20,
        marginBottom: 30
    }
})