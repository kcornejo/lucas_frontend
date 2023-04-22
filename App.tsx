import React, {useState, useEffect} from 'react';
import Login from './src/security/Login';
import {NavigationContainer} from '@react-navigation/native';
import Index from './src/main/Index';
import FillInformation from './src/user/FillInformation';
import {requestUserPermission, Listener} from './src/support/Notification';
import {NativeBaseProvider} from 'native-base';
import {LucasContext} from './src/support/Contexts';
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
  return (
    <LucasContext.Provider value={[userLucas, setUserLucas]}>
      <NativeBaseProvider>
        {userLucas.auth ? (
          <>
            {userLucas.infoComplete ? (
              <NavigationContainer>
                <Index />
              </NavigationContainer>
            ) : (
              <FillInformation />
            )}
          </>
        ) : (
          <Login />
        )}
      </NativeBaseProvider>
    </LucasContext.Provider>
  );
};

export default App;
