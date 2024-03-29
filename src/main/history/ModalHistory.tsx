import React, {useEffect, useState} from 'react';
import {Modal, Pressable, Text, TouchableHighlight, View} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {styles} from '../Styles';
import moment from 'moment';
const ModalHistory = ({setVisible, data}) => {
  const [maxDate, setMaxDate] = useState(moment().toISOString().split('T')[0]);
  const [minDate, setMinDate] = useState(
    moment().subtract('8', 'days').toISOString().split('T')[0],
  );
  const [items, setItems] = useState({});
  const [marked, setMarked] = useState({});
  const regresar = () => {
    setVisible(false);
  };
  useEffect(() => {
    let itemsCons = {};
    let markedCons = {};
    if (
      data !== undefined &&
      data.calendar !== undefined &&
      data.calendar.length > 0
    ) {
      let calendar = data.calendar;
      if (calendar.length > 0) {
        setMinDate(calendar[0].Date);
        setMaxDate(calendar[calendar.length - 1].Date);
        let date = calendar[0].Date;

        while (date <= calendar[calendar.length - 1].Date) {
          let find = false;
          for (let i = 0; i < calendar.length; i++) {
            if (calendar[i].Date.toString() == date.toString()) {
              itemsCons[date.toString()] = [calendar[i]];
              markedCons[date.toString()] = {marked: true};
              find = true;
            }
          }
          if (!find) {
            itemsCons[date] = [{}];
          }
          date = moment(date).add('1', 'day').toISOString().split('T')[0];
        }
        setItems(itemsCons);
        setMarked(markedCons);
      }
    }
    if (
      data !== undefined &&
      data.calendar !== undefined &&
      data.calendar.length == 0
    ) {
      const max_d = moment().toISOString().split('T')[0];
      let date = moment().subtract('8', 'days').toISOString().split('T')[0];
      setMinDate(date);
      setMaxDate(max_d);
      while (date <= max_d) {
        markedCons[date.toString()] = {marked: false};
        itemsCons[date] = [{}];
        date = moment(date).add('1', 'day').toISOString().split('T')[0];
      }
      setItems(itemsCons);
    }
  }, [1]);
  return (
    <>
      <Agenda
        minDate={minDate}
        items={items}
        maxDate={maxDate}
        selected={minDate}
        markedDates={marked}
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
        renderItem={(item: any, firstItemInDay) => {
          if (item.TimeStart == undefined) {
            const key_vacio = 'key_' + Math.random() * 1000000;
            return (
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
                    color: 'brown',
                    fontWeight: '500',
                    fontSize: 25,
                  }}>
                  DIA NO ASISTIDO
                </Text>
              </View>
            );
          }
          const key = item.Date;
          const retorno = item.TimeStart + '-' + item.TimeEnd;
          const estatus =
            item.IsCome == 'Si' || item.IsCome == 'No'
              ? item.IsCome
              : 'Pendiente';
          return (
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
                    estatus == 'Si'
                      ? 'green'
                      : estatus == 'No'
                      ? 'red'
                      : '#C6AC00',
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
                  {estatus == 'Si'
                    ? 'Asistido'
                    : estatus == 'No'
                    ? 'Ausente'
                    : 'Pendiente'}
                </Text>
              </View>
            </View>
          );
        }}
        refreshing={false}></Agenda>

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
    </>
  );
};
export default ModalHistory;
