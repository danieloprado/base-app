import { useNavigation } from '@react-navigation/native';
import { Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title, View } from 'native-base';
import React, { memo, useCallback } from 'react';
import { classes } from '~/assets/theme';
import { ServiceError } from '~/errors/serviceError';

const DevPage = memo(() => {
  const navigation = useNavigation();

  const testError = useCallback((): void => {
    throw new ServiceError('Test', {
      type: 'Teste',
      meta: 'just works'
    });
  }, []);

  return (
    <Container style={classes.cardsContainer}>
      <Header>
        <Left>
          <Button transparent onPress={navigation.goBack}>
            <Icon active name='arrow-back' />
          </Button>
        </Left>
        <Body>
          <Title>Dev Menu</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <View style={[classes.cardsPadding, classes.alignCenter]}>
          <Button onPress={testError}>
            <Text>Test Error</Text>
          </Button>
        </View>
      </Content>
    </Container>
  );
});

export default DevPage;
