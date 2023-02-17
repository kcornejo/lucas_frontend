import React from 'react';
import {View, Text, SafeAreaView, FlatList, Pressable} from 'react-native';
import {styles} from './Styles';
import {useForm} from 'react-hook-form';
import InputKC from '../support/InputKC';
import ModalLoad from '../support/ModalLoad';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {BASE_URL} from '@env';
const FillInformation = ({email, setInfoLlena, setUsuario}) => {
  const [modalVisible, setModalVisible] = useState(false);
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
  const guardarInfo = async (data: any) => {
    let token = await AsyncStorage.getItem('@token');
    setModalVisible(true);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      firstName: data.Nombre.toString(),
      lastName: data.Apellido.toString(),
      birthday: data.FechaNacimiento.toString(),
      phone: data.Telefono.toString(),
      weight: data.Peso.toString(),
      email: email.toString(),
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(BASE_URL + '/api/user/updateUser', requestOptions)
      .then(response => response.text())
      .then(result => {
        let json_resp = JSON.parse(result);
        if (json_resp['code'] == '999') {
          Alert.alert('Error con actualización', json_resp['message']);
        } else if (json_resp['code'] == '000') {
          setUsuario(data.Nombre.toString() + ' ' + data.Apellido.toString());
          reset();
          Alert.alert(
            'Usuario actualizado',
            'Usuario actualizado correctamente.',
          );
          setModalVisible(false);
          setInfoLlena(true);
        }
      })
      .catch(error => {
        setModalVisible(false);
        Alert.alert('Error', error.message);
      });
    setModalVisible(false);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#24253d'}}>
      <ModalLoad viewed={modalVisible} />
      <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
        <Text style={styles.title}>Más Información</Text>
        <Text style={styles.subtitle}>
          Por favor llene las siguientes casillas con su información
        </Text>
      </View>
      <FlatList
        data={[
          {
            icon: 'user',
            placeholder: 'Nombre',
            name: 'Nombre',
            rule: {
              required: {value: true, message: 'Nombre requerido.'},
            },
            error: errors.Nombre,
          },
          {
            icon: 'user',
            placeholder: 'Apellido',
            name: 'Apellido',
            rule: {
              required: {value: true, message: 'Apellido requerido.'},
            },
            error: errors.Apellido,
          },
          {
            icon: 'phone',
            placeholder: 'Telefono',
            name: 'Telefono',
            rule: {
              required: {value: true, message: 'Telefono requerido.'},
            },
            error: errors.Telefono,
          },
          {
            icon: 'calendar',
            placeholder: 'Fecha de Nacimiento',
            name: 'FechaNacimiento',
            rule: {
              required: {
                value: true,
                message: 'Fecha de Nacimiento requerido.',
              },
            },
            error: errors.FechaNacimiento,
          },
          {
            icon: 'balance-scale',
            placeholder: 'Peso (lbs)',
            name: 'Peso',
            rule: {
              required: {value: true, message: 'Peso requerido.'},
            },
            error: errors.Peso,
          },
        ]}
        renderItem={({item}) => (
          <InputKC
            control={control}
            icon={item.icon}
            rules={item.rule}
            placeholder={item.placeholder}
            name={item.name}
            secureTextEntry={false}
            error={item.error}></InputKC>
        )}
      />
      <View style={{flex: 3}}>
        <Pressable style={styles.button} onPress={handleSubmit(guardarInfo)}>
          <Text style={styles.textButton}>Guardar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
export default FillInformation;
