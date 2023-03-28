import React from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {sanitizationString, validationsObj} from '../support/Support';
import {ApiLog, SaveObjectKey} from '../support/Support';

const login_firebase = async (contenido: {}) => {
  let token = '';
  let code = '999';
  let message = 'System error';
  let data = null;
  //Validation Data
  const required = [
    {obj: 'email', isRequired: true, regex: /\S+@\S+\.\S+/},
    {obj: 'password', isRequired: true, regex: /[0-9a-zA-Z]{6,}/},
  ];
  const returnRequired = validationsObj(contenido, required);
  if (returnRequired.error) {
    message = returnRequired.message;
    const response = {
      code: code,
      message: message,
      token: token,
      data: data,
    };
    return response;
  }
  const email = sanitizationString(contenido.email);
  const password = contenido.password;
  const phoneToken = contenido.phoneToken;
  try {
    await auth().signOut();
  } catch (e) {}
  await auth()
    .signInWithEmailAndPassword(email, password)
    .then(async userCredential => {
      // Validation EmailVerified
      if (userCredential.user.emailVerified) {
        code = '000';
        message = 'valid';
        const reff = await firestore().collection('user').doc(email).get();
        if (reff.exists == true) {
          data = reff.data();
          await firestore().collection('user').doc(email).update({phoneToken});
          try {
            const storageRef = await storage()
              .ref('/user_logo/' + email + '.png')
              .getDownloadURL();
            data.photo = storageRef;
          } catch (e) {
            data.photo = '';
          }
        }
      } else {
        code = '001';
        message = 'Email not verified';
      }
    })
    .catch(error => {
      code = '999';
      message = error.message;
    });
  const response = {code: code, message: message, token: token, data: data};
  ApiLog(contenido, response, 'validateUser');
  return response;
};
const forgot_password = async (content: any) => {
  let code = '999';
  let message = 'System Error';
  const required = [{obj: 'email', isRequired: true, regex: /\S+@\S+\.\S+/}];
  //ValidationInputs
  const returnRequired = validationsObj(content, required);
  if (returnRequired.error) {
    message = returnRequired.message;
    const response = {
      code: code,
      message: message,
    };
    ApiLog(content, response, 'changePasswordReact');
    return response;
  }
  const email = sanitizationString(content.email);
  await auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      code = '000';
      message = 'Email sended';
    })
    .catch(e => {
      if (e.message.toString().search('auth/user-not-found') >= 0) {
        code = '000';
        message = 'Email sended';
      } else {
        code = '999';
        message = 'Email error ' + e.message;
      }
    });
  const response = {code, message};
  ApiLog(content, response, 'changePasswordReact');
  return response;
};
const new_user = async (content: any) => {
  let code = '999';
  let message = 'System error';
  const required = [
    {obj: 'email', isRequired: true, regex: /\S+@\S+\.\S+/},
    {obj: 'password', isRequired: true, regex: /[0-9a-zA-Z]{6,}/},
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

  const email = sanitizationString(content.email);
  const password = sanitizationString(content.password);
  await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(credential => {
      code = '000';
      message = 'User created';
      const data = {
        uid: credential.user.uid,
        email: email,
        active: true,
        admin: false,
        infoComplete: false,
      };
      credential.user.sendEmailVerification();
      SaveObjectKey(data, 'user', email);
    })
    .catch(error => {
      code = '999';
      message = 'User error ' + error;
    });
  const response = {code, message};
  ApiLog(content, response, 'createUser');
  return response;
};
export {login_firebase, forgot_password, new_user};
