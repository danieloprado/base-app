import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-elements';

interface IProps {
  icon: string;
  message: string;
  button?: string;
  onPress?: () => void;
  disableMargin?: boolean;
}

const IconMessage = memo(({ message, button, onPress, icon, disableMargin }: IProps) => {
  const containerStyle = useMemo(() => [styles.container, disableMargin ? null : styles.margin], [disableMargin]);

  return (
    <View style={containerStyle}>
      <Icon name={icon} containerStyle={styles.icon} size={100} />
      <Text style={styles.message}>{message}</Text>
      {!!button && <Button style={styles.button} onPress={onPress} title={button} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  margin: {
    marginTop: 90
  },
  icon: {
    opacity: 0.6
  },
  message: {
    marginTop: 5,
    fontSize: 18,
    opacity: 0.5,
    textAlign: 'center'
  },
  button: {
    marginTop: 20,
    width: 200
  }
});

export default IconMessage;
