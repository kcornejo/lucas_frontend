import React from 'react';
import {
  validationsObj,
  ApiLog,
  sanitizationString,
  sendNotification,
  sendNotificationAdmin,
} from '../../support/Support';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
const list_schedule_avail = async (content: any) => {
  let errorCode = '999';
  let errorMessage = 'Error';
  let calendar = [];
  const required = [{obj: 'email', isRequired: true, regex: /\S+@\S+\.\S+/}];
  const returnRequired = validationsObj(content, required);
  if (returnRequired.error) {
    errorMessage = returnRequired.message;
    const response = {
      code: errorCode,
      message: errorMessage,
      calendar,
    };
    ApiLog(content, response, 'calendarList');
    return response;
  }
  const email = sanitizationString(content.email);
  const build_calendar = async () => {
    let list_days = [];
    const list_day_spanish = [
      {key: '0', day: 'domingo'},
      {key: '1', day: 'lunes'},
      {key: '2', day: 'martes'},
      {key: '3', day: 'miercoles'},
      {key: '4', day: 'jueves'},
      {key: '5', day: 'viernes'},
      {key: '6', day: 'sabado'},
    ];
    const ref = firestore().collection('calendar');
    for (let i = 0; i < list_day_spanish.length; i++) {
      const day = await ref
        .doc(list_day_spanish[i].day)
        .collection('times')
        .get();
      let list_hours = [];
      day.forEach(child => {
        list_hours.push({
          TimeStart: child.get('TimeStart'),
          TimeEnd: child.get('TimeEnd'),
          Active: child.get('Active'),
        });
      });
      list_days.push({
        key: list_day_spanish[i].key,
        day: list_day_spanish[i].day,
        times: list_hours,
      });
      errorCode = '000';
      errorMessage = 'Success';
    }
    return list_days;
  };
  //Horarios En total
  const calendar_db = await build_calendar();
  let day_today = moment().format('d');
  let hour_now = moment().format('H');
  const ref = await firestore()
    .collection('user')
    .doc(email)
    .collection('trainings')
    .get();
  let scheduled = false;
  const max_reservation_q = await firestore()
    .collection('config')
    .doc('general')
    .get();
  const max_reservation = max_reservation_q.get('max_reservation');
  let avail = true;
  for (let i = 0; i < 7; i++) {
    const max_reservation_q = await firestore()
      .collection('user_training')
      .doc(moment().add(i, 'd').format().split('T')[0])
      .collection('times')
      .get();
    const day = calendar_db.find(o => o.key == day_today);
    let new_hour = [];
    for (let j = 0; j < day.times.length; j++) {
      if (day.times[j].Active == true) {
        //Reservaciones por hora
        let reservations = 0;
        max_reservation_q.forEach(item => {
          if (item.data().TimeStart == day.times[j].TimeStart) {
            reservations++;
          }
        });
        avail = max_reservation - reservations == 0 ? false : true;
        //Horario de hoy
        if (i == 0) {
          const hour_now_int = parseInt(hour_now.toString().split(':')[0]);
          const hour_db_int = parseInt(day.times[j].TimeStart.split(':')[0]);
          if (hour_now_int < hour_db_int) {
            scheduled = false;
            ref.forEach(item => {
              if (
                moment().add(i, 'd').format().split('T')[0] ==
                  item.id.toString() &&
                item.get('TimeStart').toString() ==
                  day.times[j].TimeStart.toString()
              ) {
                scheduled = true;
              }
            });
            let insert = day.times[j];
            insert = {...insert, Scheduled: scheduled, Avail: avail};
            new_hour.push(insert);
          }
        } else {
          scheduled = false;
          ref.forEach(item => {
            if (
              moment().add(i, 'd').format().split('T')[0] ==
                item.id.toString() &&
              item.get('TimeStart').toString() ==
                day.times[j].TimeStart.toString()
            ) {
              scheduled = true;
            }
          });
          let insert = day.times[j];
          insert = {...insert, Scheduled: scheduled, Avail: avail};
          new_hour.push(insert);
        }
      }
    }
    new_hour.sort(function (a, b) {
      return a.TimeStart.localeCompare(b.TimeStart);
    });
    calendar.push({
      date: moment().add(i, 'd').format().split('T')[0],
      times: new_hour,
    });
    day_today++;
    if (day_today == 7) {
      day_today = 0;
    }
  }
  const responseBody = {
    code: errorCode,
    message: errorMessage,
    calendar: calendar,
  };
  ApiLog(content, responseBody, 'calendarList');
  return responseBody;
};
const new_exercise = async (content: any) => {
  let code = '';
  let message = '';
  let response = null;

  const required = [
    {obj: 'email', isRequired: true, regex: /\S+@\S+\.\S+/},
    {
      obj: 'date',
      isRequired: true,
      regex: /[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}/,
    },
    {obj: 'timeStart', isRequired: true, regex: /[0-9]{1,2}\:[0-9]{2}/},
    {obj: 'timeEnd', isRequired: true, regex: /[0-9]{1,2}\:[0-9]{2}/},
  ];
  const returnRequired = validationsObj(content, required);
  if (returnRequired.error) {
    code = '999';
    message = returnRequired.message;
    const response = {
      code,
      message: returnRequired.message,
    };
    ApiLog(content, response, 'UserCalendar');
    return response;
  }
  const email = sanitizationString(content.email);
  const TimeStart = sanitizationString(content.timeStart);
  const TimeEnd = sanitizationString(content.timeEnd);
  const date = sanitizationString(content.date);
  const user = await firestore().collection('user').doc(email).get();
  code = '000';
  message = 'Schedule created';
  const object_add = {
    TimeStart,
    TimeEnd,
    isCome: 'Pendiente',
    user: user.get('firstName') + ' ' + user.get('lastName'),
    email: email,
  };
  await firestore()
    .collection('user')
    .doc(email)
    .collection('trainings')
    .doc(date)
    .set(object_add);
  await firestore()
    .collection('user_training')
    .doc(date)
    .set({dateValid: true});
  const delete_f = await firestore()
    .collection('user_training')
    .doc(date)
    .collection('times')
    .where('email', '==', email)
    .get();
  delete_f.forEach(async item => {
    await firestore()
      .collection('user_training')
      .doc(date)
      .collection('times')
      .doc(item.id)
      .delete();
  });
  await firestore()
    .collection('user_training')
    .doc(date)
    .collection('times')
    .add(object_add);
  sendNotification(
    'Entreno registrado',
    'Entreno registrado el dia ' +
      date +
      ' (' +
      TimeStart +
      '-' +
      TimeEnd +
      ')',
    [user.get('phoneToken').toString()],
  );
  sendNotificationAdmin(
    'Entreno registrado',
    'El usuario ' +
      user.get('firstName').toString() +
      ' ' +
      user.get('lastName').toString() +
      ' se ha registrado para el dia ' +
      date +
      ' (' +
      TimeStart +
      '-' +
      TimeEnd +
      ')',
  );
  const responseBody = {
    code,
    message,
  };
  ApiLog(content, responseBody, 'UserCalendar');
  return responseBody;
};
const delete_exercise = async (content: any) => {
  let code = '';
  let message = '';
  let response = null;
  const required = [
    {obj: 'email', isRequired: true, regex: /\S+@\S+\.\S+/},
    {
      obj: 'date',
      isRequired: true,
      regex: /[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}/,
    },
    {obj: 'timeStart', isRequired: true, regex: /[0-9]{1,2}\:[0-9]{2}/},
    {obj: 'timeEnd', isRequired: true, regex: /[0-9]{1,2}\:[0-9]{2}/},
  ];
  const returnRequired = validationsObj(content, required);
  if (returnRequired.error) {
    code = '999';
    message = returnRequired.message;
    const response = {
      code,
      message: returnRequired.message,
    };
    ApiLog(content, response, 'UserCalendarDelete');
    return response;
  }
  const email = sanitizationString(content.email);
  const TimeStart = sanitizationString(content.timeStart);
  const TimeEnd = sanitizationString(content.timeEnd);
  const date = sanitizationString(content.date);
  code = '000';
  message = 'Schedule deleted';
  await firestore()
    .collection('user')
    .doc(email)
    .collection('trainings')
    .doc(date)
    .delete();
  const delete_f = await firestore()
    .collection('user_training')
    .doc(date)
    .collection('times')
    .where('email', '==', email)
    .get();
  delete_f.forEach(async item => {
    await firestore()
      .collection('user_training')
      .doc(date)
      .collection('times')
      .doc(item.id)
      .delete();
  });
  //validationObject user_training
  const validationObj = await firestore()
    .collection('user_training')
    .doc(date)
    .collection('times')
    .get();
  if (validationObj.size == 0) {
    await firestore().collection('user_training').doc(date).delete();
  }
  const user = await firestore().collection('user').doc(email).get();
  sendNotification(
    'Entreno eliminado',
    'Entreno eliminado para el dia ' +
      date +
      ' (' +
      TimeStart +
      '-' +
      TimeEnd +
      ')',
    [user.get('phoneToken').toString()],
  );
  sendNotificationAdmin(
    'Entreno eliminado',
    'El usuario ' +
      user.get('firstName').toString() +
      ' ' +
      user.get('lastName').toString() +
      ' ha eliminado el entreno para el dia ' +
      date +
      ' (' +
      TimeStart +
      '-' +
      TimeEnd +
      ')',
  );
  const responseBody = {
    code,
    message,
  };
  ApiLog(content, responseBody, 'UserCalendarDelete');
  return responseBody;
};
const get_weights = async (content: any) => {
  const email = sanitizationString(content.email);
  const user = (await firestore().collection('user').doc(email).get()).data();
  return {
    brazo: user.brazo !== undefined ? user.brazo : '0',
    cintura: user.cintura !== undefined ? user.cintura : '0',
    abdomen: user.abdomen !== undefined ? user.abdomen : '0',
    cadera: user.cadera !== undefined ? user.cadera : '0',
    pierna: user.pierna !== undefined ? user.pierna : '0',
  };
};
const set_weights = async (content: any) => {
  const email = sanitizationString(content.email);
  const brazo = sanitizationString(content.brazo);
  const cintura = sanitizationString(content.cintura);
  const abdomen = sanitizationString(content.abdomen);
  const cadera = sanitizationString(content.cadera);
  const pierna = sanitizationString(content.pierna);
  const update = {
    brazo,
    cintura,
    abdomen,
    cadera,
    pierna,
  };
  await firestore().collection('user').doc(email).update(update);
  const weights = {...update, fecha: moment().toISOString().split('T')[0]};
  await firestore()
    .collection('user')
    .doc(email)
    .collection('weights')
    .add(weights);
};
export {
  list_schedule_avail,
  new_exercise,
  delete_exercise,
  get_weights,
  set_weights,
};
