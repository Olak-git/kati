import React from 'react';
import { View, TextInput, ActivityIndicator, Pressable, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

// const SearchBarProps = {
//     containerStyle?: StyleProp<ViewStyle>,
//     iconSearchName?: string,
//     iconSearchColor?: string,
//     iconSearchSize?: number,
//     iconClearColor?: string,
//     iconClearSize?: number,
//     showLoading?: boolean,
//     loadingColor?: string,
//     placeholder?: string,
//     placeholderTextColor?: string,
//     onChangeText?: any,
//     value?: string | undefined,
//     inputContainerStyle?: StyleProp<ViewStyle>,
//     inputStyle?: StyleProp<TextStyle>,
//     onEndEditing?: any,
//     showCancel?: boolean,
//     cancelText?: string,
//     onCancel?: any,
//     cancelStyle?: StyleProp<ViewStyle>,
//     cancelTextStyle?: StyleProp<TextStyle>
// }
const SearchBar = ({ containerStyle, iconSearchName = 'search1', iconSearchColor = '#000000', iconSearchSize=25, iconClearColor, iconClearSize=20, showLoading = false, loadingColor = '#fef', placeholder, placeholderTextColor, onChangeText = () => {}, value, inputContainerStyle, inputStyle, onEndEditing = () => {}, showCancel = false, cancelText = 'Cancel', onCancel = () => {}, cancelStyle, cancelTextStyle }) => {
    const onClear = () => {
        onChangeText('')
    }

    return (
        <View style={[{flexDirection: 'row', alignItems: 'flex-end'}, {height: 50}, containerStyle ]}>
            <View style={[ {flex: 1, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: 'rgb(51, 65, 85)'}, {height: '100%'}, inputContainerStyle ]}>
                <View style={[ {width: 40} ]}>
                    <Icon 
                        name={iconSearchName}
                        size={iconSearchSize}
                        color={iconSearchColor} />
                </View>
                <TextInput
                    placeholder={ placeholder }
                    placeholderTextColor={placeholderTextColor}
                    onChangeText={onChangeText}
                    onEndEditing={onEndEditing}
                    // defaultValue={value}
                    value={value}
                    style={[ {flex: 1, paddingHorizontal: 4, color: 'rgb(75, 85, 99)'}, inputStyle ]} />
                {showLoading && (
                    <View style={[ {} ]}>
                        <ActivityIndicator 
                            size={20}
                            color={loadingColor} />
                    </View>
                )}
                {value !== '' && (
                    <Pressable
                        onPress={onClear}
                        style={[ {justifyContent: 'center'}, {width: 30, height: '100%'} ]}>
                        <Icon 
                            name='close' 
                            size={iconClearSize}
                            color={iconClearColor}
                            style={{textAlign: 'right'}} />
                    </Pressable>
                )}
            </View>
            {showCancel && (
                <Pressable onPress={onCancel} style={[ {justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, marginLeft: 12}, {height: '100%'}, cancelStyle ]}>
                    <Text style={[ cancelTextStyle ]}>{cancelText}</Text>
                </Pressable>
            )}
        </View>
    )
}

export default SearchBar;