import { useNavigation } from '@react-navigation/native';
import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useObservable } from 'react-use-observable';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import { IS_DEV } from '~/config';
import { logError } from '~/helpers/rxjs-operators/logError';
import { appDefaultNavigation, appOpened } from '~/services';
import tokenService from '~/services/token';

const IndexScreen = memo(() => {
  const navigation = useNavigation();

  useEffect(() => {
    appOpened();
  }, []);

  useObservable(() => {
    if (IS_DEV) SplashScreen.hide();

    return appDefaultNavigation().pipe(
      first(),
      filter(ok => ok),
      switchMap(() => tokenService.isAuthenticated()),
      tap(isAuthenticated => {
        setTimeout(() => SplashScreen.hide(), 500);

        navigation.reset({
          index: 0,
          routes: [{ name: isAuthenticated ? 'Home' : 'Login' }]
        });
      }),
      logError()
    );
  }, []);

  return <View />;
});

IndexScreen.navigationOptions = () => {
  return {
    header: () => null
  };
};

export default IndexScreen;
