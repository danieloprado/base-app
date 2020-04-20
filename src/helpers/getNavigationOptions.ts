// import { NavigationComponent, NavigationScreenConfig } from 'react-navigation';
// import { NavigationStackOptions } from 'react-navigation-stack/lib/typescript/types';

// import getCurrentRouteState from './currentRouteState';

// export default function getNavigationOptions(screens: {
//   [routeName: string]: { screen: NavigationComponent<NavigationStackOptions, any> };
// }): NavigationScreenConfig<NavigationStackOptions, any> {
//   return params => {
//     const currentRoute = getCurrentRouteState(params.navigation.state);
//     const navigationOptions = screens[currentRoute.routeName].screen.navigationOptions;

//     if (typeof navigationOptions === 'function') {
//       return navigationOptions(params);
//     }

//     return navigationOptions;
//   };
// }
