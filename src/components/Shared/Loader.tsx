import React, { memo } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { useObservable } from 'react-use-observable';
import loaderService from '~/services/loader';

const Loader = memo(() => {
  const [visible] = useObservable(() => loaderService.shouldShow(), []);

  return (
    <Modal animationType='fade' transparent={true} visible={visible}>
      <View style={styles.container}>
        <ActivityIndicator size='large' color='white' />
      </View>
    </Modal>
  );
});

export default Loader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.5 }]
  }
});
