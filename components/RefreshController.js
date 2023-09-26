import { View, Text, RefreshControl } from 'react-native'
import React from 'react'

export default function RefreshController({ refreshing, onRefresh }) {
    return (
        <RefreshControl
            colors={['red', 'blue', 'green']}
            tintColor='#fff'
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor='#ffffff'
        />
    )
}