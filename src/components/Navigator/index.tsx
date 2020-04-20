// @refresh reset
import { NavigationContainer, NavigationContainerRef, NavigationState, Route } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import snakeCase from 'lodash/snakeCase';
import React, { forwardRef, memo, RefAttributes, useCallback } from 'react';
import { Keyboard } from 'react-native';
import firebase from 'react-native-firebase';
import logService from '~/services/log';

import IndexScreen from '../Screens';
import HomeScreen from '../Screens/Home';
import LoginScreen from '../Screens/Login';

const Stack = createStackNavigator();

interface IProps extends RefAttributes<NavigationContainerRef> {
  onStateChange: (route: Route<string>) => void;
}

const Navigator = memo<IProps>(
  forwardRef(({ onStateChange }, ref: () => NavigationContainerRef) => {
    const handleStateChange = useCallback(
      (state: NavigationState) => {
        Keyboard.dismiss();

        if (!state || !state.routes || !state.routes.length) return;

        const route = state.routes[state.index];
        onStateChange(route);
        logService.breadcrumb(route.name, 'navigation', route.params);
        firebase.analytics().logEvent(snakeCase(`screen_${route.name}`));
      },
      [onStateChange]
    );

    return (
      <NavigationContainer ref={ref} onStateChange={handleStateChange}>
        <Stack.Navigator>
          <Stack.Screen name='Index' component={IndexScreen} options={IndexScreen.navigationOptions} />
          <Stack.Screen name='Home' component={HomeScreen} options={HomeScreen.navigationOptions} />
          <Stack.Screen name='Login' component={LoginScreen} options={LoginScreen.navigationOptions} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  })
);

export default Navigator;
