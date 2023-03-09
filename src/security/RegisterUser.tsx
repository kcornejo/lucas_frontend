import React, {useState} from 'react';
import ModalLoad from '../support/ModalLoad';
import {Pressable, Text, Modal, SafeAreaView, Alert, View} from 'react-native';
import {styles} from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import InputKC from '../support/InputKC';
import {useForm} from 'react-hook-form';
import {RequestApiAsync} from '../support/Support';
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
    if (data.Clave.toString() != data.Repita.toString()) {
      Alert.alert('Error', 'Las claves ingresadas no coinciden');
      setModalLoadVisible(false);
      return 0;
    }
    var raw = JSON.stringify({
      email: data.Correo.toString().toLowerCase().trim(),
      password: data.Clave.toString(),
    });
    const retorno = await RequestApiAsync({
      method: 'POST',
      url: '/api/newUser',
      body: raw,
      login: false,
      userLucas: {},
      setUserLucas: null,
    });
    try {
      let json_resp = JSON.parse(retorno);
      if (json_resp['code'] == '999') {
        if (json_resp['message'].toString().search('already-in-use') >= 0) {
          Alert.alert('Error con registro', 'Correo usado anteriormente');
        } else {
          Alert.alert('Error con registro', json_resp['message']);
        }
      } else if (json_resp['code'] == '000') {
        setModalVisible(false);
        reset();
        Alert.alert(
          'Usuario registrado',
          'Usuario registrado, por favor valide su email.',
        );
      }
      setModalLoadVisible(false);
    } catch (e) {
      setModalLoadVisible(false);
      Alert.alert('Error con registro', 'Error de comunicación');
    }
  };
  return (
    <Modal animationType="slide" visible={visible}>
      <SafeAreaView style={styles.background}>
        <ModalLoad viewed={modalLoadVisible} />
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            <Pressable onPress={funRegresar} style={{width: 12}}>
              <Icon
                name={'arrow-circle-left'}
                size={70}
                color="white"
                style={styles.inputIconBack}
              />
            </Pressable>
          </View>
          <View style={{flex: 10}}>
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
                required: {
                  value: true,
                  message: 'Clave de confirmación requerido',
                },
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
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
export default RegisterUser;
