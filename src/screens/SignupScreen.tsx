import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../services/AuthService';

const SignupScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSignup = async () => {
    if (!name || !mobileNumber || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.signup({
        name,
        mobileNumber,
        email,
        password,
      });
      Alert.alert('Success', 'Account created successfully! Please login.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Signup failed', error);
      const message =
        error?.response?.data?.message || 'Signup failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.gradient, { backgroundColor: theme.colors.secondary }]}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Text variant="displayMedium" style={styles.title}>
              Create Account
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Join our Parish community today
            </Text>
          </View>

          <View style={styles.formCard}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
              outlineColor="rgba(255,255,255,0.3)"
              activeOutlineColor={theme.colors.primary}
              theme={{
                colors: {
                  onSurfaceVariant: 'rgba(0,0,0,0.6)',
                },
              }}
            />

            <TextInput
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
              outlineColor="rgba(255,255,255,0.3)"
              activeOutlineColor={theme.colors.primary}
              theme={{
                colors: {
                  onSurfaceVariant: 'rgba(0,0,0,0.6)',
                },
              }}
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
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

            <Button
              mode="contained"
              onPress={handleSignup}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Sign Up
            </Button>

            <View style={styles.footer}>
              <Text variant="bodyMedium" style={styles.footerText}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text variant="bodyMedium" style={styles.loginText}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    flexGrow: 1,
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
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
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
  loginText: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
