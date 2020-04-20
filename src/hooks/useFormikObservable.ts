import { FormikConfig, FormikErrors, FormikHelpers, FormikTouched, useFormik } from 'formik';
import { useCallback, useRef, useState } from 'react';
import { useRetryableObservable } from 'react-use-observable';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';

export declare type FormikInstance<Values = any> = ReturnType<typeof useFormikObservable> & {
  values: Partial<Values>;
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
};

export declare type FormikConfigResolver<Values> = {
  [K in Exclude<keyof FormikConfig<Values>, 'onSubmit' | 'initialValues'>]?: FormikConfig<Values>[K];
};

interface IParams<Values, Result$> extends FormikConfigResolver<Values> {
  initialValues?: Partial<Values>;
  onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => Observable<Result$>;
}

export function useFormikObservable<Values = {}, Result$ = any>({ onSubmit, ...params }: IParams<Values, Result$>) {
  const promiseRef = useRef<{ promise?: Promise<any> }>({}).current;
  const [submitData, setSubmitData] = useState<{ model: Partial<Values>; formikHelpers: FormikHelpers<Values> }>();
  const handlers = useRef<{ [key: string]: (value: string) => void }>({}).current;

  const [result, error, completed, retry] = useRetryableObservable<Result$>(() => {
    if (!submitData) return of(undefined);

    const observable$ = onSubmit(submitData.model as Values, submitData.formikHelpers).pipe(share());
    promiseRef.promise = observable$.toPromise().catch(() => {});

    return observable$;
  }, [submitData]);

  const formik = useFormik<Partial<Values>>({
    initialValues: {},
    ...params,
    onSubmit: (model, formikHelpers) => {
      setSubmitData({ model, formikHelpers });
      return new Promise(resolve => setTimeout(() => resolve(promiseRef.promise), 500));
    }
  });

  const handleChange = useRef((field: string) => {
    if (!handlers[field]) {
      handlers[field] = (value: string) => {
        formik.setFieldTouched(field, true, false);
        formik.setFieldValue(field, value, true);
      };
    }

    return handlers[field];
  }).current;

  const handleSubmit = useCallback(() => formik.handleSubmit(), [formik]);

  return {
    ...formik,
    handleChange,
    handleSubmit,
    observable: {
      result,
      error,
      completed,
      retry
    }
  };
}
