import { Icon } from '@rneui/base';
import { useMeeting } from '@videosdk.live/react-native-sdk';
import React from 'react'
import { TouchableOpacity, Text, View } from "react-native";
import { app_color_main } from '../../../services/data';
import { Button as ButtonPaper } from 'react-native-paper'

const Button = ({ onPress, buttonText, backgroundColor }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: backgroundColor,
                justifyContent: "center",
                alignItems: "center",
                padding: 12,
                borderRadius: 4,
            }}
        >
            <Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
        </TouchableOpacity>
    );
};

export function ControlsContainer({ join, leave, toggleWebcam, toggleMic }) {
    const {end, stopRecording, stopVideo, toggleScreenShare, localScreenShareOn, changeWebcam, localWebcamOn, localMicOn, startHls, stopHls, hlsState } = useMeeting({});
    return (
        <View
            style={{
                padding: 24,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: 'center'
            }}
        >
            <ButtonPaper mode="contained" onPress={join} buttonColor={app_color_main}>
                Join
            </ButtonPaper>
            {/* <Button
                onPress={() => {
                    join();
                }}
                buttonText={"Join"}
                backgroundColor={"#1178F8"}
            /> */}
            <Icon 
                type='material-icon' 
                name={localWebcamOn?'videocam':'videocam-off'} 
                color={'#FFF'} 
                onPress={toggleWebcam} 
                size={30}
                // reverse
                reverseColor={app_color_main} 
                containerStyle={{margin: 0}}
            />
            {/* <Button
                onPress={() => {
                    toggleWebcam();
                }}
                buttonText={"Toggle Webcam"}
                backgroundColor={"#1178F8"}
            /> */}
            <Icon 
                type='font-awesome-5' 
                name={localMicOn?'microphone':'microphone-slash'} 
                color={'#FFF'} 
                onPress={toggleMic} 
                // reverse 
                reverseColor={app_color_main} 
                containerStyle={{margin: 0}}
            />
            {/* <Button
                onPress={() => {
                    toggleMic();
                }}
                buttonText={"Toggle Mic"}
                backgroundColor={"#1178F8"}
            /> */}
            <ButtonPaper mode="contained" onPress={leave} buttonColor={app_color_main}>
                Leave
            </ButtonPaper>
            {/* <Button
                onPress={() => {
                    leave();
                }}
                buttonText={"Leave"}
                backgroundColor={"#FF0000"}
            /> */}
        </View>
    );
}