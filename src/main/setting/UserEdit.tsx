import React, {useState, useContext} from 'react';
import {Modal, Platform, Alert, Image} from 'react-native';
import {
  Box,
  VStack,
  Text,
  FormControl,
  Input,
  Pressable,
  Popover,
  Button,
} from 'native-base';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LucasContext} from '../../support/Contexts';
import {delete_user, fill_info_user} from '../../user/Firebase';
import ModalLoad from '../../support/ModalLoad';
import {validationsObjV2} from '../../support/Support';
const UserDetail = ({visible, setVisible}) => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [photo, setPhoto] = useState(null);
  const [modalLoadVisible, setModalLoadVisible] = useState(true);
  const [form, setForm] = useState({Telefono: userLucas.phone});
  const [error, setError] = useState({});
  const cargarImagen = async () => {
    await launchImageLibrary(
      {mediaType: 'photo', includeBase64: true},
      response => {
        if (response) {
          if (response.assets !== undefined) {
            let photoTemp = response.assets[0];
            photoTemp.uri =
              Platform.OS === 'ios'
                ? photoTemp.uri.replace('file://', '')
                : photoTemp.uri;
            setPhoto(photoTemp);
          }
        }
      },
    );
  };
  const guardar = async (data: any) => {
    setError(error => {
      return {};
    });
    const validation = validationsObjV2(data, [
      {
        isRequired: true,
        obj: 'Telefono',
        regex: /[0-9]{8}/,
      },
    ]);
    if (validation.error) {
      for (let i = 0; i < validation.list.length; i++) {
        setError(error => {
          return {
            ...error,
            [validation.list[i].obj]: validation.list[i].message,
          };
        });
      }
    } else {
      const request_firebase = async () => {
        if (photo == null) {
          var raw = {
            ...userLucas,
            phone: data.Telefono,
          };
        } else {
          var raw = {
            ...userLucas,
            phone: data.Telefono,
            photo: photo.base64,
            uploadPhoto: true,
          };
        }
        const retorno = await fill_info_user(raw);
        return retorno;
      };
      setModalLoadVisible(true);
      const retorno = await request_firebase();
      setModalLoadVisible(false);
      if (retorno != null) {
        if (retorno.code == '000') {
          if (photo != null) {
            setUserLucas(userLucas => {
              return {
                ...userLucas,
                photo: retorno.linkPhoto,
                phone: data.Telefono,
              };
            });
          } else {
            setUserLucas(userLucas => {
              return {
                ...userLucas,
                phone: data.Telefono,
              };
            });
          }
          setPhoto(null);
          Alert.alert(
            'Información cargada',
            'Informacion cargada correctamente',
          );
          setVisible(false);
        } else {
          Alert.alert('Error', 'Error ' + retorno.message);
        }
      } else {
        Alert.alert('Error', 'Error de comunicación.');
      }
    }
  };
  const eliminarCuenta = async () => {
    //Delete User Training
    await delete_user(userLucas);
    //Logout
    clearInterval(userLucas.timer);
    setUserLucas({
      firstName: '',
      lastName: '',
      email: '',
      weight: '',
      birthday: '',
      active: false,
      phone: '',
      infoComplete: false,
      auth: false,
      token: '',
    });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <Box safeAreaTop h={'100%'} bg="info.900">
        <ModalLoad viewed={true} />
        <VStack w={'90%'} space={5} mx={'5%'}>
          <Text
            textAlign={'center'}
            bold
            color={'white'}
            fontSize={'2xl'}
            mt={5}>
            Editar Información
          </Text>
          <FormControl isRequired isInvalid={'Telefono' in error}>
            <FormControl.Label _text={{color: 'white', fontWeight: 'bold'}}>
              Teléfono
            </FormControl.Label>
            <Input
              rounded={10}
              height={10}
              bgColor={'white'}
              value={form.Telefono}
              placeholder="Teléfono"
              onChangeText={value => setForm({...form, Telefono: value})}
              InputLeftElement={
                <Box ml={3}>
                  <Icon name="phone" size={30} color="grey"></Icon>
                </Box>
              }
            />
            {'Telefono' in error && (
              <FormControl.ErrorMessage>
                {error.Telefono}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
          <Box w={'100%'} flexDirection={'row'}>
            <Box flex={1} mx={2}>
              <Pressable onPress={cargarImagen}>
                {({isHovered, isFocused, isPressed}) => {
                  return (
                    <Box
                      bg={
                        isPressed
                          ? 'coolGray.700'
                          : isHovered
                          ? 'coolGray.700'
                          : 'coolGray.600'
                      }
                      style={{
                        transform: [
                          {
                            scale: isPressed ? 0.96 : 1,
                          },
                        ],
                      }}
                      rounded={'2xl'}
                      shadow={3}
                      borderWidth="1"
                      borderColor="coolGray.300"
                      alignItems={'center'}
                      justifyContent={'center'}
                      py={5}>
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
                    </Box>
                  );
                }}
              </Pressable>
            </Box>
            <Box flex={1} mx={2}>
              {photo && (
                <>
                  <Image
                    source={{uri: photo.uri}}
                    style={{width: 150, height: 150, borderRadius: 75}}
                  />
                </>
              )}
              {!photo && userLucas.photo != '' && (
                <>
                  <Image
                    source={{
                      uri: userLucas.photo,
                    }}
                    style={{width: 150, height: 150, borderRadius: 75}}
                  />
                </>
              )}
            </Box>
          </Box>
          <Box w={'100%'} alignItems={'center'}>
            <Pressable
              w={'90%'}
              mt={5}
              onPress={() => {
                guardar(form);
              }}>
              {({isHovered, isFocused, isPressed}) => {
                return (
                  <Box
                    bg={
                      isPressed
                        ? 'tertiary.500'
                        : isHovered
                        ? 'tertiary.500'
                        : 'tertiary.400'
                    }
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                    p="2"
                    rounded={'2xl'}
                    shadow={3}
                    borderWidth="1"
                    borderColor="coolGray.300">
                    <Text
                      color="coolGray.800"
                      fontWeight="medium"
                      fontSize="xl"
                      textAlign={'center'}
                      color="white">
                      Editar
                    </Text>
                  </Box>
                );
              }}
            </Pressable>
            <Pressable
              w={'90%'}
              mt={10}
              onPress={() => {
                setVisible(false);
                setPhoto(null);
              }}>
              {({isHovered, isFocused, isPressed}) => {
                return (
                  <Box
                    bg={
                      isPressed
                        ? 'coolGray.700'
                        : isHovered
                        ? 'coolGray.700'
                        : 'coolGray.600'
                    }
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                    p="2"
                    rounded={'2xl'}
                    shadow={3}
                    borderWidth="1"
                    borderColor="coolGray.300">
                    <Text
                      color="coolGray.800"
                      fontWeight="medium"
                      fontSize="xl"
                      textAlign={'center'}
                      color="white">
                      Regresar
                    </Text>
                  </Box>
                );
              }}
            </Pressable>
            <Box w={'90%'} mt={10}>
              <Popover
                trigger={triggerProps => {
                  return (
                    <Pressable {...triggerProps}>
                      {({isHovered, isFocused, isPressed}) => {
                        return (
                          <Box
                            bg={
                              isPressed
                                ? 'red.700'
                                : isHovered
                                ? 'red.700'
                                : 'red.600'
                            }
                            style={{
                              transform: [
                                {
                                  scale: isPressed ? 0.96 : 1,
                                },
                              ],
                            }}
                            p="2"
                            rounded={'2xl'}
                            shadow={3}
                            borderWidth="1"
                            borderColor="coolGray.300">
                            <Text
                              fontWeight="medium"
                              fontSize="xl"
                              textAlign={'center'}
                              color="white">
                              Borrar Cuenta
                            </Text>
                          </Box>
                        );
                      }}
                    </Pressable>
                  );
                }}>
                <Popover.Content accessibilityLabel="Borrar Cuenta" mb={10}>
                  <Popover.CloseButton />
                  <Popover.Header>Eliminación de Cuenta</Popover.Header>
                  <Popover.Body>
                    Si continuas, considera que tus datos de usuario no se
                    podrán recuperar. ¿Deseas continuar?
                  </Popover.Body>
                  <Popover.Footer justifyContent="flex-end">
                    <Button.Group space={2}>
                      <Button onPress={eliminarCuenta} colorScheme="red">
                        Continuar
                      </Button>
                    </Button.Group>
                  </Popover.Footer>
                </Popover.Content>
              </Popover>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Modal>
  );
};
export default UserDetail;
