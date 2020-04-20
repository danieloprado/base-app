import React, { memo, useCallback, useRef } from 'react';
import { NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';
import { Input, InputProps } from 'react-native-elements';
import { FormikInstance } from '~/hooks/useFormikObservable';
import useTabIndex from '~/hooks/useTabIndex';

interface IProps extends InputProps {
  name: string;
  formik: FormikInstance;
  tabIndex?: number;
}

const TextField = memo<IProps>(({ formik, name, tabIndex, returnKeyType, onSubmitEditing, ...props }) => {
  const inputRef = useRef<Input>();

  const handleFocus = useCallback(() => inputRef.current.focus(), []);
  const [goNext, hasNext] = useTabIndex(tabIndex, handleFocus);

  const handleSubmitHandler = React.useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      if (onSubmitEditing) {
        setTimeout(() => onSubmitEditing(e), 500);
        return;
      }

      if (!hasNext) {
        formik.handleSubmit();
        return;
      }

      goNext(tabIndex);
    },
    [onSubmitEditing, hasNext, goNext, tabIndex, formik]
  );

  return (
    <Input
      {...props}
      ref={inputRef}
      onChangeText={formik.handleChange(name)}
      errorMessage={formik.touched[name] ? (formik.errors[name] as any) : null}
      value={formik.values[name]}
      returnKeyType={returnKeyType ? returnKeyType : onSubmitEditing ? 'send' : hasNext ? 'next' : 'default'}
      onSubmitEditing={handleSubmitHandler}
    />
  );
});

export default TextField;
