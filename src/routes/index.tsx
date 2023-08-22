import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './app.routes';
import { useTheme } from 'styled-components/native';

export function Routes() {
  const { COLORS } = useTheme();

  return (
    // this view is necessary to set the background color of the entire app
    // and avoid the white flash when changing screens
    <View style={{ flex: 1, backgroundColor: COLORS.GRAY_600 }}>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  );
}
