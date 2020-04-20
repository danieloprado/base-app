import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'native-base';
import React, { memo, useCallback } from 'react';
import { useObservable } from 'react-use-observable';
import { logError } from '~/helpers/rxjs-operators/logError';
import userService from '~/services/user';

const WelcomeCard = memo(() => {
  const navigation = useNavigation();

  const [user] = useObservable(() => {
    return userService.get().pipe(logError());
  }, []);

  const navigateLogin = useCallback(() => navigation.navigate('Login'), [navigation]);
  const navigateProfile = useCallback(() => navigation.navigate('Profile'), [navigation]);

  if (!user === undefined) {
    return null;
  }

  if (!user) {
    return (
      <Button full onPress={navigateLogin}>
        <Text>Entrar</Text>
      </Button>
    );
  }

  return (
    <Button full onPress={navigateProfile}>
      <Text>Perfil</Text>
    </Button>
  );
});

export default WelcomeCard;
