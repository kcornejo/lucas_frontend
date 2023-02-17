import React, {useState} from 'react';
import ModalLoad from '../support/ModalLoad';
import {Pressable, Text, Modal, SafeAreaView, Alert} from 'react-native';
import {styles} from './Styles';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useForm} from 'react-hook-form';
import InputKC from '../support/InputKC';
const RecoverPassword = ({visible = false, setModalVisible}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      Email: '',
    },
  });
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const funRegresar = () => {
    setModalVisible(false);
  };
  const RecuperarClave = async (data: any) => {
    reset();
    setModalLoadVisible(true);
    let token = await AsyncStorage.getItem('@token');
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      email: data.Correo,
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
        <InputKC
          control={control}
          icon="inbox"
          rules={{
            required: {value: true, message: 'Correo requerido.'},
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Ingrese un correo valido',
            },
          }}
          placeholder="Correo"
          name="Correo"
          secureTextEntry={false}
          error={errors.Correo}></InputKC>
        <Pressable onPress={handleSubmit(RecuperarClave)} style={styles.button}>
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
