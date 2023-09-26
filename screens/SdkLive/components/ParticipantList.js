import React from 'react'
import { RTCView, useParticipant } from '@videosdk.live/react-native-sdk';
import { FlatList, View, Text, Platform } from 'react-native';
import { Button } from 'react-native-paper'
import { app_color_main } from '../../../services/data';

function ParticipantView({ participantId }) {
    const { webcamStream, webcamOn } = useParticipant(participantId);
    return webcamOn && webcamStream ? (
        <RTCView
            streamURL={new MediaStream([webcamStream.track]).toURL()}
            objectFit={"cover"}
            style={{
                height: 300,
                marginVertical: 8,
                marginHorizontal: 8,
            }}
        />
    ) : (
        <View
            style={{
                backgroundColor: "grey",
                height: 300,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ fontSize: 16 }}>NO MEDIA</Text>
        </View>
    );
}

export function ParticipantList({ participants, resetMeetingId }) {
    return participants.length > 0 ? (
        <FlatList
            data={participants}
            renderItem={({ item }) => {
                return <ParticipantView participantId={item} />;
            }}
        />
    ) : (
        <View
            style={{
                flex: 1,
                // backgroundColor: "#F6F6FF",
                backgroundColor: '#000',
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button onPress={resetMeetingId} icon='close' mode="contained" buttonColor={app_color_main} style={{position: 'absolute', top: Platform.OS == 'android' ? 10 : 40, left: 10}}>
                Fermer
            </Button>
            <Text style={{ fontSize: 15, color: '#FFF', textAlign: 'center', paddingHorizontal: 5 }}>Appuie sur le bouton <Text style={{color: app_color_main}}>Join</Text> pour rejoindre le live.</Text>
        </View>
    );
}