import React, {useEffect, useState} from 'react';
import {Pressable, Text, TouchableHighlight, View} from 'react-native';
import ItemHistorial from './ItemHistorial';
import {Agenda} from 'react-native-calendars';
import {styles} from '../Styles';
import moment from 'moment';
const ModalHistoryEveryone = ({setVisible, data}) => {
  const [maxDate, setMaxDate] = useState(moment().toISOString().split('T')[0]);
  const [minDate, setMinDate] = useState(
    moment().subtract('8', 'days').toISOString().split('T')[0],
  );
  const [items, setItems] = useState({});
  const [marked, setMarked] = useState({});
  useEffect(() => {
    if (
      data !== undefined &&
      data.calendar !== undefined &&
      data.calendar.length > 0
    ) {
      let calendar = data.calendar;
      setMinDate(calendar[0].date);
      setMaxDate(calendar[calendar.length - 1].date);
      let date = calendar[0].date;
      let itemsCons = {};
      let markedCons = {};
      while (date <= calendar[calendar.length - 1].date) {
        let find = false;
        for (let i = 0; i < calendar.length; i++) {
          if (date.toString() == calendar[i].date.toString()) {
            markedCons[date] = {marked: true};
            itemsCons[date] = [{info: calendar[i].list_user}];
            find = true;
          }
        }
        if (!find) {
          markedCons[date] = {marked: false};
          itemsCons[date] = [{}];
        }
        date = moment(date).add('1', 'day').toISOString().split('T')[0];
      }
      setItems(itemsCons);
      setMarked(markedCons);
    }
  }, [1]);
  return (
    <>
      <Agenda
        minDate={minDate}
        items={items}
        maxDate={maxDate}
        selected={maxDate}
        markedDates={marked}
        renderEmptyData={() => {
          return (
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black'}}>
                ---SIN DATOS---
              </Text>
            </View>
          );
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
        renderItem={(item: any, firstItemInDay) => {
          if (item['info'] === undefined) {
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
          let retornoImpresion = [];
          for (let i = 0; i < item['info'].length; i++) {
            const key =
              item['info'][i].timeStart +
              '-' +
              item['info'][i].timeEnd +
              '-' +
              item['info'][i].user;
            const retorno = item['info'][i].user;
            const time =
              item['info'][i].timeStart + '-' + item['info'][i].timeEnd;
            const estatus =
              item['info'][i].isCome == false
                ? 'Pendiente'
                : item['info'][i].isCome;
            retornoImpresion.push(
              <ItemHistorial key={key + '_item'} item={item['info'][i]} />,
            );
          }
          return <>{retornoImpresion}</>;
        }}
        refreshing={true}></Agenda>
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
export default ModalHistoryEveryone;
