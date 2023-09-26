import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { HelperText, TextInput, Button } from 'react-native-paper';

const TextInputRN = ({label, inputs, errors, tag, helpText, onHandleChangeText, secure=false, keyboardType='default', contentContainerStyle={}, ...props}) => {
    const [visible, setVisible] = useState(false)

    return (
        <View style={[styles.contentContainerInput, contentContainerStyle]}>
            <TextInput
                secureTextEntry={secure && !visible}
                right={secure?<TextInput.Icon icon="eye" onPress={()=>setVisible(!visible)} />:undefined}
                label={label} 
                value={inputs[tag]} 
                onChangeText={(text) => onHandleChangeText(tag, text)} 
                error={errors[tag]!=null}
                keyboardType={keyboardType}
                keyboardAppearance='dark'
                {...props}
                // keyboardType=''
            />
            {errors[tag]!=null && (
                <HelperText type="error" visible={errors[tag]!=null} style={{ marginBottom:5, fontSize: 15 }}>
                    {errors[tag]}
                </HelperText>
            )}
            {helpText && (
                <HelperText type='info' visible style={{ color: '#FFFFFF', marginTop: 0, borderWidth:1, borderColor: 'red', padding: 0, margin: 0 }}>
                    {helpText}
                </HelperText>
            )}
        </View>
    )
}

// props.TextInputRN={
// }

export default TextInputRN

const styles = StyleSheet.create({
    contentContainerInput: {
        // marginHorizontal: 20,
        // marginBottom: 5
    }
})