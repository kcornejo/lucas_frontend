import React, {useState, useContext} from 'react';
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
import {login_firebase} from './Firebase';
import RecoverPassword from './RecoverPassword';
import RegisterUser from './RegisterUser';
import {useForm} from 'react-hook-form';
import InputKC from '../support/InputKC';
import {LucasContext} from '../support/Contexts';
const Login = () => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
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
    var raw = {
      email: user.toLowerCase().toString().trim(),
      password: password,
      phoneToken: tokenPhone,
    };
    const retorno = await login_firebase(raw);
    return retorno;
  };
  const ValidateLogin = async (data: any) => {
    setBloqueo(true);
    setModalVisible(true);

    //Login
    const retorno = await login_api(data.Usuario, data.Clave);
    setModalVisible(false);
    setBloqueo(false);
    if (retorno != null) {
      LoginApiScreen(retorno, data);
    } else {
      Alert.alert('Error', 'Error de comunicación.');
    }
  };
  const LoginApiScreen = (retorno: any, data: any) => {
    try {
      if (retorno['code'] == '999') {
        Alert.alert(
          'Credenciales invalidas',
          'Ingrese sus credenciales correctamente',
        );
      } else if (retorno['code'] == '001') {
        Alert.alert(
          'Error de usuario',
          'Usuario no validado, por favor revise su email',
        );
      } else if (retorno['code'] == '000') {
        setUserLucas(userLucas => {
          return {
            ...userLucas,
            auth: true,
            email: data.Usuario.toString().toLowerCase().trim(),
            token: retorno['token'],
            firstName:
              retorno['data'] != null && Object.keys(retorno['data']).length > 0
                ? retorno['data'].firstName
                : '',
            lastName:
              retorno['data'] != null && Object.keys(retorno['data']).length > 0
                ? retorno['data'].lastName
                : '',
            weight:
              retorno['data'] != null && Object.keys(retorno['data']).length > 0
                ? retorno['data'].weight
                : '',
            birthday:
              retorno['data'] != null && Object.keys(retorno['data']).length > 0
                ? retorno['data'].birthday
                : '',
            active:
              retorno['data'] != null && Object.keys(retorno['data']).length > 0
                ? retorno['data'].active
                : false,
            phone:
              retorno['data'] != null && Object.keys(retorno['data']).length > 0
                ? retorno['data'].phone
                : true,
            infoComplete: retorno['data'].infoComplete,
            admin: retorno['data'].admin,
            photo: retorno['data'].photo,
          };
        });
      } else {
        Alert.alert('Error', retorno['message']);
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
