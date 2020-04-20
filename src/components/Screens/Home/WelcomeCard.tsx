import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import { Button } from 'react-native-elements';

const WelcomeCard = memo(() => {
  const navigation = useNavigation();

  const navigateProfile = useCallback(() => navigation.navigate('Profile'), [navigation]);

  return <Button onPress={navigateProfile} title='Perfil' />;
});

export default WelcomeCard;
