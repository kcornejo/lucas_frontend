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
  TouchableHighlight,
} from 'react-native';
import {requestUserPermission} from '../support/Notification';

import RecoverPassword from './RecoverPassword';
import RegisterUser from './RegisterUser';
import {useForm} from 'react-hook-form';
import InputKC from '../support/InputKC';
import {BASE_URL} from '@env';
const Login = ({setUserLucas}) => {
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
  const login_api = async (user: string, password: string) => {
    const tokenPhone = await requestUserPermission();
    var myHeaders = new Headers();
    let retorno = null;
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      email: user.toLowerCase().toString().trim(),
      password: password,
      phoneToken: tokenPhone,
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    console.log(BASE_URL);
    await fetch(BASE_URL + '/api/login', requestOptions)
      .then(response => response.text())
      .then(result => {
        retorno = result;
      })
      .catch(error => {
        if (error.message.toString().search('request fail')) {
          retorno = JSON.stringify({
            code: '990',
            message: 'Error de red. Por favor valide su conexión.',
          });
        } else {
          retorno = JSON.stringify({code: '990', message: error.message});
        }
      });
    return retorno;
  };
  const ValidateLogin = async (data: any) => {
    setBloqueo(true);
    setModalVisible(true);

    //Login
    const retorno = await login_api(data.Usuario, data.Clave);
    LoginApiScreen(retorno, data);
  };
  const LoginApiScreen = (retorno: any, data: any) => {
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
      } else if (json_resp['code'] == '000') {
        setUserLucas(userLucas => {
          return {
            ...userLucas,
            auth: true,
            email: data.Usuario.toString().toLowerCase().trim(),
            token: json_resp['token'],
            firstName:
              json_resp['data'] != null &&
              Object.keys(json_resp['data']).length > 0
                ? json_resp['data'].firstName
                : '',
            lastName:
              json_resp['data'] != null &&
              Object.keys(json_resp['data']).length > 0
                ? json_resp['data'].lastName
                : '',
            weight:
              json_resp['data'] != null &&
              Object.keys(json_resp['data']).length > 0
                ? json_resp['data'].weight
                : '',
            birthday:
              json_resp['data'] != null &&
              Object.keys(json_resp['data']).length > 0
                ? json_resp['data'].birthday
                : '',
            active:
              json_resp['data'] != null &&
              Object.keys(json_resp['data']).length > 0
                ? json_resp['data'].active
                : false,
            phone:
              json_resp['data'] != null &&
              Object.keys(json_resp['data']).length > 0
                ? json_resp['data'].phone
                : true,
            infoComplete: json_resp['data'].infoComplete,
            admin: json_resp['data'].admin,
            photo: json_resp['data'].photo,
          };
        });
      } else {
        Alert.alert('Error', json_resp['message']);
      }
    } catch (e) {
      Alert.alert('Error', 'Error de comunicación ' + e.message);
    }
    setModalVisible(false);
    setBloqueo(false);
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
      <TouchableHighlight
        activeOpacity={0.85}
        underlayColor={'#98FFF6'}
        style={styles.button}
        onPress={handleSubmit(ValidateLogin)}
        disabled={bloqueo}>
        <Text style={styles.textButton}>Acceder</Text>
      </TouchableHighlight>
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
