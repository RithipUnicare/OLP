import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  useTheme,
  Chip,
  FAB,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MassIntentionService } from '../services/MassIntentionService';

const MassIntentionsScreen = () => {
  const theme = useTheme();
  const [intentionFor, setIntentionFor] = useState('');
  const [intentionDate, setIntentionDate] = useState('');
  const [description, setDescription] = useState('');
  const [myIntentions, setMyIntentions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchMyIntentions = async () => {
    setLoading(true);
    try {
      const response = await MassIntentionService.getMyIntentions();
      if (response.success) {
        setMyIntentions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch intentions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIntentions();
  }, []);

  const handleSubmit = async () => {
    if (!intentionFor || !intentionDate || !description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await MassIntentionService.create({
        intentionFor,
        intentionDate,
        description,
      });

      if (response.success) {
        Alert.alert('Success', 'Mass intention submitted successfully');
        setIntentionFor('');
        setIntentionDate('');
        setDescription('');
        fetchMyIntentions();
      }
    } catch (error: any) {
      console.error('Failed to submit intention', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to submit request',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return theme.colors.tertiary;
      case 'pending':
        return '#FF9800';
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return theme.colors.tertiary;
      case 'pending':
        return '#FF9800';
      default:
        return theme.colors.outline;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Mass Intentions
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Book a mass for your loved ones
          </Text>
        </View>

        <Card style={styles.card} mode="elevated" elevation={3}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              New Mass Intention
            </Text>
            <TextInput
              label="Intention For (Name)"
              value={intentionFor}
              onChangeText={setIntentionFor}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
            <TextInput
              label="Date (YYYY-MM-DD)"
              value={intentionDate}
              onChangeText={setIntentionDate}
              mode="outlined"
              placeholder="2024-12-31"
              style={styles.input}
              left={<TextInput.Icon icon="calendar" />}
            />
            <TextInput
              label="Description/Notes"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              left={<TextInput.Icon icon="text" />}
            />
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Submit Request
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            My Requests
          </Text>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : myIntentions.length === 0 ? (
            <Card style={styles.historyCard}>
              <Card.Content>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No mass intentions yet
                </Text>
              </Card.Content>
            </Card>
          ) : (
            myIntentions.map(intention => (
              <Card
                key={intention.id}
                style={styles.historyCard}
                mode="elevated"
              >
                <Card.Content>
                  <View style={styles.intentionHeader}>
                    <Text variant="titleMedium" style={{ flex: 1 }}>
                      {intention.intentionFor}
                    </Text>
                    <Chip
                      mode="flat"
                      textStyle={{ fontSize: 11 }}
                      style={{
                        backgroundColor: getStatusColor(intention.status),
                      }}
                    >
                      {intention.status}
                    </Chip>
                  </View>
                  <Text
                    variant="bodySmall"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginTop: 4,
                    }}
                  >
                    Date:{' '}
                    {new Date(intention.intentionDate).toLocaleDateString()}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ marginTop: 8, marginBottom: 8 }}
                  >
                    {intention.description}
                  </Text>
                  <View style={styles.statusRow}>
                    <Chip
                      mode="outlined"
                      icon="cash"
                      textStyle={{ fontSize: 11 }}
                      style={{
                        borderColor: getPaymentStatusColor(
                          intention.paymentStatus,
                        ),
                      }}
                    >
                      {intention.paymentStatus || 'Pending'}
                    </Chip>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  card: {
    marginBottom: 24,
    borderRadius: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 14,
  },
  historyCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  intentionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default MassIntentionsScreen;
