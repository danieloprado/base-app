import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { Button } from 'react-native-elements';
import { useObservable } from 'react-use-observable';
import { logError } from '~/helpers/rxjs-operators/logError';
import userService from '~/services/user';

const ButtonHeaderProfile = memo<{ tintColor: string }>(({ tintColor }) => {
  const navigation = useNavigation();

  const [user] = useObservable(() => userService.get().pipe(logError()), []);

  const navigateProfile = useCallback(() => navigation.navigate(user ? 'Profile' : 'Login'), [navigation, user]);

  return <Button onPress={navigateProfile} type='clear' icon={{ name: 'account', color: tintColor }} />;
});

export default ButtonHeaderProfile;
