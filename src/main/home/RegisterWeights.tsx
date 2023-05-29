import React, {useState, useEffect, useContext} from 'react';
import {Alert, Modal, SafeAreaView, TouchableHighlight} from 'react-native';
import {styles} from '../Styles';
import {
  FormControl,
  Stack,
  Heading,
  Input,
  NativeBaseProvider,
  Text,
  VStack,
  ScrollView,
} from 'native-base';
import {validationsObjV2} from '../../support/Support';
import {LucasContext} from '../../support/Contexts';
import {get_weights, set_weights} from './Firebase';
import ModalLoad from '../../support/ModalLoad';
const RegisterWeights = ({setVisible, visible = false}) => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [form, setForm] = useState({
    brazo: '0',
    cintura: '0',
    abdomen: '0',
    cadera: '0',
    pierna: '0',
  });
  const [error, setError] = useState({});
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  useEffect(() => {
    if (visible) {
      setModalLoadVisible(true);
      get_weights(userLucas).then(weights => {
        setForm(weights);
      });
      setModalLoadVisible(false);
    }
  }, [visible]);
  const registryWeights = async form => {
    setError(error => {
      return {};
    });
    const validation = validationsObjV2(form, [
      {
        isRequired: true,
        obj: 'brazo',
        regex: /[0-9]{1,3}/,
      },
      {
        isRequired: true,
        obj: 'cintura',
        regex: /[0-9]{1,3}/,
      },
      {
        isRequired: true,
        obj: 'abdomen',
        regex: /[0-9]{1,3}/,
      },
      {
        isRequired: true,
        obj: 'cadera',
        regex: /[0-9]{1,3}/,
      },
      {
        isRequired: true,
        obj: 'pierna',
        regex: /[0-9]{1,3}/,
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
      const dataSended = {
        email: userLucas.email,
        ...form,
      };
      setModalLoadVisible(true);
      await set_weights(dataSended);
      setModalLoadVisible(false);
      Alert.alert('Registro guardado', 'Registro guardado correctamente');
      setVisible(false);
    }
  };
  return (
    <Modal visible={visible} animationType="slide">
      <NativeBaseProvider>
        <SafeAreaView style={{backgroundColor: '#F2F4F5', height: '100%'}}>
          <ModalLoad viewed={modalLoadVisible} />
          <ScrollView w="100%">
            <VStack alignItems="center" mt={5}>
              <Heading size="lg">Seguimiento de Medidas</Heading>
            </VStack>
            <Stack mx="5%" my={5}>
              <FormControl isRequired isInvalid={'brazo' in error}>
                <FormControl.Label>Brazo</FormControl.Label>
                <Input
                  rounded={10}
                  keyboardType="number-pad"
                  height={10}
                  bgColor={'white'}
                  value={form.brazo}
                  onChangeText={value => setForm({...form, brazo: value})}
                />
                {'brazo' in error && (
                  <FormControl.ErrorMessage>
                    {error.brazo}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={'cintura' in error}>
                <FormControl.Label>Cintura</FormControl.Label>
                <Input
                  rounded={10}
                  height={10}
                  bgColor={'white'}
                  value={form.cintura}
                  keyboardType="number-pad"
                  onChangeText={value => setForm({...form, cintura: value})}
                />
                {'cintura' in error && (
                  <FormControl.ErrorMessage>
                    {error.cintura}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={'abdomen' in error}>
                <FormControl.Label>Abdomen</FormControl.Label>
                <Input
                  rounded={10}
                  height={10}
                  bgColor={'white'}
                  value={form.abdomen}
                  keyboardType="number-pad"
                  onChangeText={value => setForm({...form, abdomen: value})}
                />
                {'abdomen' in error && (
                  <FormControl.ErrorMessage>
                    {error.abdomen}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={'cadera' in error}>
                <FormControl.Label>Cadera</FormControl.Label>
                <Input
                  rounded={10}
                  height={10}
                  bgColor={'white'}
                  keyboardType="number-pad"
                  value={form.cadera}
                  onChangeText={value => setForm({...form, cadera: value})}
                />
                {'cadera' in error && (
                  <FormControl.ErrorMessage>
                    {error.cadera}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired isInvalid={'pierna' in error}>
                <FormControl.Label>Pierna</FormControl.Label>
                <Input
                  rounded={10}
                  height={10}
                  bgColor={'white'}
                  keyboardType="number-pad"
                  value={form.pierna}
                  onChangeText={value => setForm({...form, pierna: value})}
                />
                {'pierna' in error && (
                  <FormControl.ErrorMessage>
                    {error.pierna}
                  </FormControl.ErrorMessage>
                )}
              </FormControl>
            </Stack>
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
                registryWeights(form);
              }}>
              <Text style={styles.textButton}>Guardar</Text>
            </TouchableHighlight>
            <TouchableHighlight
              activeOpacity={0.85}
              underlayColor={'#374151'}
              style={{
                backgroundColor: '#4b5563',
                borderWidth: 1,
                borderRadius: 12,
                height: 50,
                margin: 20,
              }}
              onPress={() => {
                setVisible(false);
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  height: 40,
                  fontWeight: '800',
                  fontSize: 20,
                  marginTop: 10,
                }}>
                Regresar
              </Text>
            </TouchableHighlight>
          </ScrollView>
        </SafeAreaView>
      </NativeBaseProvider>
    </Modal>
  );
};
export default RegisterWeights;
