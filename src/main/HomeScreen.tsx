import React, {useState} from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  SafeAreaView,
  Linking,
} from 'react-native';
import UserDetail from './UserDetail';
import ModalNewExercise from './ModalNewExercise';
import {BASE_URL} from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';
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
    <SafeAreaView
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
      <UserDetail setUserLucas={setUserLucas} userLucas={userLucas} />
      <View
        style={{
          width: '100%',
          flex: 6,
          alignItems: 'center',
          borderTopStartRadius: 30,
          borderTopEndRadius: 30,
          backgroundColor: '#23263E',
        }}>
        <View style={{flex: 1, flexDirection: 'column', width: '100%'}}>
          <View style={{flex: 1}}></View>
          <View style={{flex: 1}}>
            <TouchableHighlight
              activeOpacity={0.85}
              underlayColor={'#98FFF6'}
              onPress={newExercise}
              style={{
                borderRadius: 10,
                borderColor: 'black',
                backgroundColor: '#17e9d7',
                alignItems: 'center',
                padding: 10,
                marginLeft: 20,
                marginRight: 20,
              }}>
              <>
                <Icon name="plus" size={80} color="black" />
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    height: 40,
                    fontWeight: '800',
                    fontSize: 15,
                    padding: 20,
                  }}>
                  Nuevo Entreno
                </Text>
              </>
            </TouchableHighlight>
          </View>
          <View style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <TouchableHighlight
                  activeOpacity={0.85}
                  underlayColor={'#444876'}
                  onPress={async () => {
                    const url = 'http://instagram.com';
                    const supported = await Linking.canOpenURL(url);
                    if (supported) {
                      await Linking.openURL(url);
                    } else {
                      console.warn('Error con el link');
                    }
                  }}
                  style={{
                    borderRadius: 10,
                    borderColor: 'black',
                    backgroundColor: '#36395E',
                    alignItems: 'center',
                    padding: 10,
                    width: '80%',
                    marginLeft: 20,
                  }}>
                  <>
                    <Icon name="instagram" size={80} color="#6459D7" />
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        height: 40,
                        fontWeight: '800',
                        fontSize: 15,
                        padding: 20,
                      }}>
                      Instagram
                    </Text>
                  </>
                </TouchableHighlight>
              </View>
              <View style={{flex: 1}}>
                <TouchableHighlight
                  activeOpacity={0.85}
                  underlayColor={'#444876'}
                  onPress={async () => {
                    const url = 'http://instagram.com';
                    const supported = await Linking.canOpenURL(url);
                    if (supported) {
                      await Linking.openURL(url);
                    } else {
                      console.warn('Error con el link');
                    }
                  }}
                  style={{
                    borderRadius: 10,
                    borderColor: 'black',
                    backgroundColor: '#36395E',
                    alignItems: 'center',
                    padding: 10,
                    width: '80%',
                    marginLeft: 20,
                  }}>
                  <>
                    <Icon name="whatsapp" size={80} color="#39D555" />
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        height: 40,
                        fontWeight: '800',
                        fontSize: 15,
                        padding: 20,
                      }}>
                      Whatsapp
                    </Text>
                  </>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <View style={{flex: 1}}></View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default HomeScreen;
