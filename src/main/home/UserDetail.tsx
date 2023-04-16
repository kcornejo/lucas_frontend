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
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {userLucas.photo !== undefined && userLucas.photo != '' ? (
            <Image
              source={{
                uri: userLucas.photo,
              }}
              style={{width: 90, height: 90, borderRadius: 45}}
            />
          ) : (
            <Icon name="user" size={80} color="black" />
          )}
        </View>
        <View style={{flex: 4, width: '100%'}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1}}></View>
            <View
              style={{
                flex: 1,
                marginLeft: 5,
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 25,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                {userLucas.firstName + ' ' + userLucas.lastName}
              </Text>
            </View>
            <View style={{flex: 1, marginLeft: 5, width: '100%'}}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'grey',
                  fontWeight: '500',
                }}>
                Entrenos finalizados: {userLucas.trainings}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default UserDetail;
