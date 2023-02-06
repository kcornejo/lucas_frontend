import React, {useState, useEffect} from 'react';
import ModalLoad from '../support/ModalLoad';
import {styles} from './Styles';
import {
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import {BASE_URL} from '@env';
import RecoverPassword from './RecoverPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegisterUser from './RegisterUser';
let token = '';
async function validate_jwt() {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  fetch(BASE_URL + '/auth/new?username=123', requestOptions)
    .then(response => response.text())
    .then(result => {
      token = result.toString().slice(1, -1);
      AsyncStorage.setItem('@token', token);
    })
    .catch(error => {
      Alert.alert('Error', 'Error de comunicación' + error.toString());
    });
}
async function login_api(usuario, password) {
  var myHeaders = new Headers();
  let retorno = null;
  myHeaders.append('Authorization', 'Bearer ' + token.toString());
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    email: usuario,
    password: password,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  await fetch(BASE_URL + '/api/validateUser', requestOptions)
    .then(response => response.text())
    .then(result => {
      retorno = result;
    })
    .catch(error => {
      Alert.alert('Error', 'Error de comunicación' + error.toString());
    });
  return retorno;
}
const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [bloqueo, setBloqueo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleRecuperar, setModalVisibleRecuperar] = useState(false);
  const [modalVisibleRegister, setModalVisibleRegister] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      validate_jwt();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const ValidateLogin = async () => {
    setBloqueo(true);
    setModalVisible(true);
    const retorno = await login_api(usuario, password);
    try {
      let json_resp = JSON.parse(retorno);
      if (json_resp['code'] == '999') {
        Alert.alert(
          'Credenciales invalidas',
          'Ingrese sus credenciales correctamente',
        );
      } else if (json_resp['code'] == '001') {
        Alert.alert(
          'Error de usuario',
          'Usuario no validado, por favor revise su email',
        );
      } else {
        AsyncStorage.setItem('@login', '1');
      }
      setModalVisible(false);
      setBloqueo(false);
    } catch (e) {
      setModalVisible(false);
      setBloqueo(false);
      Alert.alert('Error', 'Error de comunicación');
    }
  };
  const RecuperarClave = () => {
    setUsuario('');
    setPassword('');
    setModalVisibleRecuperar(true);
  };
  const Registrarse = () => {
    setUsuario('');
    setPassword('');
    setModalVisibleRegister(true);
  };
  return (
    <SafeAreaView style={styles.background}>
      <RecoverPassword
        visible={modalVisibleRecuperar}
        setModalVisible={setModalVisibleRecuperar}
      />
      <RegisterUser
        visible={modalVisibleRegister}
        setModalVisible={setModalVisibleRegister}
      />
      <ModalLoad viewed={modalVisible} />
      <Text style={styles.title}>Acceso</Text>
      <TextInput
        placeholder="Correo"
        value={usuario}
        onChangeText={setUsuario}
        style={styles.inputText}></TextInput>
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        placeholder="Clave"
        style={styles.inputText}></TextInput>
      <Pressable
        style={styles.button}
        onPressIn={ValidateLogin}
        disabled={bloqueo}>
        <Text style={styles.textButton}>Acceder</Text>
      </Pressable>

      <Pressable
        style={styles.buttonOlvide}
        onPressIn={RecuperarClave}
        disabled={bloqueo}>
        <Text style={styles.textButton}>Recuperar clave</Text>
      </Pressable>
      <Pressable
        style={styles.buttonRegistrarse}
        onPressIn={Registrarse}
        disabled={bloqueo}>
        <Text style={styles.textButton}>Registrarse</Text>
      </Pressable>
      <View>
        <Text style={styles.powered}>Powered by KC</Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;
