import React, {useState} from 'react';
import ModalLoad from '../support/ModalLoad';
import {SafeAreaView, Alert, View} from 'react-native';
import {styles} from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useForm} from 'react-hook-form';
import InputKC from '../support/InputKC';
import {forgot_password} from './Firebase';
import {
  Modal,
  Box,
  Text,
  ScrollView,
  VStack,
  Input,
  FormControl,
  Pressable,
  Divider,
  KeyboardAvoidingView,
} from 'native-base';
import {validationsObjV2} from '../support/Support';
const RecoverPassword = ({visible = false, setModalVisible}) => {
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    Correo: '',
  });
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const funRegresar = () => {
    setModalVisible(false);
  };
  const RecuperarClave = async (data: any) => {
    setError(error => {
      return {};
    });
    const validation = validationsObjV2(data, [
      {
        isRequired: true,
        obj: 'Correo',
        regex: /\S+@\S+\.\S+/,
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
      var raw = {
        email: data.Correo.toString().trim(),
      };
      const retorno = await forgot_password(raw);
      try {
        setModalLoadVisible(false);
        if (retorno['code'] == '000' || retorno['code'] == '999') {
          Alert.alert(
            'Clave enviada',
            'Clave enviada, por favor valide su email.',
          );
          setForm({
            Correo: '',
          });
        } else {
          Alert.alert('Error', retorno['message']);
        }
        setModalVisible(false);
      } catch (e) {
        Alert.alert('Error', 'Error de comunicación');
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
      <KeyboardAvoidingView
        w={'100%'}
        h={'100%'}
        style={{flex: 3}}
        behavior={'padding'}>
        <Box
          roundedTop={'2xl'}
          bg={'info.900'}
          style={{marginBottom: 0, marginTop: 'auto'}}>
          <ScrollView>
            <VStack alignItems={'center'} space={'5'} mx="10%">
              <Text
                fontSize="2xl"
                bold
                color={'white'}
                textAlign={'center'}
                mt={'5'}>
                Recuperar Clave
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
              <Pressable
                w={'90%'}
                rounded={'2xl'}
                mt={5}
                onPress={() => {
                  RecuperarClave(form);
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
                        Recuperar
                      </Text>
                    </Box>
                  );
                }}
              </Pressable>
              <Divider />
              <Box alignItems={'center'} w="100%" mb={6}>
                <Text color="white" bold fontSize="md">
                  ¿Recuerdas la contraseña?
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
export default RecoverPassword;
