import React, {useState, useContext} from 'react';
import ModalLoad from '../support/ModalLoad';
import {Alert, Platform} from 'react-native';
import {requestUserPermission} from '../support/Notification';
import {login_firebase} from './Firebase';
import RecoverPassword from './RecoverPassword';
import RegisterUser from './RegisterUser';
import {LucasContext} from '../support/Contexts';
import Icon from 'react-native-vector-icons/FontAwesome';
import PasswordKC from '../components/PasswordKC';
import {
  Box,
  Input,
  FormControl,
  Image,
  Text,
  VStack,
  Pressable,
  Checkbox,
  HStack,
  KeyboardAvoidingView,
  ScrollView,
} from 'native-base';
import {validationsObjV2} from '../support/Support';
const Login = () => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [bloqueo, setBloqueo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleRecuperar, setModalVisibleRecuperar] = useState(false);
  const [modalVisibleRegister, setModalVisibleRegister] = useState(false);
  const [form, setForm] = useState({Usuario: '', Clave: ''});
  const [error, setError] = useState({});
  const ValidateLogin = async (data: any) => {
    setError(error => {
      return {};
    });
    const validation = validationsObjV2(data, [
      {
        isRequired: true,
        obj: 'Usuario',
        regex: /\S+@\S+\.\S+/,
      },
      {
        isRequired: true,
        obj: 'Clave',
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
    }
  };
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
            photo: retorno['data'].image
              ? 'data:image/png;base64,' + retorno['data'].image
              : '',
            trainings: retorno['trainings'],
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
    setModalVisibleRecuperar(true);
  };
  const Registrarse = () => {
    setModalVisibleRegister(true);
  };
  return (
    <KeyboardAvoidingView
      style={{flex: Platform.OS === 'ios' ? 1 : undefined}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ModalLoad viewed={modalVisible} />

      <Box w={'100%'} h={'100%'} safeAreaTop bg="white">
        <RecoverPassword
          visible={modalVisibleRecuperar}
          setModalVisible={setModalVisibleRecuperar}
        />
        <RegisterUser
          visible={modalVisibleRegister}
          setModalVisible={setModalVisibleRegister}
        />
        <Box flex={1} alignItems={'center'} p={5}>
          <Image
            flex={1}
            w="50%"
            resizeMode="contain"
            source={require('../resources/images/logo-limpio.png')}
            alt="Lucas Gym"
          />
        </Box>
        <Box flex={4} roundedTop={'2xl'} bg={'info.900'}>
          <ScrollView>
            <VStack alignItems={'center'} space={'5'} mx="10%">
              <Text color={'white'} fontSize={'2xl'} bold mt={'5'}>
                Acceder
              </Text>
              <FormControl isRequired isInvalid={'Usuario' in error}>
                <FormControl.Label _text={{color: 'white', fontWeight: 'bold'}}>
                  Correo
                </FormControl.Label>
                <Input
                  rounded={10}
                  height={10}
                  bgColor={'white'}
                  value={form.Usuario}
                  placeholder="Correo"
                  onChangeText={value => setForm({...form, Usuario: value})}
                  InputLeftElement={
                    <Box ml={3}>
                      <Icon name="user" size={30} color="grey"></Icon>
                    </Box>
                  }
                />
                {'Usuario' in error && (
                  <FormControl.ErrorMessage>
                    {error.Usuario}
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
              <Box w="100%">
                <HStack>
                  <Box flex={1}>
                    <Checkbox value={form.rememberme}>
                      <Text color={'white'} bold>
                        Recuerdame
                      </Text>
                    </Checkbox>
                  </Box>
                  <Box>
                    <Pressable onPress={RecuperarClave}>
                      <Text bold color={'tertiary.500'} fontSize={'md'}>
                        ¿Clave olvidada?
                      </Text>
                    </Pressable>
                  </Box>
                </HStack>
              </Box>
              <Pressable
                w={'90%'}
                rounded={'2xl'}
                mt={5}
                onPress={() => {
                  ValidateLogin(form);
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
                        Acceder
                      </Text>
                    </Box>
                  );
                }}
              </Pressable>
            </VStack>
          </ScrollView>
          <Box alignItems={'center'} w="100%" mb={6}>
            <Text fontSize={'md'} color="white">
              ¿No estas registrado?
            </Text>
            <Pressable onPress={Registrarse}>
              <Text fontSize={'md'} bold color="tertiary.500">
                ¡Registrate!
              </Text>
            </Pressable>
          </Box>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default Login;
