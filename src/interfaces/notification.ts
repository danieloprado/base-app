import { NavigationContainerRef } from '@react-navigation/native';
import { Notification } from 'react-native-firebase/notifications';

export interface INotification extends Notification {
  data: INotificationData;
}

export interface INotificationData {
  action?: string;
  userId?: string;
  [key: string]: any;
}

export interface INotificationHandler {
  (notification: INotificationData, navigatorRef: NavigationContainerRef, appStarted: boolean): Promise<boolean>;
}
