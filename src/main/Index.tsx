import React from 'react';
import {View, Text, SafeAreaView, Pressable} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './SettingsScreen';
import HomeScreen from './HomeScreen';
import History from './History';
const Tab = createBottomTabNavigator();

const Index = ({setUserLucas, userLucas}) => {
  const Historial = () => {
    return <History userLucas={userLucas} setUserLucas={setUserLucas} />;
  };
  const HomeScreenIndex = () => {
    return <HomeScreen userLucas={userLucas} setUserLucas={setUserLucas} />;
  };
  const SettingsScreenIndex = () => {
    return <SettingsScreen userLucas={userLucas} setUserLucas={setUserLucas} />;
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
