import React, {useEffect, useContext} from 'react';
import {View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LucasContext} from '../../support/Contexts';
import {Box, Text} from 'native-base';
const UserDetail = () => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  useEffect(() => {
    setUserLucas(userLucas);
  });

  return (
    <>
      <Box flex={1} alignItems={'center'}>
        <Box marginBottom={'10%'} marginTop={'auto'} justifyContent={'center'}>
          <Box alignItems="center">
            {userLucas.photo !== undefined && userLucas.photo != '' ? (
              <Image
                source={{
                  uri: userLucas.photo,
                }}
                style={{width: 70, height: 70, borderRadius: 35}}
              />
            ) : (
              <Icon name="user" size={80} color="black" />
            )}
          </Box>
          <Text fontSize={'xl'} bold textAlign={'center'}>
            {userLucas.firstName + ' ' + userLucas.lastName}
          </Text>
          <Text
            fontSize={'md'}
            color={'coolGray.500'}
            bold
            textAlign={'center'}>
            Entrenos finalizados: {userLucas.trainings}
          </Text>
        </Box>
      </Box>
    </>
  );
};
export default UserDetail;
