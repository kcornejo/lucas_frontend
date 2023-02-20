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
import Icon from 'react-native-vector-icons/FontAwesome';
import InputKC from '../support/InputKC';
import {useForm} from 'react-hook-form';
const RegisterUser = ({visible = false, setModalVisible}) => {
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
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const funRegresar = () => {
    setModalVisible(false);
  };
  const RegistrarUsuario = async (data: any) => {
    setModalLoadVisible(true);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    if (data.Clave.toString() != data.Repita.toString()) {
      Alert.alert('Error', 'Las claves ingresadas no coinciden');
      setModalLoadVisible(false);
      return 0;
    }
    var raw = JSON.stringify({
      email: data.Correo.toString().toLowerCase(),
      password: data.Clave.toString(),
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
          reset();
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
          name="Correo"
          secureTextEntry={false}
          error={errors.Correo}></InputKC>
        <InputKC
          control={control}
          icon="lock"
          rules={{
            required: {value: true, message: 'Clave requerida'},
            pattern: {
              value: /[0-9a-zA-Z]{6,}/,
              message: 'Ingrese una clave segura',
            },
          }}
          placeholder="Clave"
          name="Clave"
          secureTextEntry={true}
          error={errors.Clave}></InputKC>
        <InputKC
          control={control}
          icon="refresh"
          rules={{
            required: {value: true, message: 'Clave de confirmación requerido'},
            pattern: {
              value: /[0-9a-zA-Z]{6,}/,
              message: 'Ingrese una clave segura',
            },
          }}
          placeholder="Repita su clave"
          name="Repita"
          secureTextEntry={true}
          error={errors.Repita}></InputKC>
        <Pressable
          onPress={handleSubmit(RegistrarUsuario)}
          style={styles.button}>
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
