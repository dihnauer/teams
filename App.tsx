import { StatusBar } from 'react-native';

import { ThemeProvider } from 'styled-components';
import theme from './src/theme';

import { Groups } from '@screens/Groups';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <StatusBar translucent backgroundColor='transparent' />
      <Groups />
    </ThemeProvider>
  );
}
