import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import TabNavigator from './TabNavigator';
import HolyItemDetailsScreen from '../screens/HolyItemDetailsScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import AltarScheduleScreen from '../screens/AltarScheduleScreen';
import CertificatesScreen from '../screens/CertificatesScreen';
import NewsletterScreen from '../screens/NewsletterScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const theme = useTheme();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setInitialRoute(token ? 'Main' : 'Login');
      } catch (e) {
        setInitialRoute('Login');
      }
    };
    checkAuth();
  }, []);

  if (initialRoute === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="HolyItemDetails"
          component={HolyItemDetailsScreen}
        />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="AltarSchedule" component={AltarScheduleScreen} />
        <Stack.Screen name="Certificates" component={CertificatesScreen} />
        <Stack.Screen name="MonthlyPDF" component={NewsletterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
