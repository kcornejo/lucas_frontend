import React, {useState, useEffect} from 'react';
import ModalLoad from '../support/ModalLoad';
import {styles} from './Styles';
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';

import {BASE_URL} from '@env';
import RecoverPassword from './RecoverPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegisterUser from './RegisterUser';
import {useForm} from 'react-hook-form';
import InputKC from '../support/InputKC';
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
async function login_api(usuario: string, password: string) {
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
const Login = ({setLogueado, setEmail}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      Usuario: '',
      Clave: '',
    },
  });
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

  const ValidateLogin = async (data: any) => {
    setBloqueo(true);
    setModalVisible(true);
    const retorno = await login_api(data.Usuario, data.Clave);
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
        setLogueado(true);
        setEmail(data.Usuario.toString().toLowerCase());
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
    reset();
    setModalVisibleRecuperar(true);
  };
  const Registrarse = () => {
    reset();
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
      <View style={{alignItems: 'center'}}>
        <Image
          style={{width: 150, height: 130, resizeMode: 'stretch'}}
          source={require('../resources/images/logo-invertido.png')}
        />
      </View>
      <Text style={styles.titleLogo}>Acceso</Text>
      <InputKC
        control={control}
        icon="user"
        rules={{
          required: {value: true, message: 'Correo requerido'},
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Ingrese un correo valido',
          },
        }}
        placeholder="Correo"
        name="Usuario"
        secureTextEntry={false}
        error={errors.Usuario}></InputKC>
      <InputKC
        control={control}
        icon="lock"
        rules={{
          required: {value: true, message: 'Clave requerida.'},
          pattern: {
            value: /[0-9a-zA-Z]{6,}/,
            message: 'Ingrese una clave segura',
          },
        }}
        placeholder="Clave"
        name="Clave"
        secureTextEntry={true}
        error={errors.Clave}></InputKC>
      <Pressable
        style={styles.button}
        onPress={handleSubmit(ValidateLogin)}
        disabled={bloqueo}>
        <Text style={styles.textButton}>Acceder</Text>
      </Pressable>
      <View
        style={{
          borderBottomColor: 'grey',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: 20,
        }}
      />
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 1}}>
          <Pressable onPressIn={RecuperarClave} disabled={bloqueo}>
            <Text style={styles.textForgotPassword}>Olvide mi contraseña</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.bottom}>
        <Pressable
          style={styles.buttonRegistry}
          onPressIn={Registrarse}
          disabled={bloqueo}>
          <Text style={styles.textButton}>Registrarse</Text>
        </Pressable>
        <View>
          <Text style={styles.powered}>Powered by KC</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
