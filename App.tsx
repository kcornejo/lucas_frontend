import React, {useState, useEffect} from 'react';
import Login from './src/security/Login';
import {NavigationContainer} from '@react-navigation/native';
import Index from './src/main/Index';
import {BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FillInformation from './src/user/FillInformation';
const App = () => {
  var [logueado, setLogueado] = useState(false);
  var [infoLlena, setInfoLlena] = useState(false);
  var [email, setEmail] = useState('');
  var [usuario, setUsuario] = useState('');
  useEffect(() => {
    if (logueado == true && email.toString().length > 0) {
      const obtenciontoken = async () => {
        const token = await AsyncStorage.getItem('@token');
        return token;
      };
      obtenciontoken().then(token => {
        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + token);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };

        fetch(
          BASE_URL + '/api/user/getUserByEmail?email=' + email,
          requestOptions,
        )
          .then(response => response.text())
          .then(result => {
            const data = JSON.parse(result);
            if (Object.keys(data.userDetail).length == 0) {
              setInfoLlena(false);
            } else {
              setInfoLlena(true);
              setUsuario(
                data.userDetail.firstName.toString() +
                  ' ' +
                  data.userDetail.lastName.toString(),
              );
            }
          })
          .catch(error => console.log('error', error));
      });
    }
  });
  if (logueado) {
    if (infoLlena) {
      return (
        <NavigationContainer>
          <Index setLogueado={setLogueado} usuario={usuario} />
        </NavigationContainer>
      );
    } else {
      return (
        <FillInformation
          email={email}
          setUsuario={setUsuario}
          setInfoLlena={setInfoLlena}
        />
      );
    }
  } else {
    return <Login setLogueado={setLogueado} setEmail={setEmail} />;
  }
};

export default App;
