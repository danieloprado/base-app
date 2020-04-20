/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types';

declare module 'react' {
  interface NamedExoticComponent<P = {}> {
    navigationOptions:
      | StackNavigationOptions
      | ((props: { route: RouteProp<ParamList, RouteName>; navigation: any }) => StackNavigationOptions);
    defaultProps: Partial<P>;
  }
}
