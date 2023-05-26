import React, {useEffect, useContext, useState} from 'react';
import {View, Alert} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './setting/SettingsScreen';
import HomeScreen from './home/HomeScreen';
import History from './history/History';
import {LucasContext} from '../support/Contexts';
import {Box, HStack, Text, Pressable, Center} from 'native-base';
const Tab = createBottomTabNavigator();

const Index = () => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [option, setOption] = useState(0);
  useEffect(() => {
    let contador = 0;
    const max_time = 6000000;
    const timer = setInterval(() => {
      contador++;
      if (contador >= max_time) {
        clearInterval(timer);
        Alert.alert('Cerrar sesión', 'Se cerrará la sesión por seguridad', [
          {
            text: 'Ok',
            onPress: () => {
              contador = 0;
              setUserLucas({
                firstName: '',
                lastName: '',
                email: '',
                weight: '',
                birthday: '',
                active: false,
                phone: '',
                infoComplete: false,
                auth: false,
                token: '',
              });
            },
          },
        ]);
      }
    }, 1000);
    setUserLucas(userLucas => {
      return {...userLucas, timer: timer};
    });
  }, [1]);
  const Historial = () => {
    return <History />;
  };
  const HomeScreenIndex = () => {
    return <HomeScreen />;
  };
  const SettingsScreenIndex = () => {
    return <SettingsScreen />;
  };
  return (
    <Box flex={1} w={'100%'}>
      <Box h={'100%'}>
        <Box flex={1} h={'92%'}>
          {option === 0 ? <HomeScreen /> : <History />}
        </Box>
        <Box w={'100%'} h={'8%'}>
          <HStack bg={'#121522'} alignItems="center" shadow={6} h={'100%'}>
            <Pressable
              flex={1}
              onPress={() => {
                setOption(1);
              }}>
              <Center>
                <Box
                  p={1.5}
                  rounded={'full'}
                  bg={option === 1 ? 'red.500' : 'transparent'}>
                  <Icon name="book" size={30} color="white" />
                </Box>
              </Center>
            </Pressable>
            <Pressable
              flex={1}
              onPress={() => {
                setOption(0);
              }}>
              <Box>
                <Center>
                  <Box
                    p={1.5}
                    rounded={'full'}
                    bg={option === 0 ? 'red.500' : 'transparent'}>
                    <Icon name="home" size={30} color="white" />
                  </Box>
                </Center>
              </Box>
            </Pressable>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};
export default Index;
