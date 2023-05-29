import React, {useState, useEffect, useContext} from 'react';
import {Alert, Modal, SafeAreaView, TouchableHighlight} from 'react-native';
import {styles} from '../Styles';
import {
  FormControl,
  Stack,
  Heading,
  Input,
  Text,
  VStack,
  ScrollView,
} from 'native-base';
import {validationsObjV2} from '../../support/Support';
import {LucasContext} from '../../support/Contexts';
import {get_challenge, set_challenge} from './Firebase';
import ModalLoad from '../../support/ModalLoad';
const RegisterChallenge = ({visible = false, setVisible}) => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [form, setForm] = useState({
    tiempo: '',
    detalle: '',
  });
  const [error, setError] = useState({});
  const [modalLoadVisible, setModalLoadVisible] = useState(false);
  useEffect(() => {
    if (visible) {
      setModalLoadVisible(true);
      get_challenge(userLucas).then(weights => {
        setForm(weights);
      });
      setModalLoadVisible(false);
    }
  }, [visible]);
  const registryChallenge = async form => {
    setError(error => {
      return {};
    });
    const validation = validationsObjV2(form, [
      {
        isRequired: true,
        obj: 'tiempo',
      },
      {
        isRequired: true,
        obj: 'detalle',
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
      await set_challenge(dataSended);
      setModalLoadVisible(false);
      Alert.alert('Registro guardado', 'Registro guardado correctamente');
      setVisible(false);
    }
  };
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{backgroundColor: '#F2F4F5', height: '100%'}}>
        <ModalLoad viewed={modalLoadVisible} />
        <ScrollView w="100%">
          <VStack alignItems="center" mt={5}>
            <Heading size="lg">Marca de challenge</Heading>
          </VStack>
          <Stack mx="5%" my={5}>
            <FormControl isRequired isInvalid={'tiempo' in error}>
              <FormControl.Label>Tiempo realizado</FormControl.Label>
              <Input
                rounded={10}
                keyboardType="default"
                height={10}
                placeholder="1 hora 30 sgs"
                bgColor={'white'}
                value={form.tiempo}
                onChangeText={value => setForm({...form, tiempo: value})}
              />
              {'tiempo' in error && (
                <FormControl.ErrorMessage>
                  {error.tiempo}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <FormControl isRequired isInvalid={'detalle' in error}>
              <FormControl.Label>Ejercicios realizados</FormControl.Label>
              <Input
                rounded={10}
                multiline={true}
                numberOfLines={8}
                height={20}
                bgColor={'white'}
                value={form.detalle}
                keyboardType="default"
                placeholder="100 Burpees, 100 sentadillas..."
                onChangeText={value => setForm({...form, detalle: value})}
              />
              {'detalle' in error && (
                <FormControl.ErrorMessage>
                  {error.detalle}
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
              marginHorizontal: '5%',
            }}
            onPress={() => {
              registryChallenge(form);
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
              marginBottom: 300,
              marginHorizontal: '5%',
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
    </Modal>
  );
};

export default RegisterChallenge;
