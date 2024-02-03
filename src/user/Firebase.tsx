import React from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {sanitizationString, validationsObj} from '../support/Support';
import {ApiLog} from '../support/Support';
import {firebase} from '@react-native-firebase/auth';

const delete_user = async (content: any) => {
  //Obtencion Usuario
  await firestore()
    .collection('user')
    .doc(content.email)
    .collection('trainings')
    .get()
    .then(trainigs => {
      trainigs.forEach(async deta => {
        const date = deta.id;
        await firestore()
          .collection('user_training')
          .doc(date)
          .collection('times')
          .where('email', '==', content.email)
          .get()
          .then(det => {
            det.forEach(async detRow => {
              await firestore()
                .collection('user_training')
                .doc(date)
                .collection('times')
                .doc(detRow.id)
                .delete();
            });
          });
        await firestore()
          .collection('user')
          .doc(content.email)
          .collection('trainings')
          .doc(deta.id)
          .delete();
      });
    });
  await firestore()
    .collection('user')
    .doc(content.email)
    .collection('challenge')
    .get()
    .then(async challenge => {
      challenge.forEach(async challengeRow => {
        await firestore()
          .collection('user')
          .doc(content.email)
          .collection('challenge')
          .doc(challengeRow.id)
          .delete();
      });
    });
  await firestore()
    .collection('user')
    .doc(content.email)
    .collection('weights')
    .get()
    .then(async challenge => {
      challenge.forEach(async challengeRow => {
        await firestore()
          .collection('user')
          .doc(content.email)
          .collection('weights')
          .doc(challengeRow.id)
          .delete();
      });
    });
  await firestore().collection('user').doc(content.email).delete();
  await firebase.auth().currentUser?.delete();
};

const fill_info_user = async (content: any) => {
  let code = '999';
  let message = 'Email required';
  let response = null;
  const required = [
    {obj: 'email', isRequired: true, regex: /\S+@\S+\.\S+/},
    {
      obj: 'birthday',
      isRequired: false,
      regex: /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/,
    },
    {
      obj: 'firstName',
      isRequired: false,
      regex: /[a-zA-Z]{2,}/,
    },
    {
      obj: 'lastName',
      isRequired: false,
      regex: /[a-zA-Z]{2,}/,
    },
    {
      obj: 'weight',
      isRequired: false,
      regex: /^[0-9]{2,3}(\.[0-9]{1,2})?$/,
    },
    {
      obj: 'phone',
      isRequired: false,
      regex: /[0-9]{8}/,
    },
  ];
  const returnRequired = validationsObj(content, required);
  if (returnRequired.error) {
    message = returnRequired.message;
    const response = {
      code: code,
      message: message,
    };
    ApiLog(content, response, 'createUser');
    return response;
  }
  code = '000';
  message = 'User created/updated';
  const email = sanitizationString(content.email);
  const firstName = sanitizationString(content.firstName);
  const lastName = sanitizationString(content.lastName);
  const phone = sanitizationString(content.phone);
  const weight = sanitizationString(content.weight);
  const birthday = sanitizationString(content.birthday);
  const photo = sanitizationString(content.photo);
  const data = {
    email,
    birthday,
    firstName,
    lastName,
    weight,
    phone,
    active: content.active !== undefined ? content.active : true,
    infoComplete:
      content.infoComplete !== undefined ? content.infoComplete : true,
    admin: content.admin !== undefined ? content.admin : false,
  };
  await firestore().collection('user').doc(email).update(data);
  let linkPhoto;
  if (
    photo != '' &&
    content.uploadPhoto !== undefined &&
    content.uploadPhoto == true
  ) {
    await storage()
      .ref('/user_logo/' + email + '.png')
      .putString(photo, 'base64');
    linkPhoto = await storage()
      .ref('/user_logo/' + email + '.png')
      .getDownloadURL();
  }

  const responseBody = {
    code,
    message,
    linkPhoto,
  };
  ApiLog(content, responseBody, 'UpdateUser');
  return responseBody;
};
export {fill_info_user, delete_user};
