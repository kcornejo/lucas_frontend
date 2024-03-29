import React, {useState, useEffect, useContext} from 'react';
import {Agenda} from 'react-native-calendars';
import {
  Modal,
  View,
  Text,
  Pressable,
  Alert,
  TouchableHighlight,
} from 'react-native';
import {styles} from '../Styles';
import {LucasContext} from '../../support/Contexts';
import {new_exercise, delete_exercise} from './Firebase';
const ModalNewExercise = ({visible, datosAgenda, setVisible}) => {
  const [userLucas, setUserLucas] = useContext(LucasContext);
  const [retornoCalendary, setRetornoCalendary] = useState({});
  const [marked, setMarked] = useState({});
  const [maxDate, setMaxDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const selectedDay = new Date().toISOString().split('T')[0];
  useEffect(() => {
    if (visible) {
      setMaxDate(
        datosAgenda['calendar'][datosAgenda['calendar'].length - 1]['date'],
      );
      let list_dates = {};
      let list_marked = {};
      for (let i = 0; i < datosAgenda['calendar'].length; i++) {
        list_dates[datosAgenda['calendar'][i]['date'].toString()] = [
          {
            times: datosAgenda['calendar'][i]['times'],
            date: datosAgenda['calendar'][i]['date'].toString(),
          },
        ];
        list_marked[datosAgenda['calendar'][i]['date'].toString()] = {
          marked:
            datosAgenda['calendar'][i]['times'].length == 0 ? false : true,
        };
      }
      setMarked(list_marked);
      setRetornoCalendary(list_dates);
    }
  }, [visible]);
  const deleteExercise = async (TimeStart, TimeEnd, Date) => {
    var raw = {
      email: userLucas.email.toString().trim(),
      date: Date,
      timeStart: TimeStart,
      timeEnd: TimeEnd,
    };
    const result = await delete_exercise(raw);
    try {
      if (result != null) {
        if (result['code'] != '000') {
          console.warn(result['message']);
        }
        Alert.alert('Reserva liberada', 'La reserva fue liberada.', [
          {
            onPress: () => {
              setUserLucas(userLucas => {
                return {
                  ...userLucas,
                  historial: 'new',
                };
              });
              setVisible(false);
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Error de comunicación.');
      }
    } catch (e) {
      //console.warn(e.message);
    }
  };
  const newExercise = async (TimeStart, TimeEnd, Date) => {
    var raw = {
      email: userLucas.email.toString().trim(),
      date: Date,
      timeStart: TimeStart,
      timeEnd: TimeEnd,
    };
    const result = await new_exercise(raw);
    try {
      if (result != null) {
        if (result['code'] != '000') {
          console.warn(result['message']);
        } else {
          Alert.alert('Horario Reservado', 'El horario fue reservado', [
            {
              onPress: () => {
                setUserLucas(userLucas => {
                  return {
                    ...userLucas,
                    historial: 'new',
                  };
                });
                setVisible(false);
              },
            },
          ]);
        }
      } else {
        Alert.alert('Error', 'Error de comunicación.');
      }
    } catch (e) {
      //console.warn(e.message);
    }
  };
  return (
    <Modal visible={visible} animationType="slide">
      <Agenda
        items={retornoCalendary}
        minDate={selectedDay}
        selected={selectedDay}
        refreshing={false}
        maxDate={maxDate}
        renderItem={(item: any, firstItemInDay) => {
          let impresion = [];
          if (item.times.length == 0) {
            const key_vacio = '0_' + item.date;
            impresion.push(
              <View
                key={key_vacio}
                style={{
                  width: '95%',
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: 5,
                  marginBottom: 5,
                  height: 100,
                }}>
                <Text
                  style={{
                    color: 'red',
                    fontWeight: '500',
                    fontSize: 25,
                  }}>
                  SIN ENTRENOS
                </Text>
              </View>,
            );
          }
          for (let i = 0; i < item.times.length; i++) {
            const key = i + '_' + item.date;
            const retorno =
              item.times[i].TimeStart.toString() +
              '-' +
              item.times[i].TimeEnd.toString();
            const estatus = item.times[i].Scheduled
              ? 'Agendado'
              : item.times[i].Avail == true
              ? 'Disponible'
              : 'Cupo Lleno';
            impresion.push(
              <Pressable
                key={key + '_button'}
                onPress={() => {
                  if (estatus == 'Disponible') {
                    Alert.alert(
                      'Reservar horario',
                      '¿Estas seguro que estas listo para el reto el dia ' +
                        item.date +
                        '?',
                      [
                        {
                          text: 'Si',
                          onPress: () => {
                            newExercise(
                              item.times[i].TimeStart.toString(),
                              item.times[i].TimeEnd.toString(),
                              item.date,
                            );
                          },
                        },
                        {
                          text: 'No',
                        },
                      ],
                    );
                  } else if (estatus == 'Agendado') {
                    Alert.alert(
                      'Eliminar reserva',
                      '¿Estas seguro que quieres eliminar la reserva del dia ' +
                        item.date +
                        '?',
                      [
                        {
                          text: 'Si',
                          onPress: () => {
                            deleteExercise(
                              item.times[i].TimeStart.toString(),
                              item.times[i].TimeEnd.toString(),
                              item.date,
                            );
                          },
                        },
                        {
                          text: 'No',
                        },
                      ],
                    );
                  } else {
                    Alert.alert('Cupo lleno', 'Por favor selecciona otra hora');
                  }
                }}>
                <View
                  key={key + '_view'}
                  style={{
                    width: '95%',
                    backgroundColor: 'white',
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
                      fontSize: 25,
                      flex: 2,
                      marginLeft: 15,
                    }}>
                    {retorno}
                  </Text>

                  <View
                    key={key + '_text_view_st'}
                    style={{
                      borderRadius: 100,
                      backgroundColor:
                        estatus == 'Disponible'
                          ? 'green'
                          : estatus == 'Agendado'
                          ? 'grey'
                          : 'red',
                      flex: 1,
                      marginRight: 10,
                      marginLeft: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      key={key + '_text_ag'}
                      style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: 15,
                        borderRadius: 50,
                      }}>
                      {estatus}
                    </Text>
                  </View>
                </View>
              </Pressable>,
            );
          }
          return <>{impresion}</>;
        }}
        renderDay={(item, firstItemInDay) => {
          if (item != undefined) {
            const month = {
              '01': 'Ene',
              '02': 'Feb',
              '03': 'Mar',
              '04': 'Abr',
              '05': 'May',
              '06': 'Jun',
              '07': 'Jul',
              '08': 'Ago',
              '09': 'Sep',
              '10': 'Oct',
              '11': 'Nov',
              '12': 'Dic',
            };
            const day_spa = {
              '1': 'Lun',
              '2': 'Mar',
              '3': 'Mie',
              '4': 'Jue',
              '5': 'Vie',
              '6': 'Sab',
              '0': 'Dom',
            };
            const date = item.toISOString().split('T')[0].split('-')[2];
            const month_item = item.toISOString().split('T')[0].split('-')[1];
            const day = item.getDay();
            return (
              <View style={{width: 60, alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'grey',
                    fontWeight: '800',
                    marginTop: 5,
                  }}>
                  {day_spa[day]}
                </Text>
                <Text style={{fontSize: 30, color: 'grey'}}>{date}</Text>
                <Text style={{color: 'grey', fontSize: 15}}>
                  {month[month_item]}
                </Text>
              </View>
            );
          } else {
            return <></>;
          }
        }}
        markedDates={marked}></Agenda>
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
          setVisible(false);
        }}>
        <Text style={styles.textButton}>Regresar</Text>
      </TouchableHighlight>
    </Modal>
  );
};
export default ModalNewExercise;
