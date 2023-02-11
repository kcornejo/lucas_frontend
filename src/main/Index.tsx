import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './SettingsScreen';
const Tab = createBottomTabNavigator();
let setLogueado = null;
const Historial = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Historial!</Text>
    </View>
  );
};
const HomeScreen = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home!</Text>
    </View>
  );
};
const SettingsScreenIndex = () => {
  return <SettingsScreen setLogueado={setLogueado} />;
};
const Index = ({setLogueado: setLoqueadoSet}) => {
  setLogueado = setLoqueadoSet;
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({route}) => ({
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
            color = 'tomato';
          } else {
            color = 'grey';
          }
          if (route.name === 'Inicio') {
            return (
              <View
                style={{
                  backgroundColor: '#F2F2F2',
                  borderRadius: 80,
                  width: 90,
                  height: 90,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name={iconName} size={size} color={color} />
              </View>
            );
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Historial" component={Historial} />
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Configuración" component={SettingsScreenIndex} />
    </Tab.Navigator>
  );
};
export default Index;
