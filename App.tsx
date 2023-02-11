import React, {useState} from 'react';
import Login from './src/security/Login';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Index from './src/main/Index';
const App = () => {
  var [logueado, setLogueado] = useState(false);
  return (
    <NavigationContainer>
      {logueado ? (
        <Index setLogueado={setLogueado} />
      ) : (
        <Login setLogueado={setLogueado} />
      )}
    </NavigationContainer>
  );
};

export default App;
