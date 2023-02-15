import React from 'react';
import {View, Text, SafeAreaView, Pressable} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from './SettingsScreen';
import UserDetail from './UserDetail';
const Tab = createBottomTabNavigator();
let setLogueado = null;
const Historial = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        marginTop: 15,
      }}>
      <UserDetail />
      <View style={{width: '100%', flex: 5}}></View>
    </View>
  );
};
const HomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        marginTop: 15,
      }}>
      <UserDetail />
      <View
        style={{
          width: '100%',
          flex: 5,
          alignItems: 'center',
          borderTopStartRadius: 30,
          borderTopEndRadius: 30,
          backgroundColor: '#23263E',
        }}>
        <Pressable
          style={{
            width: '80%',
            borderRadius: 10,
            borderColor: 'black',
            backgroundColor: '#17e9d7',
            marginTop: 50,
            height: 50,
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              height: 40,
              fontWeight: '800',
              fontSize: 20,
              marginTop: 10,
            }}>
            Agendar Entreno
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
const SettingsScreenIndex = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        marginTop: 15,
      }}>
      <UserDetail />
      <View style={{width: '100%', flex: 5}}>
        <SettingsScreen setLogueado={setLogueado} />
      </View>
    </View>
  );
};
const Index = ({setLogueado: setLoqueadoSet}) => {
  setLogueado = setLoqueadoSet;
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
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Configuración" component={SettingsScreenIndex} />
    </Tab.Navigator>
  );
};
export default Index;
