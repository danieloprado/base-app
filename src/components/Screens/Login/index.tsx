import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button, Card, Input } from 'react-native-elements';
import { tap } from 'rxjs/operators';
import * as yup from 'yup';
import background from '~/assets/images/background.jpg';
import logo from '~/assets/images/logo.png';
import Content from '~/components/Shared/Content';
import { loader } from '~/helpers/rxjs-operators/loader';
import { logError } from '~/helpers/rxjs-operators/logError';
import { useFormikObservable } from '~/hooks/useFormikObservable';
import { useHeaderOptions } from '~/hooks/useHeaderOptions';
import userService from '~/services/user';

const validationSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required()
});

const LoginScreen = memo(() => {
  const navigation = useNavigation();

  useHeaderOptions(() => ({ header: () => null }), []);

  const formik = useFormikObservable({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit(model) {
      return userService.login(model.email, model.password).pipe(
        loader(),
        tap(() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })),
        logError(true)
      );
    }
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.background}>
        <Content withForm statusBarStyle='light-content' statusBarBackground='#000000'>
          <Animatable.View style={styles.viewContainer} animation='fadeInUp' useNativeDriver={true}>
            <Image source={logo} style={styles.img} resizeMode='contain' />

            <Card containerStyle={styles.formContainer}>
              <Input
                label='Email'
                autoCapitalize='none'
                keyboardType='email-address'
                onChangeText={formik.handleChange('email')}
                value={formik.values.email}
                errorMessage={formik.errors.email}
                leftIcon={{ name: 'email' }}
              />

              <Input
                label='Senha'
                secureTextEntry={true}
                leftIcon={{ name: 'lock' }}
                rightIcon={{ name: 'eye' }}
                onChangeText={formik.handleChange('password')}
                value={formik.values.password}
                errorMessage={formik.errors.email}
                onSubmitEditing={formik.handleSubmit}
              />

              <Button onPress={formik.handleSubmit} style={styles.buttons} title='Entrar' />
            </Card>
          </Animatable.View>
        </Content>
      </ImageBackground>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  img: {
    marginBottom: 50,
    marginTop: -50,
    alignSelf: 'center',
    height: 150,
    width: 200,
    maxWidth: Dimensions.get('screen').width - 50
  },
  buttons: {
    marginTop: 16
  },
  formContainer: {
    padding: 20,
    width: Dimensions.get('screen').width * 0.8,
    flexShrink: 0
  }
});

export default LoginScreen;
