import * as React from 'react';

export interface ITabIndexContext {
  registerPosition(position: number, onFocusHandler: Function): void;
  unregisterPosition(position: number): void;
  hasNext(position: number): boolean;
  goNext(currenPosition: number): boolean;
}

const TabIndexContext = React.createContext<ITabIndexContext>({
  registerPosition: () => {},
  unregisterPosition: () => {},
  hasNext: () => false,
  goNext: () => false
});

export default TabIndexContext;
