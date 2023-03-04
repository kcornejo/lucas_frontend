import React from 'react';
import {Alert} from 'react-native';
const ErrorToken = ({message, setUserLucas}) => {
  if (
    message.toString().search('Unexpected token') ||
    message.toString().search('Forbidden')
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
    console.warn(message);
  }
};
export default {ErrorToken};
