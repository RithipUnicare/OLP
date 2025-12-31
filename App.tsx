import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Animated } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import RNBootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const init = async () => {
      // Hide bootsplash after app is ready
      await RNBootSplash.hide({ fade: true });

      // Animate content fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    init();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <AppNavigator />
        </Animated.View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
