import React, { memo } from 'react';
import ButtonHeaderProfile from '~/components/Shared/ButtonHeaderProfile';
import Content from '~/components/Shared/Content';
import { useHeaderOptions } from '~/hooks/useHeaderOptions';

import WelcomeCard from './WelcomeCard';

const HomeScreen = memo(() => {
  useHeaderOptions(
    () => ({
      headerTitle: 'Início',
      headerRight: ({ tintColor }) => <ButtonHeaderProfile tintColor={tintColor} />
    }),
    []
  );

  return (
    <Content>
      <WelcomeCard />
    </Content>
  );
});

export default HomeScreen;
