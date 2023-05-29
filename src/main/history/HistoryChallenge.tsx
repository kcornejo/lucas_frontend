import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  VStack,
  Heading,
  Stack,
  FlatList,
  Box,
  Text,
  Pressable,
  HStack,
} from 'native-base';
import {SafeAreaView, TouchableHighlight, Modal} from 'react-native';
import {styles} from '../Styles';
import ModalLoad from '../../support/ModalLoad';
import {get_list_user, get_list_challenge} from './Firebase';
const HistoryChallenge = ({admin, user_email, user, visible, setVisible}) => {
  const [load, setLoad] = useState(false);
  const [visibleUser, setVisibleUser] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [dataCha, setDataCha] = useState([]);
  const [usuario, setUsuario] = useState('');
  useEffect(() => {
    if (visible) {
      if (admin) {
        setVisibleUser(true);
        setLoad(true);
        get_list_user().then(data => {
          setLoad(false);
          setDataUser(data);
        });
      } else {
        setVisibleUser(false);
        get_list_challenge(user_email).then(data => {
          setDataCha(data);
        });
      }
    }
  }, [visible]);
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{backgroundColor: '#114156', height: '100%'}}>
        <ModalLoad viewed={load} />
        {!visibleUser ? (
          <>
            <VStack alignItems="center" mt={5} h={'5%'}>
              <Heading size="lg" color="white">
                {admin ? 'Challenges de ' + usuario : 'Challenges'}
              </Heading>
            </VStack>
            <Stack mx="5%" my={5} h={'75%'}>
              <FlatList
                data={dataCha}
                renderItem={({item}) => {
                  return (
                    <Box w={'100%'} alignItems={'center'}>
                      <Box w={'95%'} bg="white" my={2} p={3} rounded={'2xl'}>
                        <Heading
                          textAlign={'center'}
                          m={1}
                          size="md"
                          color="black">
                          Fecha: {item.fecha}
                        </Heading>
                        <HStack space={'5'}>
                          <Box w={'40%'} p={1}>
                            <Text bold>Tiempo:</Text>
                            <Text>{item.tiempo}</Text>
                          </Box>
                          <Box w={'60%'} p={1}>
                            <Text bold>Ejercicios:</Text>
                            <Text>{item.detalle}</Text>
                          </Box>
                        </HStack>
                      </Box>
                    </Box>
                  );
                }}
              />
            </Stack>
          </>
        ) : (
          <>
            <VStack alignItems="center" mt={5} h={'5%'}>
              <Heading size="lg" color="white">
                Lista de Usuarios
              </Heading>
            </VStack>
            <Stack mx="5%" my={5} h={'75%'}>
              <FlatList
                data={dataUser}
                renderItem={({item}) => {
                  return (
                    <Pressable
                      onPress={() => {
                        setLoad(true);
                        get_list_challenge(item.email).then(data => {
                          setLoad(false);
                          setDataCha(data);
                          setVisibleUser(false);
                          setUsuario(item.firstName);
                        });
                      }}>
                      {({isHovered, isFocused, isPressed}) => {
                        return (
                          <Box
                            w={'100%'}
                            alignItems={'center'}
                            style={{
                              transform: [
                                {
                                  scale: isPressed ? 0.96 : 1,
                                },
                              ],
                            }}>
                            <Box
                              w={'95%'}
                              bg={isPressed ? '#C8C8C8' : 'white'}
                              my={2}
                              p={3}
                              rounded={'2xl'}>
                              <Text bold>
                                {item.firstName + ' ' + item.lastName}
                              </Text>
                            </Box>
                          </Box>
                        );
                      }}
                    </Pressable>
                  );
                }}
              />
            </Stack>
          </>
        )}
        <Box h="10%" justifyContent={'flex-end'}>
          <TouchableHighlight
            activeOpacity={0.85}
            underlayColor={'#10b981'}
            style={{
              backgroundColor: '#34d399',
              borderWidth: 1,
              borderRadius: 12,
              height: 50,
              margin: 20,
            }}
            onPress={() => {
              if (admin && visibleUser) {
                setVisible(false);
              } else if (admin && !visibleUser) {
                setVisibleUser(true);
              } else {
                setVisible(false);
              }
            }}>
            <Text style={styles.textButton}>Regresar</Text>
          </TouchableHighlight>
        </Box>
      </SafeAreaView>
    </Modal>
  );
};

export default HistoryChallenge;
