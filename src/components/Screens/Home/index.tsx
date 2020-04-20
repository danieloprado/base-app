import { Button, Container, Content, Icon, View } from 'native-base';
import React, { memo } from 'react';
import { classes } from '~/assets/theme';
import ButtonHeaderProfile from '~/components/Shared/ButtonHeaderProfile';

import WelcomeCard from './WelcomeCard';

const HomeScreen = memo(() => {
  return (
    <Container style={classes.cardsContainer}>
      <Content>
        <View style={classes.cardsPadding}>
          <WelcomeCard />
        </View>
      </Content>
    </Container>
  );
});

HomeScreen.navigationOptions = () => {
  return {
    headerTitle: 'Início',
    headerLeft: () => (
      <Button style={classes.headerButton}>
        <Icon name='menu' style={classes.headerButtonIcon} />
      </Button>
    ),
    headerRight: () => <ButtonHeaderProfile />
  };
};

export default HomeScreen;
