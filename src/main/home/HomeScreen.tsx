import React, {useState, useContext} from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import UserDetail from './UserDetail';
import ModalNewExercise from './ModalNewExercise';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalLoad from '../../support/ModalLoad';
import {LucasContext} from '../../support/Contexts';
import {list_schedule_avail} from './Firebase';
import RegisterWeights from './RegisterWeights';
import {Box, Pressable, Menu, VStack, HStack} from 'native-base';
import UserEdit from '../setting/UserEdit';
const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const [datosAgenda, setDatosAgenda] = useState([]);
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [visibleWeight, setVisibleWeight] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const newWeights = async () => {
    setVisibleWeight(true);
  };
  const logout = () => {
    Alert.alert('Cerrar sesión', '¿Desea cerrar la sesión?', [
      {
        text: 'Si',
        onPress: () => {
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
        },
      },
      {
        text: 'No',
      },
    ]);
  };
  const newExercise = async () => {
    setModalLoadVisible(true);
    const retorno = await list_schedule_avail({email: userLucas.email});
    try {
      setModalLoadVisible(false);
      if (retorno != null) {
        setDatosAgenda(retorno);
        setModalVisible(true);
      } else {
        Alert.alert('Error', 'Error de comunicación.');
      }
    } catch (e) {
      console.warn(e.message);
    }
  };
  return (
    <>
      <Box w={'100%'} h={'100%'} safeAreaTop bg="white">
        <ModalLoad viewed={modalLoadVisible} />
        <ModalNewExercise
          visible={modalVisible}
          setVisible={setModalVisible}
          datosAgenda={datosAgenda}
        />
        <RegisterWeights
          setVisible={setVisibleWeight}
          visible={visibleWeight}
        />
        <UserEdit
          visible={modalEdit}
          setVisible={setModalEdit}
          userLucas={userLucas}
          setUserLucas={setUserLucas}
        />
        <Box flex={3}>
          <Box
            safeAreaTop
            marginRight={'5'}
            marginTop={'5'}
            marginLeft={'auto'}>
            <Menu
              trigger={triggerProps => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}>
                    <Icon name="cogs" size={25} />
                  </Pressable>
                );
              }}>
              <Menu.Item
                onPress={() => {
                  setModalEdit(!modalEdit);
                }}>
                Editar Perfil
              </Menu.Item>
              <Menu.Item onPress={logout}>Cerrar Sesión</Menu.Item>
            </Menu>
          </Box>
          <UserDetail />
        </Box>
        <Box flex={5} roundedTop={'2xl'} bg={'info.900'}>
          <Box flex={1} flexDirection={'column'}>
            <Box flex={3} flexDirection={'row'}>
              <Pressable flex={1} m={3} rounded={'2xl'} onPress={newExercise}>
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
                      rounded={'2xl'}
                      h={'100%'}
                      shadow={3}
                      borderWidth="1"
                      borderColor="coolGray.300">
                      <Box
                        alignItems={'center'}
                        flex={1}
                        justifyContent={'center'}>
                        <Icon name="plus" size={80} color="black" />
                        <Text
                          style={{
                            color: 'black',
                            textAlign: 'center',
                            height: 40,
                            fontWeight: '800',
                            fontSize: 15,
                            padding: 8,
                          }}>
                          Nuevo Entreno
                        </Text>
                      </Box>
                    </Box>
                  );
                }}
              </Pressable>
              <Pressable flex={1} m={3} rounded={'2xl'} onPress={newWeights}>
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
                      rounded={'2xl'}
                      shadow={3}
                      borderWidth="1"
                      h={'100%'}
                      borderColor="coolGray.300">
                      <Box
                        alignItems={'center'}
                        flex={1}
                        justifyContent={'center'}>
                        <Icon name="odnoklassniki" size={80} color="black" />
                        <Text
                          style={{
                            color: 'black',
                            textAlign: 'center',
                            height: 40,
                            fontWeight: '800',
                            fontSize: 15,
                            padding: 8,
                          }}>
                          Registrar Medidas
                        </Text>
                      </Box>
                    </Box>
                  );
                }}
              </Pressable>
            </Box>
            <Box flex={3} flexDirection={'row'}>
              <Pressable
                flex={1}
                m={3}
                rounded={'2xl'}
                onPress={async () => {
                  const url = 'https://www.instagram.com/lucasgymgt/';
                  await Linking.openURL(url).catch(e => {
                    Alert.alert('Error', 'Error al abrir instagram.');
                  });
                }}>
                {({isHovered, isFocused, isPressed}) => {
                  return (
                    <Box
                      bg={
                        isPressed
                          ? 'coolGray.800'
                          : isHovered
                          ? 'coolGray.800'
                          : 'coolGray.700'
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
                      h={'100%'}
                      borderWidth="1"
                      borderColor="coolGray.300">
                      <Box
                        alignItems={'center'}
                        flex={1}
                        justifyContent={'center'}>
                        <Icon name="instagram" size={80} color="#6459D7" />
                        <Text
                          style={{
                            color: 'white',
                            textAlign: 'center',
                            height: 40,
                            fontWeight: '800',
                            fontSize: 15,
                            padding: 8,
                          }}>
                          Instagram
                        </Text>
                      </Box>
                    </Box>
                  );
                }}
              </Pressable>
              <Pressable
                flex={1}
                m={3}
                rounded={'2xl'}
                onPress={async () => {
                  const url =
                    'https://chat.whatsapp.com/FeTvB3EUnPG7QA8YUi7rpi';
                  await Linking.openURL(url).catch(e => {
                    Alert.alert(
                      'Error',
                      'Error al buscar el grupo de whatsapp.',
                    );
                  });
                }}>
                {({isHovered, isFocused, isPressed}) => {
                  return (
                    <Box
                      bg={
                        isPressed
                          ? 'coolGray.800'
                          : isHovered
                          ? 'coolGray.800'
                          : 'coolGray.700'
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
                      h={'100%'}
                      borderColor="coolGray.300">
                      <Box
                        alignItems={'center'}
                        flex={1}
                        justifyContent={'center'}>
                        <Icon name="whatsapp" size={80} color="#39D555" />
                        <Text
                          style={{
                            color: 'white',
                            textAlign: 'center',
                            height: 40,
                            fontWeight: '800',
                            fontSize: 15,
                            padding: 8,
                          }}>
                          Whatsapp
                        </Text>
                      </Box>
                    </Box>
                  );
                }}
              </Pressable>
            </Box>
            <Box flex={1}></Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default HomeScreen;
