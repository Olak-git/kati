import { StyleSheet, Text, View, Modal, ActivityIndicator } from 'react-native'
import React from 'react'
import { app_color_main } from '../services/data'

const ModalLoad = ({visible}) => {
  return (
        <Modal
            visible={visible}
            animated
            animationType='fade'
            presentationStyle='overFullScreen'
            transparent
            onShow={(event) => console.log('Modal Visible')}
            onRequestClose={() => {
                console.log('Badge')
                // Alert.alert("Modal has been closed.");
                // setModalVisible(!modalVisible);
            }}
            // onDismiss={() => console.log('Badge')}
        >
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.5)'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator
                        size={'small'}
                        color='#FFF'
                        animating />
                </View>
            </View>
        </Modal>
  )
}

export default ModalLoad

const styles = StyleSheet.create({})