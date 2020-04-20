import ConfigProvider, { ConfigBuilder } from '@react-form-fields/native-base/ConfigProvider';
import langConfig from '@react-form-fields/native-base/ConfigProvider/langs/pt-br';
import { CommonActions, NavigationContainerRef, Route } from '@react-navigation/native';
import { Root } from 'native-base';
import React, { memo, useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'react-native-elements';
import FlashMessage from 'react-native-flash-message';
import { MenuProvider } from 'react-native-popup-menu';
import { useObservable } from 'react-use-observable';
import { of } from 'rxjs';
import { delay, filter, switchMap, tap } from 'rxjs/operators';
import Loader from '~/components/Shared/Loader';

import theme from './assets/theme';
import Navigator from './components/Navigator';
import { InteractionManager } from './facades/interactionManager';
import Toast from './facades/toast';
import { setupServices } from './services';
import cacheService from './services/cache';
import tokenService from './services/token';

const config = new ConfigBuilder()
  .fromLang(langConfig)
  .setValidationOn('onSubmit')
  .setIconProps({ type: 'MaterialCommunityIcons' }, 'chevron-down', 'magnify', 'close')
  .setItemProps({ floatingLabel: false })
  .build();

const App = memo(() => {
  const navigatorRef = useRef<NavigationContainerRef>();
  const [currentScreen, setCurrentScreen] = useState<Route<string>>();

  useEffect(() => setupServices(navigatorRef.current), [navigatorRef]);

  useObservable(() => {
    if (true) return of(null);

    return tokenService.getTokens().pipe(
      filter(tokens => !tokens),
      delay(1000),
      switchMap(() => InteractionManager.runAfterInteractions()),
      filter(() => currentScreen.name !== 'Login'),
      switchMap(() => cacheService.clear()),
      tap(() => {
        navigatorRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Index', params: { logout: true } }]
          })
        );
      }),
      tap(() => Toast.showError('Sessão inválida'))
    );
  }, [navigatorRef, currentScreen]);

  return (
    <ThemeProvider theme={theme}>
      <MenuProvider>
        <ConfigProvider value={config}>
          <Root>
            <Loader />
            <Navigator ref={navigatorRef} onStateChange={setCurrentScreen} />
            <FlashMessage position='top' />
          </Root>
        </ConfigProvider>
      </MenuProvider>
    </ThemeProvider>
  );
});

export default App;
