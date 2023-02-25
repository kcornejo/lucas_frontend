import React, {useState, useEffect} from 'react';
import Login from './src/security/Login';
import {NavigationContainer} from '@react-navigation/native';
import Index from './src/main/Index';
import FillInformation from './src/user/FillInformation';
import {requestUserPermission, Listener} from './src/support/Notification';
const App = () => {
  useEffect(() => {
    requestUserPermission();
    Listener();
  }, []);
  const [userLucas, setUserLucas] = useState({
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
  if (userLucas.auth) {
    if (userLucas.infoComplete) {
      return (
        <NavigationContainer>
          <Index setUserLucas={setUserLucas} userLucas={userLucas} />
        </NavigationContainer>
      );
    } else {
      return (
        <FillInformation setUserLucas={setUserLucas} userLucas={userLucas} />
      );
    }
  } else {
    return <Login setUserLucas={setUserLucas} />;
  }
};

export default App;
