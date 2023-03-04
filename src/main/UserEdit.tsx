import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  Text,
  Image,
  SafeAreaView,
  Platform,
  View,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import InputKC from '../support/InputKC';
import {useForm} from 'react-hook-form';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from './Styles';
import {BASE_URL} from '@env';
import Support from '../support/Support';
const UserDetail = ({visible, setVisible, userLucas, setUserLucas}) => {
  const [photo, setPhoto] = useState(null);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      Telefono: userLucas.phone,
    },
  });
  const cargarImagen = async () => {
    await launchImageLibrary(
      {mediaType: 'photo', includeBase64: true},
      response => {
        if (response) {
          let photoTemp = response.assets[0];
          photoTemp.uri =
            Platform.OS === 'ios'
              ? photoTemp.uri.replace('file://', '')
              : photoTemp.uri;
          setPhoto(photoTemp);
        }
      },
    );
  };
  const guardar = async (data: any) => {
    const request_api = async () => {
      var myHeaders = new Headers();
      let retorno = null;
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append('Authorization', 'Bearer ' + userLucas.token);
      if (photo == null) {
        var raw = JSON.stringify({
          ...userLucas,
          phone: data.Telefono,
        });
      } else {
        var raw = JSON.stringify({
          ...userLucas,
          phone: data.Telefono,
          photo: photo.base64,
          photoType: photo.type,
        });
      }

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      console.log(BASE_URL);
      await fetch(BASE_URL + '/api/user/updateUser', requestOptions)
        .then(response => response.text())
        .then(result => {
          if (result == 'Forbidden') {
            Support.ErrorToken({message: result, setUserLucas});
          } else {
            retorno = result;
          }
        })
        .catch(error => {
          Support.ErrorToken({message: error.message, setUserLucas});
        });
      return retorno;
    };
    const retorno = await request_api();
    if (retorno != null) {
      const resp_clean = JSON.parse(retorno);
      if (resp_clean.code == '000') {
        userLucas.phone = data.Telefono;
        if (photo != null) {
          userLucas.photo = photo.base64;
        }
        userLucas.firstName = 'q';
        setUserLucas(userLucas);
        reset();
        setPhoto(null);
        Alert.alert('Información cargada', 'Informacion cargada correctamente');
        setVisible(false);
      } else {
        Alert.alert('Error', 'Error ' + resp_clean.message);
      }
    }
  };

  return (
    <Modal visible={visible}>
      <SafeAreaView style={{backgroundColor: '#24263F'}}></SafeAreaView>
      <View
        style={{
          backgroundColor: '#24263F',
          flex: 1,
          flexDirection: 'column',
        }}>
        <View style={{flex: 1}}>
          <Pressable
            onPress={() => {
              setVisible(false);
              reset();
              setPhoto(null);
            }}
            style={{width: 70}}>
            <Icon
              name={'arrow-circle-left'}
              size={70}
              color="white"
              style={styles.inputIconBack}
            />
          </Pressable>
        </View>
        <View style={{flex: 2, marginTop: 20}}>
          <Text
            style={{
              color: 'white',
              fontSize: 35,
              fontWeight: 'bold',
              margin: 25,
            }}>
            Editar Información
          </Text>
          <Text
            style={{
              color: '#97979D',
              fontSize: 18,
              marginLeft: 25,
            }}>
            Formulario para editar la información
          </Text>
        </View>
        <View style={{flex: 5}}>
          <InputKC
            control={control}
            icon="phone"
            rules={{
              required: {value: true, message: 'Telefono requerido.'},
              pattern: {
                value: /[0-9]{8}/,
                message: 'Ingrese un telefono valido.',
              },
            }}
            placeholder="Telefono"
            name="Telefono"
            error={errors.Telefono}></InputKC>
          <View
            style={{
              height: '100%',
              marginTop: '5%',
              flex: 1,
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}}>
              <TouchableHighlight
                activeOpacity={0.85}
                underlayColor={'#444876'}
                onPress={cargarImagen}
                style={{
                  borderRadius: 10,
                  borderColor: 'black',
                  backgroundColor: '#36395E',
                  alignItems: 'center',
                  padding: 10,
                  width: 150,
                  height: 150,
                  marginLeft: 20,
                }}>
                <>
                  <Icon name="plus" size={80} color="white" />
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      height: 40,
                      fontWeight: '800',
                      fontSize: 15,
                      paddingTop: 15,
                    }}>
                    Cargar Imagen
                  </Text>
                </>
              </TouchableHighlight>
            </View>
            <View style={{flex: 1, marginLeft: 20}}>
              {photo && (
                <>
                  <Image
                    source={{uri: photo.uri}}
                    style={{width: 150, height: 150}}
                  />
                </>
              )}
            </View>
          </View>
        </View>
        <View style={{flex: 5}}>
          <TouchableHighlight
            activeOpacity={0.85}
            underlayColor={'#64BEB5'}
            style={styles.buttonNew}
            onPress={handleSubmit(guardar)}>
            <Text style={styles.textButton}>Guardar</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};
export default UserDetail;
