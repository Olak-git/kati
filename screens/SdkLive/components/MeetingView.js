import React from 'react'
import { Clipboard, View, Text, Alert, Share } from 'react-native'
import { ControlsContainer } from './ControlsContainer';
import { useMeeting } from '@videosdk.live/react-native-sdk';
import { Button, IconButton } from 'react-native-paper';
import { ParticipantList } from './ParticipantList';
import { app_color_main } from '../../../services/data';

export function MeetingView(props) {
    const { resetMeetingId } = props;
    const { join, leave, toggleWebcam, toggleMic, participants, meetingId } = useMeeting({});
    
    const participantsArrId = [...participants.keys()];

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Rejoins-moi sur mon live avec le code: \n${meetingId}`,
                // url: 'https://utechaway.com'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {meetingId ? (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{ fontSize: 18, padding: 12, color: 'grey' }}>
                        MEI: {meetingId}
                    </Text>
                    <Button onPress={()=>{
                        Clipboard.setString(meetingId);
                        Alert.alert("MeetingId copied successfully");
                    }} icon='content-copy' mode="contained" buttonColor={app_color_main} style={{}}>
                        Copy
                    </Button>
                    <IconButton
                        icon='share-variant'
                        size={30}
                        iconColor='#FFF'
                        onPress={onShare}
                    />
                </View>
            ) : null}
            <ParticipantList participants={participantsArrId} resetMeetingId={resetMeetingId} />
            <ControlsContainer
                join={join}
                leave={leave}
                toggleWebcam={toggleWebcam}
                toggleMic={toggleMic}
            />
        </View>
    );
}