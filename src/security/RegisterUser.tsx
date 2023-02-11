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
const RegisterUser = ({visible = false, setModalVisible}) => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const funRegresar = () => {
    setModalVisible(false);
  };
  const RegistrarUsuario = async () => {
    setModalLoadVisible(true);
    let token = await AsyncStorage.getItem('@token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');
    if (password.toString() != passwordConfirmation.toString()) {
      Alert.alert('Error', 'Las claves ingresadas no coinciden');
      return 0;
    }
    var raw = JSON.stringify({
      email: correo,
      password: password,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    fetch(BASE_URL + '/api/newUser', requestOptions)
      .then(response => response.text())
      .then(result => {
        let json_resp = JSON.parse(result);
        if (json_resp['code'] == '999') {
          Alert.alert('Error con registro', json_resp['message']);
        } else if (json_resp['code'] == '000') {
          setCorreo('');
          setPassword('');
          setPasswordConfirmation('');
          Alert.alert(
            'Usuario registrado',
            'Usuario registrado, por favor valide su email.',
          );
          setModalVisible(false);
        }
        setModalLoadVisible(false);
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
        <Text style={styles.title}>Nuevo Usuario</Text>
        <View style={styles.inputComplete}>
          <Icon name="user" size={30} color="grey" style={styles.inputIcon} />
          <TextInput
            value={correo}
            onChangeText={setCorreo}
            style={styles.inputTextIcon}
            placeholder="Correo"
          />
        </View>
        <View style={styles.inputComplete}>
          <Icon name="lock" size={30} color="grey" style={styles.inputIcon} />
          <TextInput
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            placeholder="Clave"
            style={styles.inputTextIcon}></TextInput>
        </View>
        <View style={styles.inputComplete}>
          <Icon
            name="refresh"
            size={30}
            color="grey"
            style={styles.inputIcon}
          />
          <TextInput
            secureTextEntry={true}
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            placeholder="Repita su clave"
            style={styles.inputTextIcon}></TextInput>
        </View>
        <Pressable onPress={RegistrarUsuario} style={styles.button}>
          <Text style={styles.textButton}>Registrar</Text>
        </Pressable>
        <Pressable onPress={funRegresar} style={styles.buttonOlvide}>
          <Text style={styles.textButton}>Regresar</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};
export default RegisterUser;
