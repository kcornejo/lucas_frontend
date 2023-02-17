import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './SettingsScreen';
const UserDetail = ({usuario}) => {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: 'white',
        flex: 1,
      }}>
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="user" size={80} color="black" />
        </View>
        <View style={{flex: 3}}>
          <View style={{flex: 1, flexDirection: 'column', flexWrap: 'wrap'}}>
            <View style={{flex: 1}}></View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 25,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: 'black',
                }}>
                {usuario}
              </Text>
            </View>
            <View style={{flex: 1}}></View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default UserDetail;
