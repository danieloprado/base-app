// @refresh reset
import { Theme } from 'react-native-elements';

const theme: Theme<{}> = {
  Card: {
    containerStyle: {
      borderRadius: 5
    }
  },
  Input: {
    labelStyle: {
      fontWeight: 'normal'
    },
    errorStyle: {
      marginLeft: 0
    },
    rightIconContainerStyle: {
      opacity: 0.6
    },
    leftIconContainerStyle: {
      opacity: 0.6,
      marginLeft: 0,
      marginRight: 5
    },
    containerStyle: {
      marginBottom: 16
    }
  }
};

export default theme;
