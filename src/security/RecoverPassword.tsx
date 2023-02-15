import React, {useState} from 'react';
import ModalLoad from '../support/ModalLoad';
import {
  Pressable,
  Text,
  TextInput,
  Modal,
  SafeAreaView,
  Alert,
  View,
} from 'react-native';
import {styles} from './Styles';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
const RecoverPassword = ({visible = false, setModalVisible}) => {
  const [correo, setCorreo] = useState('');
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const funRegresar = () => {
    setModalVisible(false);
  };
  const RecuperarClave = async () => {
    setModalLoadVisible(true);
    let token = await AsyncStorage.getItem('@token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      email: correo,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    fetch(BASE_URL + '/api/changePasswordReact', requestOptions)
      .then(response => response.text())
      .then(result => {
        setCorreo('');
        setModalLoadVisible(false);
        Alert.alert(
          'Clave enviada',
          'Clave enviada, por favor valide su email.',
        );
        setModalVisible(false);
      })
      .catch(error => {
        setModalLoadVisible(false);
        Alert.alert('Error', error);
      });
  };
  return (
    <Modal animationType="slide" visible={visible}>
      <SafeAreaView style={styles.background}>
        <ModalLoad viewed={modalLoadVisible} />
        <Text style={styles.title}>Recuperar Clave</Text>
        <View style={styles.inputComplete}>
          <Icon name="lock" size={30} color="grey" style={styles.inputIcon} />
          <TextInput
            value={correo}
            onChangeText={setCorreo}
            style={styles.inputTextIcon}
            placeholder="Correo"
            placeholderTextColor="grey"
          />
        </View>
        <Pressable onPress={RecuperarClave} style={styles.button}>
          <Text style={styles.textButton}>Recuperar</Text>
        </Pressable>
        <Pressable onPress={funRegresar} style={styles.buttonOlvide}>
          <Text style={styles.textButton}>Regresar</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};
export default RecoverPassword;
