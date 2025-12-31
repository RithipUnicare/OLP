import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Avatar,
  List,
  Button,
  Divider,
  useTheme,
  ActivityIndicator,
  Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../services/AuthService';
import { UserProfileService } from '../services/UserProfileService';

const ProfileScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [parishProfile, setParishProfile] = useState<any>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userRes = await UserProfileService.getProfile();
      setUser(userRes);

      const parishRes = await UserProfileService.getMyParishProfile();
      if (parishRes.success) {
        setParishProfile(parishRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AuthService.logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.headerCard} mode="elevated" elevation={2}>
          <Card.Content style={styles.header}>
            <Avatar.Text
              size={90}
              label={getInitials(user?.name || 'User')}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <Text variant="headlineSmall" style={styles.name}>
              {user?.name || 'User Name'}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {user?.email || 'user@example.com'}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              {user?.mobileNumber || 'N/A'}
            </Text>
            <Button
              mode="outlined"
              style={styles.editButton}
              onPress={() =>
                Alert.alert('Info', 'Edit profile functionality coming soon')
              }
            >
              Edit Profile
            </Button>
          </Card.Content>
        </Card>

        {parishProfile && (
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>
                Parish Information
              </Text>
              <List.Item
                title="Street"
                description={parishProfile.streetName}
                left={props => <List.Icon {...props} icon="map-marker" />}
              />
              <List.Item
                title="Date of Birth"
                description={new Date(
                  parishProfile.dateOfBirth,
                ).toLocaleDateString()}
                left={props => <List.Icon {...props} icon="cake" />}
              />
              <List.Item
                title="Feast Name"
                description={parishProfile.feastName}
                left={props => <List.Icon {...props} icon="star" />}
              />
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              My Activities
            </Text>
            <List.Item
              title="My Mass Intentions"
              left={props => <List.Icon {...props} icon="calendar-heart" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('MassIntention')}
            />
            <Divider />
            <List.Item
              title="Order History"
              left={props => <List.Icon {...props} icon="shopping" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('MyOrders')}
            />
            <Divider />
            <List.Item
              title="My Certificates"
              left={props => <List.Icon {...props} icon="file-certificate" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Certificates')}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          buttonColor={theme.colors.error}
          style={styles.logoutButton}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  editButton: {
    marginTop: 16,
    borderRadius: 20,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logoutButton: {
    margin: 16,
    marginTop: 24,
    borderRadius: 12,
  },
});

export default ProfileScreen;
