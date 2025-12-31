import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  Text,
  Appbar,
  DataTable,
  Card,
  ActivityIndicator,
  FAB,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralService } from '../services/GeneralService';

const AltarScheduleScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await GeneralService.getAllAltarSchedules();
      if (response.success) {
        setSchedules(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch schedules', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Altar Schedule" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {schedules.length === 0 ? (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No schedules available
                </Text>
              </Card.Content>
            </Card>
          ) : (
            schedules.map((schedule, index) => (
              <Card
                key={schedule.id}
                style={styles.card}
                mode="elevated"
                elevation={2}
              >
                <Card.Content>
                  <Text variant="titleMedium" style={styles.dateTitle}>
                    {formatDate(schedule.serviceDate)}
                  </Text>
                  <View style={styles.row}>
                    <Text
                      variant="bodyMedium"
                      style={{
                        fontWeight: '600',
                        color: theme.colors.primary,
                        flex: 1,
                      }}
                    >
                      Altar Boys:
                    </Text>
                    <Text variant="bodyMedium" style={{ flex: 2 }}>
                      {schedule.altarBoys}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text
                      variant="bodyMedium"
                      style={{
                        fontWeight: '600',
                        color: theme.colors.primary,
                        flex: 1,
                      }}
                    >
                      Readers:
                    </Text>
                    <Text variant="bodyMedium" style={{ flex: 2 }}>
                      {schedule.readers}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text
                      variant="bodyMedium"
                      style={{
                        fontWeight: '600',
                        color: theme.colors.primary,
                        flex: 1,
                      }}
                    >
                      Choir:
                    </Text>
                    <Text variant="bodyMedium" style={{ flex: 2 }}>
                      {schedule.choirMembers}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>
      )}
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
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  dateTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
});

export default AltarScheduleScreen;
