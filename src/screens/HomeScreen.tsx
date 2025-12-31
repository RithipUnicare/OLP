import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  useTheme,
  ActivityIndicator,
  List,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralService } from '../services/GeneralService';

const HomeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [birthdays, setBirthdays] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const notifRes = await GeneralService.getAllNotifications();
      if (notifRes.success) {
        setNotifications(notifRes.data);
      }

      const bdayRes = await GeneralService.getBirthdaysToday();
      if (bdayRes.success) {
        setBirthdays(bdayRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch home data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text
            variant="headlineLarge"
            style={{ fontWeight: 'bold', color: theme.colors.primary }}
          >
            Our Lady Parish
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Welcome to our community
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            📢 Announcements
          </Text>
          {notifications.length === 0 ? (
            <Card style={styles.card} mode="elevated" elevation={2}>
              <Card.Content>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No new announcements.
                </Text>
              </Card.Content>
            </Card>
          ) : (
            notifications.slice(0, 3).map(item => (
              <Card
                key={item.id}
                style={styles.card}
                mode="elevated"
                elevation={2}
              >
                <Card.Title
                  title={item.title}
                  titleStyle={{ fontWeight: '600' }}
                  subtitle={new Date(item.createdAt).toLocaleDateString()}
                  left={props => (
                    <Avatar.Icon
                      {...props}
                      icon="bell"
                      size={48}
                      style={{ backgroundColor: theme.colors.primaryContainer }}
                    />
                  )}
                />
                <Card.Content>
                  <Text numberOfLines={2}>{item.message}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            ⚡ Quick Actions
          </Text>
          <View style={styles.grid}>
            <Card
              style={[styles.gridItem, { backgroundColor: '#EDE7F6' }]}
              onPress={() => navigation.navigate('AltarSchedule')}
            >
              <Card.Content style={styles.centerContent}>
                <Avatar.Icon
                  icon="calendar-clock"
                  size={56}
                  style={{ backgroundColor: '#673AB7' }}
                  color="#fff"
                />
                <Text style={styles.gridText}>Altar Schedule</Text>
              </Card.Content>
            </Card>

            <Card
              style={[styles.gridItem, { backgroundColor: '#E3F2FD' }]}
              onPress={() => navigation.navigate('Certificates')}
            >
              <Card.Content style={styles.centerContent}>
                <Avatar.Icon
                  icon="file-certificate"
                  size={56}
                  style={{ backgroundColor: '#2196F3' }}
                  color="#fff"
                />
                <Text style={styles.gridText}>Certificates</Text>
              </Card.Content>
            </Card>

            <Card
              style={[styles.gridItem, { backgroundColor: '#FCE4EC' }]}
              onPress={() => navigation.navigate('MonthlyPDF')}
            >
              <Card.Content style={styles.centerContent}>
                <Avatar.Icon
                  icon="file-pdf-box"
                  size={56}
                  style={{ backgroundColor: '#E91E63' }}
                  color="#fff"
                />
                <Text style={styles.gridText}>Newsletters</Text>
              </Card.Content>
            </Card>

            <Card
              style={[styles.gridItem, { backgroundColor: '#E8F5E9' }]}
              onPress={() => navigation.navigate('MassIntention')}
            >
              <Card.Content style={styles.centerContent}>
                <Avatar.Icon
                  icon="church"
                  size={56}
                  style={{ backgroundColor: '#4CAF50' }}
                  color="#fff"
                />
                <Text style={styles.gridText}>Mass Intentions</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {birthdays.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🎂 Today's Birthdays
            </Text>
            <Card style={styles.card} mode="elevated" elevation={2}>
              <Card.Content>
                {birthdays.map(p => (
                  <List.Item
                    key={p.id}
                    title={p.user.name}
                    titleStyle={{ fontWeight: '600' }}
                    description={`Feast: ${p.feastName}`}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon="cake"
                        color={theme.colors.tertiary}
                      />
                    )}
                  />
                ))}
              </Card.Content>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 28,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 14,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  gridItem: {
    width: '48%',
    marginBottom: 0,
    borderRadius: 20,
    elevation: 3,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  gridText: {
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default HomeScreen;
