import React, {useState, useContext} from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  Dimensions,
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
import RegisterChallenge from './RegisterChallenge';
import {Box, Pressable, Menu, VStack, HStack} from 'native-base';
import UserEdit from '../setting/UserEdit';
const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  const [datosAgenda, setDatosAgenda] = useState([]);
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [visibleWeight, setVisibleWeight] = useState(false);
  const [visibleChallenge, setVisibleChallenge] = useState(false);
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
        <RegisterChallenge
          setVisible={setVisibleChallenge}
          visible={visibleChallenge}
        />
        <UserEdit
          visible={modalEdit}
          setVisible={setModalEdit}
          userLucas={userLucas}
          setUserLucas={setUserLucas}
        />
        <Box h={'25%'}>
          <Box mt={5} marginRight={'5'} marginLeft={'auto'}>
            <Menu
              trigger={triggerProps => {
                return (
                  <Pressable {...triggerProps}>
                    <Icon name="cogs" color={'black'} size={25} />
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
              <HStack flex={1}>
                <Pressable
                  h={(Dimensions.get('window').height / 100) * 20}
                  maxH={140}
                  m={3}
                  rounded={'2xl'}
                  onPress={() => {
                    setVisibleChallenge(true);
                  }}
                  flex={1}>
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
                          justifyContent={'center'}
                          mt={2}>
                          <Icon name="child" size={50} color="black" />
                          <Text
                            style={{
                              color: 'black',
                              textAlign: 'center',
                              height: 40,
                              fontWeight: '800',
                              fontSize: 15,
                              padding: 8,
                            }}>
                            Challenge
                          </Text>
                        </Box>
                      </Box>
                    );
                  }}
                </Pressable>
                <Pressable
                  flex={1}
                  h={(Dimensions.get('window').height / 100) * 20}
                  maxH={140}
                  m={3}
                  rounded={'2xl'}
                  onPress={newWeights}>
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
                          justifyContent={'center'}
                          mt={2}>
                          <Icon name="sliders" size={50} color="black" />
                          <Text
                            style={{
                              color: 'black',
                              textAlign: 'center',
                              height: 40,
                              fontWeight: '800',
                              fontSize: 15,
                              padding: 8,
                            }}>
                            Medidas
                          </Text>
                        </Box>
                      </Box>
                    );
                  }}
                </Pressable>
              </HStack>
            </Box>
            <Box flex={3} my={5} alignItems={'center'}>
              <Pressable
                w={180}
                h={(Dimensions.get('window').height / 100) * 20}
                maxH={140}
                m={3}
                rounded={'2xl'}
                onPress={newExercise}>
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
                        justifyContent={'center'}
                        mt={2}>
                        <Icon name="plus" size={50} color="black" />
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
            </Box>
            <Box flex={3} flexDirection={'row'}>
              <Pressable
                flex={1}
                m={3}
                w={200}
                h={(Dimensions.get('window').height / 100) * 20}
                maxH={140}
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
                        mt={2}
                        justifyContent={'center'}>
                        <Icon name="instagram" size={50} color="#6459D7" />
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
                w={200}
                h={(Dimensions.get('window').height / 100) * 20}
                maxH={140}
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
                        mt={2}
                        justifyContent={'center'}>
                        <Icon name="whatsapp" size={50} color="#39D555" />
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
