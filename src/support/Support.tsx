import React, {useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
const ApiLog = (req, res, method) => {
  const event = new Date(Date.now());
  const collection = firestore().collection('log');
  let newReq = {};
  let newRes = {};
  for (const [key, value] of Object.entries(req)) {
    if (typeof value === 'string' && value.toString().length < 1000) {
      newReq[key] = value;
    } else {
      newReq[key] = '[BLOB]';
    }
  }
  for (const [key, value] of Object.entries(res)) {
    if (typeof value === 'string' && value.toString().length < 1000) {
      newRes[key] = value;
    } else {
      newRes[key] = '[BLOB]';
    }
  }
  req = newReq;
  res = newRes;
  const data = {
    req: req,
    res: res,
    time: event.toLocaleString(),
    method: method,
  };
  //get date format in javascript?
  var timestamp = new Date().toISOString();
  collection.doc(timestamp).set(data);
};
async function SaveObjectKey(data: any, collection_name: string, key: string) {
  const collection = firestore().collection(collection_name).doc(key);
  await collection.set(data);
}
const validationsObj = (data: any, validations: any) => {
  for (let i = 0; i < validations.length; i++) {
    const isRequired = validations[i].isRequired;
    const regex = validations[i].regex;
    const obj = validations[i].obj;
    if (
      isRequired &&
      (data[obj] === undefined || data[obj].toString().trim() == '')
    ) {
      return {error: true, message: 'The field ' + obj + ' is required.'};
    }
    if (
      data[obj].toString().trim() != '' &&
      regex !== undefined &&
      regex != '' &&
      data[obj] !== undefined
    ) {
      if (!regex.test(data[obj])) {
        return {error: true, message: 'The field ' + obj + ' is invalid.'};
      }
    }
  }
  return {error: false, message: ''};
};
function sanitizationString(obj: any) {
  if (obj !== undefined) {
    try {
      return obj.toString().trim();
    } catch (e) {
      return '';
    }
  } else {
    return '';
  }
}
const sendNotification = (head, body, tokens) => {
  if (tokens.length > 0) {
    const message = {
      notification: {
        title: head,
        body,
      },
      tokens: tokens,
      sended: false,
      time: moment().toISOString(),
    };
    firestore().collection('notification').add(message);
  }
};
const sendNotificationAdmin = async (head, body) => {
  firestore()
    .collection('user')
    .where('admin', '==', true)
    .get()
    .then(listado => {
      let listado_tokens = [];
      listado.forEach(item => {
        if (item.get('phoneToken').toString() != '') {
          listado_tokens.push(item.get('phoneToken').toString());
        }
      });
      const message = {
        notification: {
          title: head,
          body,
        },
        tokens: listado_tokens,
        sended: false,
        time: moment().toISOString(),
      };
      firestore().collection('notification').add(message);
    });
};
export {
  validationsObj,
  sanitizationString,
  SaveObjectKey,
  ApiLog,
  sendNotification,
  sendNotificationAdmin,
};
