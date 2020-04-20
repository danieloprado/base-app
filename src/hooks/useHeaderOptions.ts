import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types';
import { DependencyList, useEffect } from 'react';

export function useHeaderOptions(
  options: (params: { route: any; navigation: any }) => StackNavigationOptions,
  deps: DependencyList
) {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    navigation.setOptions(options({ route, navigation }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, route, ...deps]);
}
