import React from 'react';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    return getFCMToken();
  } else {
    return '';
  }
}
async function getFCMToken() {
  let token = await messaging().getToken();
  return token;
}
const Listener = () => {
  messaging().onNotificationOpenedApp(async remoteMessage => {
    await onDisplayNotification(
      remoteMessage.data.head.toString(),
      remoteMessage.data.body.toString(),
    );
  });
  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      if (remoteMessage) {
        await onDisplayNotification(
          remoteMessage.data.head.toString(),
          remoteMessage.data.body.toString(),
        );
      }
    });
  messaging().onMessage(async remoteMessage => {
    await onDisplayNotification(
      remoteMessage.data.head.toString(),
      remoteMessage.data.body.toString(),
    );
  });
};
async function onDisplayNotification(head: string, body: string) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: head,
    body: body,
    android: {
      channelId,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
export {Listener, requestUserPermission, onDisplayNotification};
