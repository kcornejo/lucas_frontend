import React, {useEffect, useContext} from 'react';
import {View, Alert} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './setting/SettingsScreen';
import HomeScreen from './home/HomeScreen';
import History from './history/History';
import {LucasContext} from '../support/Contexts';
const Tab = createBottomTabNavigator();

const Index = () => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  useEffect(() => {
    let contador = 0;
    const max_time = 600;
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
    <Tab.Navigator
      initialRouteName="Inicio"
      sceneContainerStyle={{
        backgroundColor: 'white',
      }}
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home';
          } else if (route.name === 'Configuración') {
            iconName = 'cogs';
          } else if (route.name === 'Historial') {
            iconName = 'book';
          }
          if (focused) {
            color = 'white';
            return (
              <View
                style={{
                  backgroundColor: 'red',
                  borderRadius: 200,
                  width: 40,
                  height: 40,
                  paddingTop: 8,
                  paddingLeft: 7,
                }}>
                <Icon name={iconName} size={size} color={color} />
              </View>
            );
          } else {
            color = 'grey';
            return <Icon name={iconName} size={size} color={color} />;
          }
        },
        headerShown: false,
        tabBarStyle: {
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: '#121522',
          position: 'absolute',
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen name="Historial" component={Historial} />
      <Tab.Screen name="Inicio" component={HomeScreenIndex} />
      <Tab.Screen name="Configuración" component={SettingsScreenIndex} />
    </Tab.Navigator>
  );
};
export default Index;
