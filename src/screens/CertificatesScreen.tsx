import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import {
  Text,
  Appbar,
  List,
  Button,
  TextInput,
  Card,
  Chip,
  ActivityIndicator,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CertificateService } from '../services/CertificateService';

const CERTIFICATE_TYPES = [
  { value: 'BAPTISM', label: 'Baptism Certificate', icon: 'water' },
  {
    value: 'CONFIRMATION',
    label: 'Confirmation Certificate',
    icon: 'check-decagram',
  },
  { value: 'MARRIAGE', label: 'Marriage Certificate', icon: 'ring' },
  {
    value: 'FIRST_COMMUNION',
    label: 'First Communion Certificate',
    icon: 'bread-slice',
  },
];

const CertificatesScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [myCertificates, setMyCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchMyCertificates = async () => {
    setLoading(true);
    try {
      const response = await CertificateService.getMyCertificates();
      if (response.success) {
        setMyCertificates(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch certificates', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCertificates();
  }, []);

  const handleRequest = async (certificateType: string) => {
    setRequesting(true);
    try {
      const response = await CertificateService.requestCertificate({
        certificateType,
        remarks,
      });

      if (response.success) {
        Alert.alert('Success', 'Certificate request submitted successfully');
        setRemarks('');
        setSelectedType('');
        setShowForm(false);
        fetchMyCertificates();
      }
    } catch (error: any) {
      console.error('Failed to request certificate', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to submit request',
      );
    } finally {
      setRequesting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'ready':
        return theme.colors.tertiary;
      case 'pending':
        return '#FF9800';
      case 'rejected':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Certificates" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="bodyLarge" style={styles.description}>
          Request certificates or view the status of your previous requests.
        </Text>

        {!showForm && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Request a Certificate
            </Text>
            {CERTIFICATE_TYPES.map(cert => (
              <Card
                key={cert.value}
                style={styles.typeCard}
                mode="elevated"
                onPress={() => {
                  setSelectedType(cert.value);
                  setShowForm(true);
                }}
              >
                <Card.Content style={styles.typeCardContent}>
                  <List.Icon icon={cert.icon} color={theme.colors.primary} />
                  <Text variant="titleMedium" style={{ flex: 1 }}>
                    {cert.label}
                  </Text>
                  <List.Icon icon="chevron-right" />
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {showForm && selectedType && (
          <Card style={styles.formCard} mode="elevated" elevation={3}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.formTitle}>
                Request{' '}
                {CERTIFICATE_TYPES.find(c => c.value === selectedType)?.label}
              </Text>
              <TextInput
                label="Remarks/Additional Information"
                value={remarks}
                onChangeText={setRemarks}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
              />
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setShowForm(false);
                    setSelectedType('');
                    setRemarks('');
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleRequest(selectedType)}
                  loading={requesting}
                  disabled={requesting}
                  style={styles.submitButton}
                >
                  Submit Request
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            My Requests
          </Text>
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : myCertificates.length === 0 ? (
            <Card style={styles.item}>
              <Card.Content>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No certificate requests yet
                </Text>
              </Card.Content>
            </Card>
          ) : (
            myCertificates.map(cert => (
              <Card key={cert.id} style={styles.item} mode="elevated">
                <Card.Content>
                  <View style={styles.certHeader}>
                    <Text variant="titleMedium" style={{ flex: 1 }}>
                      {cert.certificateType} Certificate
                    </Text>
                    <Chip
                      mode="flat"
                      textStyle={{ fontSize: 11 }}
                      style={{
                        backgroundColor: getStatusColor(cert.status),
                      }}
                    >
                      {cert.status}
                    </Chip>
                  </View>
                  <Text
                    variant="bodySmall"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginTop: 4,
                    }}
                  >
                    Requested: {new Date(cert.requestedAt).toLocaleDateString()}
                  </Text>
                  {cert.fileUrl && (
                    <Button
                      mode="contained-tonal"
                      icon="download"
                      style={{ marginTop: 12 }}
                      onPress={() =>
                        Alert.alert(
                          'Info',
                          'Download functionality coming soon',
                        )
                      }
                    >
                      Download Certificate
                    </Button>
                  )}
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  description: {
    marginBottom: 24,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeCard: {
    marginBottom: 10,
    borderRadius: 12,
  },
  typeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  formCard: {
    marginBottom: 24,
    borderRadius: 16,
  },
  formTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  item: {
    marginBottom: 12,
    borderRadius: 16,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default CertificatesScreen;
