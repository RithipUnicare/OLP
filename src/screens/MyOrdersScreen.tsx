import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import {
  Text,
  Appbar,
  Card,
  useTheme,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HolyItemService } from '../services/HolyItemService';

const MyOrdersScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await HolyItemService.getMyOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return theme.colors.tertiary;
      case 'processing':
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Card.Content>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
              Order #{item.id}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              {new Date(item.orderedAt).toLocaleDateString()}
            </Text>
          </View>
          <Chip
            mode="flat"
            textStyle={{ fontSize: 11 }}
            style={{ backgroundColor: getStatusColor(item.status) }}
          >
            {item.status || 'Pending'}
          </Chip>
        </View>
        <View style={styles.itemDetails}>
          <Text variant="bodyMedium" style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: '600' }}>Item: </Text>
            {item.holyItem?.itemName}
          </Text>
          <Text variant="bodyMedium" style={{ marginTop: 4 }}>
            <Text style={{ fontWeight: '600' }}>Quantity: </Text>
            {item.quantity}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Orders" />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 100 }} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Card style={styles.card}>
              <Card.Content>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No orders yet
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
  itemDetails: {
    marginTop: 8,
  },
});

export default MyOrdersScreen;
