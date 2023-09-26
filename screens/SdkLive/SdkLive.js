import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { MeetingProvider } from "@videosdk.live/react-native-sdk";
import { createMeeting } from "./components/ApiVideoSdkLive";
import { useDispatch, useSelector } from "react-redux";
import { MeetingView } from "./components/MeetingView";
import { JoinScreen } from "./components/JoinScreen";
import { setVideoSdkToken } from "../../feature/videosdk.authtoken.slice";

export default function SdkLive({ navigation }) {
  const authToken = useSelector((state) => state.videosdk.token)

  const [loading, setLoading] = useState(false)

  const [meetingId, setMeetingId] = useState(null);

  const getMeetingId = async (id) => {
    setLoading(true)
    const meetingId = id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
    setLoading(false)
  };

  const resetMeetingId = () => {
    setMeetingId(null)
  }

  useEffect(() => {
    console.log('authToken: ', authToken)
  }, [authToken])

  return meetingId ? (
    <SafeAreaView 
      style={{ 
        flex: 1, 
        backgroundColor: "#F6F6FF" ,
        // backgroundColor: 'red'
      }}
    >
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: false,
          webcamEnabled: true,
          name: "Test User",
        }}
        token={authToken}
      >
        <MeetingView resetMeetingId={resetMeetingId} />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <JoinScreen getMeetingId={getMeetingId} navigation={navigation} loading={loading} />
  );
}