import { NavigationState } from '@react-navigation/native';

export default function getCurrentRouteState(navigationState: Partial<NavigationState>): any {
  if (!navigationState) return null;

  const route = navigationState.routes[navigationState.index];
  return route.state?.routes ? getCurrentRouteState(route.state) : route;
}
