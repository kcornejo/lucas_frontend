import React, {useEffect, useContext} from 'react';
import {View, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LucasContext} from '../../support/Contexts';
const UserDetail = () => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  useEffect(() => {
    setUserLucas(userLucas);
  });

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
          {userLucas.photo !== undefined && userLucas.photo != '' ? (
            <Image
              source={{
                uri: userLucas.photo,
              }}
              style={{width: 80, height: 80}}
            />
          ) : (
            <Icon name="user" size={80} color="black" />
          )}
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
                {userLucas.firstName + ' ' + userLucas.lastName}
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
