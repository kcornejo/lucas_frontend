import React, {useState} from 'react';
import ModalLoad from '../support/ModalLoad';
import {Pressable, Text, Modal, SafeAreaView, Alert, View} from 'react-native';
import {styles} from './Styles';
import {BASE_URL} from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';
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
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var raw = JSON.stringify({
      email: data.Correo.toString().trim(),
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    console.log(BASE_URL);
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
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            <Pressable onPress={funRegresar} style={{width: 70}}>
              <Icon
                name={'arrow-circle-left'}
                size={70}
                color="white"
                style={styles.inputIconBack}
              />
            </Pressable>
          </View>
          <View style={{flex: 7}}>
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
            <Pressable
              onPress={handleSubmit(RecuperarClave)}
              style={styles.button}>
              <Text style={styles.textButton}>Recuperar</Text>
            </Pressable>
          </View>
        </View>

        <ModalLoad viewed={modalLoadVisible} />
      </SafeAreaView>
    </Modal>
  );
};
export default RecoverPassword;
