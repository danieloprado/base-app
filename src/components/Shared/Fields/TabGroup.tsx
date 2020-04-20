import React, { memo, useCallback, useMemo, useState } from 'react';
import { InteractionManager } from 'react-native';
import TabIndexContext from '~/hooks/useTabIndex/context';

export { IValidationContextRef } from '@react-form-fields/core/ValidationContext';

const TabGroup = memo(({ children }) => {
  const [fields, setFields] = useState<{ position: number; onFocusHandler: Function }[]>([]);

  const registerPosition = useCallback((position: number, onFocusHandler: Function) => {
    setFields(current => {
      return [...current.filter(c => c.position !== position), { position, onFocusHandler }].sort((a, b) =>
        a.position > b.position ? 1 : a.position === b.position ? 0 : -1
      );
    });
  }, []);

  const unregisterPosition = useCallback((position: number) => {
    setFields(current => [...current.filter(c => c.position !== position)]);
  }, []);

  const hasNext = useCallback((currenPosition: number) => fields.some(f => f.position > currenPosition), [fields]);

  const goNext = useCallback(
    (currenPosition: number) => {
      const nextField = fields.find(f => f.position > currenPosition);
      if (!nextField) return false;

      InteractionManager.runAfterInteractions(() => nextField.onFocusHandler());

      return true;
    },
    [fields]
  );

  const value = useMemo(
    () => ({
      registerPosition,
      unregisterPosition,
      hasNext,
      goNext
    }),
    [goNext, hasNext, registerPosition, unregisterPosition]
  );

  return <TabIndexContext.Provider value={value}>{children}</TabIndexContext.Provider>;
});

export default TabGroup;
