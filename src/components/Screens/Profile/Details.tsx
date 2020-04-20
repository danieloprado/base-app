import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { Fragment, memo, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';
import { useCallbackObservable, useRetryableObservable } from 'react-use-observable';
import { filter, switchMap } from 'rxjs/operators';
import theme from '~/assets/theme';
import Content from '~/components/Shared/Content';
import ErrorMessage from '~/components/Shared/ErrorMessage';
import IconMessage from '~/components/Shared/IconMessage';
import Alert from '~/facades/alert';
import { loader } from '~/helpers/rxjs-operators/loader';
import { logError } from '~/helpers/rxjs-operators/logError';
import { useHeaderOptions } from '~/hooks/useHeaderOptions';
import userService from '~/services/user';

const ProfileScreen = memo(() => {
  const navigation = useNavigation();

  const [user, error, , reload] = useRetryableObservable(() => {
    return userService.get().pipe(logError());
  }, []);

  const [logout] = useCallbackObservable(() => {
    return Alert.confirm('Confirmar', 'Deseja realmente sair?', 'Sim', 'Não').pipe(
      filter(ok => ok),
      switchMap(() => userService.logout().pipe(loader())),
      logError()
    );
  }, []);

  const navigateEdit = useCallback(() => navigation.navigate('ProfileEdit'), [navigation]);
  const navigateLogin = useCallback(() => navigation.navigate('Login', { force: true }), [navigation]);

  useHeaderOptions(
    () => ({
      headerTitle: 'Perfil',
      headerRight: ({ tintColor }: any) =>
        user && <Button type='clear' onPress={navigateEdit} icon={{ name: 'pencil', color: tintColor }} />
    }),
    [user, navigateEdit]
  );

  useFocusEffect(reload);

  const loading = user === undefined && error === undefined;

  return (
    <Fragment>
      {loading && (
        <Content>
          <ActivityIndicator size='large' />
        </Content>
      )}

      {!loading && !user && error && (
        <Content>
          <ErrorMessage error={error} />
        </Content>
      )}

      {!loading && !user && !error && (
        <Content>
          <IconMessage
            icon='account-circle'
            message='Ainda não te conhecemos, mas gostaríamos de saber mais sobre você!'
            button='Entrar'
            onPress={navigateLogin}
          />
        </Content>
      )}

      {!loading && user && (
        <View>
          <View style={styles.header}>
            <Icon name='account-circle' color='white' size={80} />
            <Text h3 style={styles.headerText}>
              {`${user.firstName} ${user.lastName ?? ''}`.trim()}
            </Text>
          </View>
          <Button style={styles.logoutButton} onPress={logout} title='Sair' />
        </View>
      )}
    </Fragment>
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    color: 'white'
  },
  logoutButton: {
    margin: 16
  }
});

export default ProfileScreen;
