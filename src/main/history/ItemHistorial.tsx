import React, {useState, useContext} from 'react';
import {Pressable, View, Text, Alert} from 'react-native';

import {LucasContext} from '../../support/Contexts';
import {confirm_assitance} from './Firebase';
const ItemHistorial = ({item}) => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const confirmAssitance = (user, date, id, isCome) => {
    if (isCome == 'Pendiente') {
      Alert.alert('Confirmar Asistencia', 'Por favor confirma la asistencia', [
        {
          text: 'Asistío',
          onPress: () => {
            confirm_assitance(user, date, id, 'Si');
            setEstatus('Si');
          },
        },
        {
          text: 'Ausente',
          onPress: () => {
            confirm_assitance(user, date, id, 'No');
            setEstatus('No');
          },
        },
        {text: 'Cancelar'},
      ]);
    }
  };
  const key = item.timeStart + '-' + item.timeEnd + '-' + item.user;
  const retorno = item.user;
  const time = item.timeStart + '-' + item.timeEnd;
  const estatusValue = item.isCome == false ? 'Pendiente' : item.isCome;
  const [estatus, setEstatus] = useState(estatusValue);
  const [color, setColor] = useState('white');
  return (
    <Pressable
      onPress={() => {
        confirmAssitance(item.email, item.date, item.id, estatus);
      }}>
      <View
        key={key + '_view'}
        style={{
          width: '95%',
          backgroundColor:
            estatus == 'Pendiente'
              ? '#FFFEC0'
              : estatus == 'Si'
              ? '#A3FFA9'
              : '#FCC2C2',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          marginTop: 5,
          marginBottom: 5,
          height: 80,
          flexDirection: 'row',
        }}>
        <Text
          key={key + '_text'}
          style={{
            color: 'black',
            fontWeight: '500',
            fontSize: 18,
            flex: 1,
            marginLeft: 15,
          }}>
          {retorno}
        </Text>

        <View style={{flexDirection: 'column', flex: 1}}>
          <View
            key={key + '_text_view_st'}
            style={{
              borderRadius: 100,
              backgroundColor: '#FF7700',
              marginRight: 10,
              marginVertical: 5,
              marginLeft: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              key={key + '_text_ag'}
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 15,
                borderRadius: 50,
              }}>
              {time}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export default ItemHistorial;
