import { useNavigation } from '@react-navigation/native';
import { Button, Icon } from 'native-base';
import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useObservable } from 'react-use-observable';
import { logError } from '~/helpers/rxjs-operators/logError';
import userService from '~/services/user';

const classes: any = {};

const ButtonHeaderProfile = memo(() => {
  const navigation = useNavigation();

  const [user] = useObservable(() => {
    return userService.get().pipe(logError());
  }, []);

  const navigateLogin = useCallback(() => navigation.navigate('Login'), [navigation]);
  const navigateProfile = useCallback(() => navigation.navigate('Profile'), [navigation]);

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return (
      <Button style={classes.headerButton} onPress={navigateLogin}>
        <Icon name='contact' style={styles.icon} />
      </Button>
    );
  }

  return (
    <Button style={classes.headerButton} onPress={navigateProfile}>
      <Icon name='contact' style={styles.icon} />
    </Button>
  );
});

const styles = StyleSheet.create({
  avatarImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15
  },
  icon: {
    fontSize: 28
    // color: variablesTheme.toolbarBtnTextColor
  }
});

export default ButtonHeaderProfile;
