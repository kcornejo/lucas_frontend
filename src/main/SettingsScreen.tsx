import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const logout = () => {
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
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={[{key: 'Cerrar Sesion', icon: 'user', action: logout}]}
        renderItem={({item}) => (
          <Pressable style={styles.button} onPressIn={item.action}>
            <Text style={styles.item}>{item.key}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};
export default SettingsScreen;
