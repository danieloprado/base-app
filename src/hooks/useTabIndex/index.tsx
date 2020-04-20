import { useContext, useEffect, useMemo } from 'react';

import TabIndexContext, { ITabIndexContext } from './context';

const goNextEmpty = [() => false, false] as [ITabIndexContext['goNext'], boolean];

export default function useTabIndex(tabIndex: number, onFocusHandler: Function) {
  const { registerPosition, unregisterPosition, goNext, hasNext } = useContext(TabIndexContext);

  useEffect(() => {
    if (tabIndex === undefined || tabIndex === null) {
      return () => {};
    }

    registerPosition(tabIndex, onFocusHandler);
    return () => unregisterPosition(tabIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabIndex, onFocusHandler]);

  return useMemo(() => {
    if (tabIndex === undefined || tabIndex === null) return goNextEmpty;

    return [goNext, hasNext(tabIndex)] as [ITabIndexContext['goNext'], boolean];
  }, [tabIndex, goNext, hasNext]);
}
