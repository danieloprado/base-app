import React, { Fragment, memo, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StatusBarProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

interface IProps {
  backgroundColor?: string;
  disableSafeArea?: boolean;
  disableScroolView?: boolean;
  withForm?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  disableStatusBar?: boolean;
  statusBarStyle?: StatusBarProps['barStyle'];
  statusBarBackground?: StatusBarProps['backgroundColor'];
}

const Content = memo(
  ({
    children,
    backgroundColor,
    disableSafeArea,
    withForm,
    disableScroolView,
    style,
    disableStatusBar,
    statusBarStyle,
    statusBarBackground
  }: IProps) => {
    const containerStyle = useMemo(
      () => ({
        ...styles.container,
        backgroundColor
      }),
      [backgroundColor]
    );

    const contentStyle = useMemo(() => [styles.content, style], [style]);

    let ResultView = <View style={contentStyle}>{children}</View>;

    ResultView = !disableScroolView ? (
      <ScrollView
        style={containerStyle}
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentInsetAdjustmentBehavior='automatic'
      >
        {ResultView}
      </ScrollView>
    ) : (
      <View style={containerStyle}>{ResultView}</View>
    );

    if (withForm) {
      ResultView = (
        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : null}>
          {ResultView}
        </KeyboardAvoidingView>
      );
    }

    if (!disableSafeArea) {
      ResultView = <SafeAreaView style={containerStyle}>{ResultView}</SafeAreaView>;
    }

    return (
      <Fragment>
        {!disableStatusBar && (
          <StatusBar barStyle={statusBarStyle ?? 'light-content'} backgroundColor={statusBarBackground ?? '#000000'} />
        )}
        {ResultView}
      </Fragment>
    );
  }
);

Content.displayName = 'Content';

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'red'
  },
  scrollContainer: {
    flexGrow: 1
  },
  content: {
    padding: 20,
    flex: 1
  }
});

export default Content;
