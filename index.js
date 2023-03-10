/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

Platform.OS !== 'ios' &&
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {});
AppRegistry.registerComponent(appName, () => App);
