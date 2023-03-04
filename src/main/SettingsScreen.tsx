import React, {useState} from 'react';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserEdit from './UserEdit';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginTop: 12,
    fontSize: 18,
    height: 44,
    color: 'grey',
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    height: 50,
  },
  inputIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    paddingTop: 10,
    marginLeft: 10,
  },
});
const SettingsScreen = ({setUserLucas, userLucas}) => {
  const funHistory = () => {};
  const admin = userLucas.admin;
  const [modalEdit, setModalEdit] = useState(false);
  const funEditUser = () => {
    setModalEdit(true);
  };
  const logout = () => {
    Alert.alert('Cerrar sesión', '¿Desea cerrar la sesión?', [
      {
        text: 'Si',
        onPress: () => {
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
      {
        text: 'No',
      },
    ]);
  };
  return (
    <SafeAreaView style={{backgroundColor: '#191B2C', height: '100%'}}>
      <UserEdit
        visible={modalEdit}
        setVisible={setModalEdit}
        userLucas={userLucas}
        setUserLucas={setUserLucas}
      />
      <View style={{margin: 30, flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 2}}>
          <Text style={{fontWeight: '600', color: 'white', fontSize: 40}}>
            Configuración
          </Text>
          <Text
            style={{
              fontWeight: '400',
              color: '#818187',
              fontSize: 20,
              marginTop: 10,
            }}></Text>
        </View>
        <View style={{flex: 6}}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1}}>
              <TouchableHighlight
                activeOpacity={0.85}
                underlayColor={'#6166A8'}
                onPress={funEditUser}
                style={{
                  width: '100%',
                  borderRadius: 10,
                  borderColor: 'black',
                  backgroundColor: '#36395E',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    margin: 10,
                  }}>
                  <Icon name="pencil" size={80} color="white" />
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      height: 30,
                      fontWeight: '800',
                      fontSize: 13,
                      marginTop: 10,
                      width: '100%',
                    }}>
                    Editar Información
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
            <View style={{flex: 1}}>
              <TouchableHighlight
                activeOpacity={0.85}
                underlayColor={'#6166A8'}
                onPress={logout}
                style={{
                  width: '100%',
                  borderRadius: 10,
                  borderColor: 'black',
                  backgroundColor: '#36395E',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    margin: 10,
                  }}>
                  <Icon name="key" size={80} color="white" />
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      height: 30,
                      fontWeight: '800',
                      fontSize: 13,
                      marginTop: 10,
                      width: '100%',
                    }}>
                    Cerrar Sesion
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SettingsScreen;
