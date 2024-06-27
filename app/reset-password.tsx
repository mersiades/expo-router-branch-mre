import React, {FC} from 'react';
import {View, Text} from 'react-native'
import {useLocalSearchParams} from "expo-router";

const ResetPasswordScreen: FC = () => {
    const {token} = useLocalSearchParams<{ token?: string }>();

    return <View>
        <Text style={{color: 'blue'}}>Reset Password</Text>
        <Text style={{color: 'blue'}}>{`Token: ${token}`}</Text>
    </View>
}

export default ResetPasswordScreen