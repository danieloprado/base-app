import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { Button } from 'react-native-elements';
import { useObservable } from 'react-use-observable';
import { tap } from 'rxjs/operators';
import * as yup from 'yup';
import Content from '~/components/Shared/Content';
import TabGroup from '~/components/Shared/Fields/TabGroup';
import FieldText from '~/components/Shared/Fields/Text';
import { loader } from '~/helpers/rxjs-operators/loader';
import { logError } from '~/helpers/rxjs-operators/logError';
import { useFormikObservable } from '~/hooks/useFormikObservable';
import { useHeaderOptions } from '~/hooks/useHeaderOptions';
import { IUser } from '~/interfaces/models/user';
import userService from '~/services/user';

const validationSchema = yup.object().shape({
  firstName: yup.string().nullable().required().min(3).max(50),
  lastName: yup.string().nullable().min(3).max(50),
  email: yup.string().nullable().required().email()
});

const ProfileEditScreen = memo(() => {
  const navigation = useNavigation();

  const formik = useFormikObservable<IUser>({
    validationSchema,
    onSubmit(model) {
      return userService.save(model).pipe(
        loader(),
        tap(() => navigation.goBack()),
        logError(true)
      );
    }
  });

  useObservable(() => {
    return userService.get().pipe(
      tap(user => formik.setValues(user, false)),
      logError()
    );
  }, []);

  useHeaderOptions(
    () => ({
      headerTitle: 'Atualizar Perfil',
      headerRight: ({ tintColor }) => (
        <Button onPress={formik.handleSubmit} icon={{ name: 'content-save', color: tintColor }} />
      )
    }),
    [formik]
  );

  return (
    <Content withForm>
      <TabGroup>
        <FieldText label='Nome' name='firstName' formik={formik} tabIndex={1} />
        <FieldText label='Sobrenome' name='lastName' formik={formik} tabIndex={2} />
        <FieldText label='Email' name='email' keyboardType='email-address' formik={formik} tabIndex={3} />
      </TabGroup>
    </Content>
  );
});

export default ProfileEditScreen;
