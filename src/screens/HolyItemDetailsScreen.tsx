import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Appbar,
  Card,
  IconButton,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HolyItemService } from '../services/HolyItemService';

const HolyItemDetailsScreen = ({ route, navigation }: any) => {
  const { item } = route.params || {};
  const theme = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Item Details" />
        </Appbar.Header>
        <View style={styles.errorContainer}>
          <Text>Item not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleOrder = async () => {
    setOrdering(true);
    try {
      const response = await HolyItemService.placeOrder({
        holyItemId: item.id,
        quantity,
      });

      if (response.success) {
        Alert.alert('Success', 'Order placed successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      console.error('Failed to place order', error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to place order',
      );
    } finally {
      setOrdering(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={item.itemName} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: 'https://via.placeholder.com/350' }}
          style={styles.image}
        />

        <Card style={styles.detailsCard} mode="elevated" elevation={2}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              {item.itemName}
            </Text>
            <Text
              variant="titleMedium"
              style={{
                color: item.available
                  ? theme.colors.tertiary
                  : theme.colors.error,
                marginBottom: 16,
                marginTop: 8,
              }}
            >
              {item.available
                ? `✓ In Stock (${item.stock} available)`
                : '✗ Out of Stock'}
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {item.description ||
                'This is a holy item available for purchase through our parish. Please contact the parish office for more information about this item.'}
            </Text>

            {item.available && (
              <View style={styles.quantitySection}>
                <Text variant="titleMedium" style={{ fontWeight: '600' }}>
                  Quantity:
                </Text>
                <View style={styles.quantityControl}>
                  <IconButton
                    icon="minus"
                    mode="contained-tonal"
                    size={20}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  />
                  <Text
                    variant="headlineSmall"
                    style={{ marginHorizontal: 20 }}
                  >
                    {quantity}
                  </Text>
                  <IconButton
                    icon="plus"
                    mode="contained-tonal"
                    size={20}
                    onPress={() =>
                      setQuantity(Math.min(item.stock, quantity + 1))
                    }
                    disabled={quantity >= item.stock}
                  />
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
        <Button
          mode="contained"
          onPress={handleOrder}
          disabled={!item.available || ordering}
          loading={ordering}
          style={styles.button}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
        >
          Place Order
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: 90,
  },
  image: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  detailsCard: {
    margin: 16,
    borderRadius: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 24,
  },
  quantitySection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    borderRadius: 12,
  },
});

export default HolyItemDetailsScreen;
