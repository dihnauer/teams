import { StatusBar } from 'react-native';
import { Groups } from './src/screens/Groups';

export default function App() {
  return (
    <>
      <StatusBar translucent backgroundColor='transparent' />
      <Groups />
    </>
  );
}