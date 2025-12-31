import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../services/AuthService';

const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.login({ mobileNumber, password });

      if (response && (response.accessToken || response.success)) {
        await AsyncStorage.setItem(
          'userToken',
          response.accessToken || 'demo-token',
        );
        if (response.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.refreshToken);
        }
        navigation.replace('Main');
      } else {
        Alert.alert('Login Failed', 'Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login failed', error);
      const message =
        error?.response?.data?.message ||
        'Login failed. Please check your credentials.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.gradient, { backgroundColor: theme.colors.primary }]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text variant="displayMedium" style={styles.title}>
              Welcome Back
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Sign in to continue to Parish App
            </Text>
          </View>

          <View style={styles.formCard}>
            <TextInput
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
              maxLength={10}
              outlineColor="rgba(255,255,255,0.3)"
              activeOutlineColor={theme.colors.primary}
              theme={{
                colors: {
                  onSurfaceVariant: 'rgba(0,0,0,0.6)',
                },
              }}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={secureText}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={secureText ? 'eye' : 'eye-off'}
                  onPress={() => setSecureText(!secureText)}
                />
              }
              outlineColor="rgba(255,255,255,0.3)"
              activeOutlineColor={theme.colors.primary}
              theme={{
                colors: {
                  onSurfaceVariant: 'rgba(0,0,0,0.6)',
                },
              }}
            />

            <TouchableOpacity
              onPress={() => Alert.alert('Info', 'Password reset coming soon')}
              style={styles.forgotPassword}
            >
              <Text variant="bodyMedium" style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Login
            </Button>

            <View style={styles.footer}>
              <Text variant="bodyMedium" style={styles.footerText}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text variant="bodyMedium" style={styles.signupText}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
  },
  signupText: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
