import React, {useState, useEffect} from 'react';
import {Agenda} from 'react-native-calendars';
import {Modal, View, Text, Pressable, Alert} from 'react-native';
import {styles} from './Styles';
import {BASE_URL} from '@env';
import Support from '../support/Support';

const ModalNewExercise = ({
  visible,
  datosAgenda,
  setVisible,
  userLucas,
  setUserLucas,
}) => {
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
  const newExercise = async (TimeStart, TimeEnd, Date) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + userLucas.token);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      email: userLucas.email,
      date: Date,
      timeStart: TimeStart,
      timeEnd: TimeEnd,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(BASE_URL + '/api/user/calendar', requestOptions)
      .then(response => response.text())
      .then(result => {
        const retorno = JSON.parse(result);
        if (retorno['code'] != '000') {
          console.warn(retorno['message']);
        }
        Alert.alert('Horario Reservado', 'El horario fue reservado', [
          {
            onPress: () => {
              setVisible(false);
            },
          },
        ]);
      })
      .catch(error => {
        Support.ErrorToken({message: error.message, setUserLucas});
      });
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
            impresion.push(
              <Pressable
                key={key + '_button'}
                onPress={() => {
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
                  }}>
                  <Text
                    key={key + '_text'}
                    style={{
                      color: 'black',
                      fontWeight: '500',
                      fontSize: 25,
                    }}>
                    {retorno}
                  </Text>
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
            const date = item.toISOString().split('T')[0].split('-')[2];

            const month_item = item.toISOString().split('T')[0].split('-')[1];
            return (
              <View style={{width: 60, alignItems: 'center'}}>
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
      <Pressable
        style={styles.button}
        onPress={() => {
          setVisible(false);
        }}>
        <Text style={styles.textButton}>Regresar</Text>
      </Pressable>
    </Modal>
  );
};
export default ModalNewExercise;
