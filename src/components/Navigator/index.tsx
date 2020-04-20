// @refresh reset
import { NavigationContainer, NavigationContainerRef, NavigationState, Route } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import snakeCase from 'lodash/snakeCase';
import React, { forwardRef, memo, RefAttributes, useCallback, useContext, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { ThemeContext } from 'react-native-elements';
import firebase from 'react-native-firebase';
import logService from '~/services/log';

import IndexScreen from '../Screens';
import HomeScreen from '../Screens/Home';
import LoginScreen from '../Screens/Login';
import ProfileScreen from '../Screens/Profile/Details';
import ProfileEditScreen from '../Screens/Profile/Form';

const Stack = createStackNavigator();

interface IProps extends RefAttributes<NavigationContainerRef> {
  onStateChange: (route: Route<string>) => void;
}

const Navigator = memo<IProps>(
  forwardRef(({ onStateChange }, ref: () => NavigationContainerRef) => {
    const { theme } = useContext(ThemeContext);

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

    const screenOptions = useMemo<StackNavigationOptions>(
      () => ({
        headerStyle: {
          backgroundColor: theme.colors.primary,
          shadowRadius: 0,
          shadowColor: 'transparent',
          shadowOffset: { height: 0, width: 0 }
        },
        headerTitleStyle: { color: 'white' },
        headerTruncatedBackTitle: 'Voltar',
        headerTintColor: 'white'
      }),
      [theme]
    );

    return (
      <NavigationContainer ref={ref} onStateChange={handleStateChange}>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name='Index' component={IndexScreen} />
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Profile' component={ProfileScreen} />
          <Stack.Screen name='ProfileEdit' component={ProfileEditScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  })
);

export default Navigator;
