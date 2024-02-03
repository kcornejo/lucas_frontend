import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useState} from 'react';
import {Alert, Platform} from 'react-native';
import {LucasContext} from '../support/Contexts';
import {fill_info_user} from './Firebase';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  Box,
  FormControl,
  Input,
  Text,
  VStack,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
} from 'native-base';
import ModalLoad from '../support/ModalLoad';
import {validationsObjV2} from '../support/Support';
const FillInformation = () => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateString, setDateString] = useState(new Date('2000'));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [form, setForm] = useState({
    Nombre: '',
    Apellido: '',
    Telefono: '',
    FechaNacimiento: '',
  });
  const [error, setError] = useState({});

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = dateR => {
    hideDatePicker();
    setForm({
      ...form,
      FechaNacimiento:
        dateR.getDate() +
        '/' +
        (dateR.getMonth() + 1) +
        '/' +
        dateR.getFullYear(),
    });
    setDateString(dateR);
  };

  const guardarInfo = async (data: any) => {
    setError(error => {
      return {};
    });
    const validation = validationsObjV2(data, [
      {
        isRequired: true,
        obj: 'Apellido',
      },
      {
        isRequired: true,
        obj: 'Nombre',
      },
      {
        obj: 'FechaNacimiento',
        isRequired: true,
        regex: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
      },
      {
        obj: 'Telefono',
        isRequired: true,
        regex: /^[0-9]{8}$/,
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
      setModalVisible(true);
      var raw = {
        firstName: data.Nombre.toString(),
        lastName: data.Apellido.toString(),
        birthday: data.FechaNacimiento.toString(),
        phone: data.Telefono.toString(),
        email: userLucas.email.toString().trim(),
        weight: '200',
      };
      const result = await fill_info_user(raw);
      try {
        setModalVisible(false);

        if (result['code'] == '999') {
          Alert.alert('Error con actualización', result['message']);
        } else if (result['code'] == '000') {
          Alert.alert(
            'Usuario actualizado',
            'Usuario actualizado correctamente.',
          );
          setUserLucas(userLucas => {
            return {
              ...userLucas,
              firstName: data.Nombre.toString(),
              lastName: data.Apellido.toString(),
              birthday: data.FechaNacimiento.toString(),
              phone: data.Telefono.toString(),
              infoComplete: true,
              photo: '',
              admin: false,
            };
          });
        }
      } catch (e) {}
    }
  };
  return (
    <KeyboardAvoidingView
      style={{flex: Platform.OS === 'ios' ? 1 : undefined}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ModalLoad viewed={modalVisible} />
      <Box w={'100%'} h={'100%'} bg="info.700" safeAreaTop>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={dateString}
        />
        <ScrollView>
          <VStack mx="10%" space={1} alignItems={'center'}>
            <Text
              fontSize={'2xl'}
              bold
              color="white"
              textAlign={'center'}
              mt={5}>
              Más Información
            </Text>
            <FormControl isRequired isInvalid={'Nombre' in error} mx={1}>
              <FormControl.Label _text={{color: 'white', fontWeight: 'bold'}}>
                Nombre
              </FormControl.Label>
              <Input
                rounded={10}
                height={10}
                bgColor={'white'}
                value={form.Nombre}
                placeholder="Nombre"
                onChangeText={value => setForm({...form, Nombre: value})}
                InputLeftElement={
                  <Box ml={3}>
                    <Icon name="user" size={20} color="grey"></Icon>
                  </Box>
                }
              />
              {'Nombre' in error && (
                <FormControl.ErrorMessage>
                  {error.Nombre}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={'Apellido' in error} mx={1}>
              <FormControl.Label _text={{color: 'white', fontWeight: 'bold'}}>
                Apellido
              </FormControl.Label>
              <Input
                rounded={10}
                height={10}
                bgColor={'white'}
                value={form.Apellido}
                placeholder="Apellido"
                onChangeText={value => setForm({...form, Apellido: value})}
                InputLeftElement={
                  <Box ml={3}>
                    <Icon name="user" size={20} color="grey"></Icon>
                  </Box>
                }
              />
              {'Apellido' in error && (
                <FormControl.ErrorMessage>
                  {error.Apellido}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={'Telefono' in error} mx={1}>
              <FormControl.Label _text={{color: 'white', fontWeight: 'bold'}}>
                Telefono
              </FormControl.Label>
              <Input
                keyboardType="phone-pad"
                rounded={10}
                height={10}
                bgColor={'white'}
                value={form.Telefono}
                placeholder="Telefono"
                onChangeText={value => setForm({...form, Telefono: value})}
                InputLeftElement={
                  <Box ml={3}>
                    <Icon name="phone" size={20} color="grey"></Icon>
                  </Box>
                }
              />
              {'Telefono' in error && (
                <FormControl.ErrorMessage>
                  {error.Telefono}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={'FechaNacimiento' in error}
              mx={1}>
              <FormControl.Label
                _text={{color: 'white', fontWeight: 'bold', fontSize: '12'}}>
                Fecha de Nacimiento
              </FormControl.Label>
              <Input
                rounded={10}
                height={10}
                bgColor={'white'}
                onPressIn={showDatePicker}
                value={form.FechaNacimiento}
                placeholder="Fecha de Nacimiento"
                onChangeText={value =>
                  setForm({...form, FechaNacimiento: value})
                }
                InputLeftElement={
                  <Box ml={3}>
                    <Icon name="calendar" size={20} color="grey"></Icon>
                  </Box>
                }
              />
              {'FechaNacimiento' in error && (
                <FormControl.ErrorMessage>
                  {error.FechaNacimiento}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <Pressable
              w={'90%'}
              rounded={'2xl'}
              mt={5}
              onPress={() => {
                guardarInfo(form);
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
                      Guardar
                    </Text>
                  </Box>
                );
              }}
            </Pressable>
          </VStack>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
};
export default FillInformation;
