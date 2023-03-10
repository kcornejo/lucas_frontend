import React, {useContext} from 'react';
import {Alert} from 'react-native';
import {BASE_URL} from '@env';
const ErrorToken = ({message, setUserLucas}) => {
  if (
    message.toString().search('Unexpected token') >= 0 ||
    message.toString().search('Forbidden') >= 0
  ) {
    Alert.alert(
      'Error de timeout',
      'Se cerrara la sesión por exceder el tiempo limite de sesión',
      [
        {
          onPress: () => {
            setUserLucas({
              firstName: '',
              lastName: '',
              email: '',
              weight: '',
              birthday: '',
              active: false,
              phone: '',
              infoComplete: false,
              auth: false,
              token: '',
            });
          },
        },
      ],
    );
  } else {
    //console.warn(message);
  }
};

const RequestApiAsync = async ({
  method,
  url,
  body,
  login,
  userLucas,
  setUserLucas,
}) => {
  var headers = new Headers();
  if (login) {
    headers.append('Authorization', 'Bearer ' + userLucas.token);
  }
  headers.append('Content-Type', 'application/json');
  var requestOptions = {
    headers,
    redirect: 'follow',
    method,
  };
  if (method == 'POST') {
    requestOptions['body'] = body;
  }

  let ret = null;
  let base_url = 'http://44.197.240.18:3000';
  await fetch(base_url + url, requestOptions)
    //await fetch(BASE_URL + url, requestOptions)
    .then(response => response.text())
    .then(retorno => {
      ret = retorno;
    })
    .catch(error => {
      if (login) {
        ErrorToken({message: error.message, setUserLucas});
      }
    });
  if (typeof ret === 'string' && ret == 'Forbidden') {
    if (login) {
      ErrorToken({message: 'Forbidden', setUserLucas});
    }
  } else {
    return ret;
  }
};
export {RequestApiAsync, ErrorToken};
