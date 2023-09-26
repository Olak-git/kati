import React, { useEffect, useState } from "react";
import { SafeAreaView, TouchableOpacity, Text, TextInput, ActivityIndicator, Platform } from "react-native";
import { Button } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient';
import { app_color_main } from "../../../services/data";

export function JoinScreen(props) {
    const navigation = props.navigation

    const [meetingVal, setMeetingVal] = useState("");

    return (
        <SafeAreaView
            style={{
                flex: 1,
                // backgroundColor: "#F6F6FF",
                backgroundColor: '#000',
                justifyContent: "center",
                paddingHorizontal: 6 * 10,
            }}
        >
            <Button onPress={()=>navigation.goBack()} icon='arrow-left-thin' mode="contained" buttonColor={app_color_main} style={{position: 'absolute', top: Platform.OS == 'android' ? 10 : 40, left: 10}}>
                Fermer
            </Button>

            <LinearGradient start={{x: 0., y: 0.25}} end={{x: 1, y: 1.0}} colors={['#000', app_color_main, '#000']} style={{marginHorizontal: 10, marginBottom: 20, borderRadius: 0, paddingVertical: 7, paddingHorizontal: 10}}>
                <TouchableOpacity
                    onPress={()=>{
                        props.getMeetingId()
                    }}
                    style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3, paddingVertical: 10, borderColor: '#eee', borderBottomWidth: 0 }}
                >
                    {props.loading && (
                        <ActivityIndicator color='#FFF' style={{marginRight: 8}} />
                    )}
                    <Text style={{color: '#FFF', fontWeight: '600'}}>Créer un Live</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* <TouchableOpacity
                onPress={() => {
                    props.getMeetingId();
                }}
                style={{ backgroundColor: "#1178F8", padding: 12, borderRadius: 6 }}
            >
                <ActivityIndicator />
                <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
                    Create Meeting
                </Text>
            </TouchableOpacity> */}

            <Text
                style={{
                    alignSelf: "center",
                    fontSize: 22,
                    marginVertical: 16,
                    fontStyle: "italic",
                    color: "grey",
                }}
            >
                ---------- OU ----------
            </Text>
            <TextInput
                value={meetingVal}
                onChangeText={setMeetingVal}
                placeholder={"XXXX-XXXX-XXXX"}
                placeholderTextColor='grey'
                style={{
                    padding: 12,
                    borderWidth: 1,
                    borderRadius: 6,
                    fontStyle: "italic",
                    borderColor: 'grey',
                    color: '#FFF'
                }}
            />

            <LinearGradient start={{x: 0., y: 0.25}} end={{x: 1, y: 1.0}} colors={['#000', app_color_main, '#000']} style={{marginHorizontal: 10, marginBottom: 20, marginTop: 14, borderRadius: 0, paddingVertical: 7, paddingHorizontal: 10}}>
                <TouchableOpacity
                    onPress={() => {
                        props.getMeetingId(meetingVal);
                    }}
                    style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3, paddingVertical: 10, borderColor: '#eee', borderBottomWidth: 0 }}
                >
                    <Text style={{color: '#FFF', fontWeight: '600'}}>Joindre le Live</Text>
                </TouchableOpacity>
            </LinearGradient>

            {/* <TouchableOpacity
                style={{
                    backgroundColor: "#1178F8",
                    padding: 12,
                    marginTop: 14,
                    borderRadius: 6,
                }}
                onPress={() => {
                    props.getMeetingId(meetingVal);
                }}
            >
                <Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
                    Join Meeting
                </Text>
            </TouchableOpacity> */}
        </SafeAreaView>
    );
}