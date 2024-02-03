import React, {useState} from 'react';
import ModalLoad from '../support/ModalLoad';
import {Alert} from 'react-native';
import {
  Modal,
  KeyboardAvoidingView,
  Box,
  ScrollView,
  Text,
  VStack,
  FormControl,
  Input,
  Pressable,
  Divider,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {new_user} from './Firebase';
import PasswordKC from '../components/PasswordKC';
import {validationsObjV2} from '../support/Support';
const RegisterUser = ({visible = false, setModalVisible}) => {
  const [error, setError] = useState({});
  const [form, setForm] = useState({});
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const funRegresar = () => {
    setModalVisible(false);
  };
  const RegistrarUsuario = async (data: any) => {
    setError(error => {
      return {};
    });
    const validation = validationsObjV2(data, [
      {
        isRequired: true,
        obj: 'Correo',
        regex: /\S+@\S+\.\S+/,
      },
      {
        isRequired: true,
        obj: 'Clave',
        regex: /[0-9a-zA-Z]{6,}/,
      },
      {
        isRequired: true,
        obj: 'Repita',
        regex: /[0-9a-zA-Z]{6,}/,
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
      setModalLoadVisible(true);
      if (data.Clave.toString() != data.Repita.toString()) {
        Alert.alert('Error', 'Las claves ingresadas no coinciden');
        setModalLoadVisible(false);
        return 0;
      }
      var raw = {
        email: data.Correo.toString().toLowerCase().trim(),
        password: data.Clave.toString(),
      };
      const retorno = await new_user(raw);
      try {
        if (retorno['code'] == '999') {
          if (retorno['message'].toString().search('already-in-use') >= 0) {
            Alert.alert('Error con registro', 'Correo usado anteriormente');
          } else {
            Alert.alert('Error con registro', retorno['message']);
          }
        } else if (retorno['code'] == '000') {
          setModalVisible(false);
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
    }
  };
  return (
    <Modal
      safeAreaBottom
      animationPreset="slide"
      isOpen={visible}
      size="full"
      h={'100%'}>
      <ModalLoad viewed={modalLoadVisible} />
      <KeyboardAvoidingView w={'100%'} style={{flex: 1}} behavior={'padding'}>
        <Box
          roundedTop={'2xl'}
          bg={'info.900'}
          style={{marginBottom: 0, marginTop: 'auto'}}>
          <ScrollView>
            <VStack alignItems={'center'} space={'5'} mx="10%">
              <Text
                fontSize={'2xl'}
                textAlign={'center'}
                color={'white'}
                bold
                mt={'5'}>
                Registro
              </Text>
              <FormControl isRequired isInvalid={'Correo' in error}>
                <FormControl.Label _text={{color: 'white', fontWeight: 'bold'}}>
                  Correo
                </FormControl.Label>
                <Input
                  rounded={10}
                  height={10}
                  bgColor={'white'}
                  value={form.Correo}
                  placeholder="Correo"
                  onChangeText={value => setForm({...form, Correo: value})}
                  InputLeftElement={
                    <Pressable pl={3}>
                      <Icon name="inbox" size={30} color="grey"></Icon>
                    </Pressable>
                  }
                />
                {'Correo' in error && (
                  <FormControl.ErrorMessage>
                    {error.Correo}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={'Clave' in error}>
                <FormControl.Label _text={{color: 'white', fontWeight: 'bold'}}>
                  Password
                </FormControl.Label>
                <PasswordKC
                  value={form.Clave}
                  placeholder={'Password'}
                  setValue={value => {
                    setForm({...form, Clave: value});
                  }}
                />
                {'Clave' in error && (
                  <FormControl.ErrorMessage>
                    {error.Clave}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={'Repita' in error}>
                <FormControl.Label _text={{color: 'white', fontWeight: 'bold'}}>
                  Repita Password
                </FormControl.Label>
                <PasswordKC
                  value={form.Repita}
                  placeholder={'Password'}
                  setValue={value => {
                    setForm({...form, Repita: value});
                  }}
                />
                {'Repita' in error && (
                  <FormControl.ErrorMessage>
                    {error.Repita}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <Pressable
                w={'90%'}
                rounded={'2xl'}
                mt={5}
                onPress={() => {
                  RegistrarUsuario(form);
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
                        textAlign={'center'}>
                        Registrarse
                      </Text>
                    </Box>
                  );
                }}
              </Pressable>
              <Divider />
              <Box alignItems={'center'} w="100%" mb={6}>
                <Text color="white" bold fontSize="md">
                  ¿Ya tienes una cuenta?
                </Text>
                <Pressable onPress={funRegresar}>
                  <Text fontSize={'md'} bold color="tertiary.500">
                    ¡Ingresa!
                  </Text>
                </Pressable>
              </Box>
            </VStack>
          </ScrollView>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default RegisterUser;
