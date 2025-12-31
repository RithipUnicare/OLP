import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  FAB,
  Searchbar,
  Badge,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HolyItemService } from '../services/HolyItemService';
import { UserProfileService } from '../services/UserProfileService';

const DEFAULT_IMAGE = 'https://via.placeholder.com/150';

const HolyItemsScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await HolyItemService.available();
      if (response.success) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch holy items', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await UserProfileService.getProfile();
      console.log(response)
      if (response) {
        // API returns array, get first item's requestedBy.roles
        setUserRole(response?.roles || null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchUserProfile();
  }, []);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const filteredItems = items.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({ item }: { item: any }) => (
    <Card
      style={styles.card}
      mode="elevated"
      elevation={2}
      onPress={() => {
        navigation.navigate('HolyItemDetails', { item });
      }}
    >
      <Card.Cover source={{ uri: DEFAULT_IMAGE }} style={styles.cardImage} />
      <Card.Content style={styles.cardContent}>
        <Text
          variant="titleMedium"
          numberOfLines={1}
          style={{ fontWeight: '600' }}
        >
          {item.itemName}
        </Text>
        <View style={styles.row}>
          {item.available ? (
            <Badge
              size={20}
              style={{ backgroundColor: theme.colors.tertiaryContainer }}
            >
              {`${item.stock} in stock`}
            </Badge>
          ) : (
            <Badge
              size={20}
              style={{ backgroundColor: theme.colors.errorContainer }}
            >
              Out of Stock
            </Badge>
          )}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained-tonal" disabled={!item.available} compact>
          Order
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <Text
          variant="headlineMedium"
          style={{ fontWeight: 'bold', marginBottom: 16 }}
        >
          Holy Items
        </Text>
        <Searchbar
          placeholder="Search Items"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          elevation={1}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapper}
          refreshing={loading}
          onRefresh={fetchItems}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                No items found.
              </Text>
            </View>
          }
        />
      )}

      <FAB
        icon="clipboard-list"
        label="My Orders"
        style={[
          styles.fab,
          { backgroundColor: theme.colors.tertiaryContainer },
        ]}
        onPress={() => navigation.navigate('MyOrders')}
        color={theme.colors.onTertiaryContainer}
      />

      {userRole === 'SUPERADMIN' && (
        <FAB
          icon="plus"
          label="Create Item"
          style={[
            styles.createFab,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          onPress={() => navigation.navigate('CreateHolyItem')}
          color={theme.colors.onPrimaryContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 12,
  },
  list: {
    padding: 8,
    paddingBottom: 90,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
  },
  cardImage: {
    height: 130,
  },
  cardContent: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  createFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    borderRadius: 16,
  },
});

export default HolyItemsScreen;
