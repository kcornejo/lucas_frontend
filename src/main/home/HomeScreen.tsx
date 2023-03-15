import React, {useState, useContext} from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import UserDetail from './UserDetail';
import ModalNewExercise from './ModalNewExercise';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalLoad from '../../support/ModalLoad';
import {LucasContext} from '../../support/Contexts';
import {list_schedule_avail} from './Firebase';
const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const [datosAgenda, setDatosAgenda] = useState([]);
  const [userLucas, setUserLucas] = useContext(LucasContext);

  const newExercise = async () => {
    setModalLoadVisible(true);
    const retorno = await list_schedule_avail({email: userLucas.email});
    try {
      setModalLoadVisible(false);
      if (retorno != null) {
        setDatosAgenda(retorno);
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'Error de comunicación.');
      }
    } catch (e) {
      console.warn(e.message);
    }
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
      />
      <UserDetail />
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
                    padding: 12,
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
                    const url = 'https://www.instagram.com/lucasgymgt/';
                    await Linking.openURL(url).catch(e => {
                      Alert.alert('Error', 'Error al abrir instagram.');
                    });
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
                        padding: 8,
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
                    const url =
                      'https://chat.whatsapp.com/FeTvB3EUnPG7QA8YUi7rpi';
                    await Linking.openURL(url).catch(e => {
                      Alert.alert(
                        'Error',
                        'Error al buscar el grupo de whatsapp.',
                      );
                    });
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
                        padding: 8,
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
