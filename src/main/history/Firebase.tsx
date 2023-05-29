import React from 'react';
import {
  validationsObj,
  sanitizationString,
  ApiLog,
} from '../../support/Support';
import firestore from '@react-native-firebase/firestore';
const history_gym_complete = async (content: any) => {
  let code = '000';
  let message = 'Success';
  let calendar = [];

  const days = await firestore()
    .collection('user_training')
    .get()
    .then(async retorno => {
      let days = [];
      retorno.forEach(async item => {
        days.push(item.id);
      });
      return days;
    });
  for (let i = 0; i < days.length; i++) {
    await firestore()
      .collection('user_training')
      .doc(days[i])
      .collection('times')
      .get()
      .then(detail => {
        let list_user = [];
        detail.forEach(detail_data => {
          list_user.push({
            timeStart: detail_data.get('TimeStart'),
            timeEnd: detail_data.get('TimeEnd'),
            isCome: detail_data.get('isCome'),
            user: detail_data.get('user'),
            date: days[i],
            id: detail_data.id,
            email: detail_data.get('email'),
          });
        });
        calendar.push({
          date: days[i],
          list_user,
        });
      });
  }
  const responseBody = {
    code,
    message,
    calendar,
  };
  ApiLog(content, responseBody, 'calendarListHistory');
  return responseBody;
};
const history_gym = async (content: any) => {
  let code = '999';
  let message = 'Error';
  let calendar = [];
  const required = [{obj: 'email', isRequired: true, regex: /\S+@\S+\.\S+/}];
  const returnRequired = validationsObj(content, required);
  if (returnRequired.error) {
    message = returnRequired.message;
    const response = {
      code,
      message: returnRequired.message,
      calendar,
    };
    ApiLog(content, response, 'calendarListUser');
    return response;
  }
  const email = sanitizationString(content.email);
  code = '000';
  message = 'Success';
  let trainings = await firestore()
    .collection('user')
    .doc(email)
    .collection('trainings')
    .get();
  trainings.forEach(item => {
    calendar.push({
      Date: item.id,
      TimeStart: item.get('TimeStart'),
      TimeEnd: item.get('TimeEnd'),
      IsCome: item.get('isCome'),
    });
  });
  const responseBody = {
    code,
    message,
    calendar,
  };
  ApiLog(content, responseBody, 'calendarListUser');
  return responseBody;
};
const confirm_assitance = async (user, date, id, isCome) => {
  //User
  await firestore()
    .collection('user')
    .doc(user)
    .collection('trainings')
    .doc(date)
    .update({isCome: isCome});
  //User Trainings
  await firestore()
    .collection('user_training')
    .doc(date)
    .collection('times')
    .doc(id)
    .update({isCome: isCome});
};
const get_weights = async (user: '') => {
  let retorno = [];
  //User
  await firestore()
    .collection('user')
    .doc(user)
    .collection('weights')
    .orderBy('fecha', 'desc')
    .limit(4)
    .get()
    .then(data => {
      data.forEach(row => {
        const data = row.data();
        retorno.push({
          abdomen: data.abdomen,
          cintura: data.cintura,
          cadera: data.cadera,
          pierna: data.pierna,
          brazo: data.brazo,
          fecha: data.fecha,
        });
      });
    })
    .catch();
  return retorno;
};
const get_list_user = async () => {
  let retorno = [];
  //User
  await firestore()
    .collection('user')
    .get()
    .then(data => {
      data.forEach(row => {
        const data = row.data();
        retorno.push({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      });
    })
    .catch();
  return retorno;
};
const get_list_challenge = async email => {
  let retorno = [];
  //User
  await firestore()
    .collection('user')
    .doc(email)
    .collection('challenge')
    .orderBy('fecha')
    .get()
    .then(data => {
      data.forEach(row => {
        const data = row.data();
        retorno.push({
          tiempo: data.tiempoChallenge,
          detalle: data.detalleChallenge,
          fecha: data.fecha,
        });
      });
    })
    .catch();
  return retorno;
};
export {
  history_gym,
  history_gym_complete,
  confirm_assitance,
  get_weights,
  get_list_user,
  get_list_challenge,
};
