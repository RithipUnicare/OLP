import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import {
  Text,
  Appbar,
  Card,
  Button,
  ActivityIndicator,
  useTheme,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralService } from '../services/GeneralService';

const NewsletterScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const response = await GeneralService.getAllMonthlyPdfs();
      if (response.success) {
        setNewsletters(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch newsletters', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const getMonthName = (month: string) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthIndex = parseInt(month) - 1;
    return months[monthIndex] || month;
  };

  const handleDownload = (item: any) => {
    Alert.alert('Info', 'Download functionality coming soon');
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Card.Content>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
              {getMonthName(item.month)} {item.year}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
            </Text>
          </View>
          <Chip
            icon="file-pdf-box"
            mode="flat"
            style={{ backgroundColor: '#FFCDD2' }}
          >
            PDF
          </Chip>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          icon="download"
          mode="contained-tonal"
          onPress={() => handleDownload(item)}
        >
          Download
        </Button>
        <Button
          icon="eye"
          mode="outlined"
          onPress={() => Alert.alert('Info', 'View functionality coming soon')}
        >
          View
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Parish Newsletters" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      ) : (
        <FlatList
          data={newsletters}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Card style={styles.card}>
              <Card.Content>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No newsletters available
                </Text>
              </Card.Content>
            </Card>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});

export default NewsletterScreen;
