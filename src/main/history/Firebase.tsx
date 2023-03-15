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
export {history_gym, history_gym_complete};