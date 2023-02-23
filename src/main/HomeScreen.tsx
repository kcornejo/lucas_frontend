import React, {useState} from 'react';
import {View, Pressable, Text, Modal} from 'react-native';
import UserDetail from './UserDetail';
import ModalNewExercise from './ModalNewExercise';
import {BASE_URL} from '@env';
import ModalLoad from '../support/ModalLoad';
import Support from '../support/Support';
const HomeScreen = ({userLucas, setUserLucas}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const [datosAgenda, setDatosAgenda] = useState([]);
  const newExercise = async () => {
    setModalLoadVisible(true);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + userLucas.token);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    console.log(BASE_URL);
    await fetch(
      BASE_URL + '/api/calendar/list?email=' + userLucas.email,
      requestOptions,
    )
      .then(response => response.text())
      .then(retorno => {
        setDatosAgenda(JSON.parse(retorno));
        setModalLoadVisible(false);
        setModalVisible(true);
      })
      .catch(error => {
        Support.ErrorToken({message: error.message, setUserLucas});
      });
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        marginTop: 15,
      }}>
      <ModalLoad viewed={modalLoadVisible} />
      <ModalNewExercise
        visible={modalVisible}
        setVisible={setModalVisible}
        datosAgenda={datosAgenda}
        userLucas={userLucas}
        setUserLucas={setUserLucas}
      />
      <UserDetail userLucas={userLucas} />
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
          onPress={newExercise}
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
export default HomeScreen;
