import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
    Text,
    Card,
    Button,
    TextInput,
    useTheme,
    Appbar,
    Switch,
    ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import { HolyItemService } from '../services/HolyItemService';

const CreateHolyItemScreen = ({ navigation }: any) => {
    const theme = useTheme();
    const [itemName, setItemName] = useState('');
    const [stock, setStock] = useState('');
    const [availabilityDate, setAvailabilityDate] = useState('');
    const [description, setDescription] = useState('');
    const [available, setAvailable] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleDateConfirm = (selectedDate: Date) => {
        setShowDatePicker(false);
        setDate(selectedDate);
        const formattedDate = selectedDate.toISOString().split('T')[0];
        setAvailabilityDate(formattedDate);
    };

    const handleDateCancel = () => {
        setShowDatePicker(false);
    };

    const handleSubmit = async () => {
        if (!itemName || !stock) {
            Alert.alert('Error', 'Please fill item name and stock quantity');
            return;
        }

        const stockNumber = parseInt(stock, 10);
        if (isNaN(stockNumber) || stockNumber < 0) {
            Alert.alert('Error', 'Please enter a valid stock quantity');
            return;
        }

        setSubmitting(true);
        try {
            const response = await HolyItemService.add({
                itemName,
                stock: stockNumber,
                available,
                availabilityDate,
                description,
            });

            if (response.success) {
                Alert.alert('Success', 'Holy item added successfully!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                        },
                    },
                ]);
            }
        } catch (error: any) {
            console.error('Failed to add holy item', error);
            Alert.alert(
                'Error',
                error?.response?.data?.message || 'Failed to add item',
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <Appbar.Header elevated>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Create Holy Item" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Add New Item
                    </Text>
                    <Text
                        variant="bodyMedium"
                        style={{ color: theme.colors.onSurfaceVariant }}
                    >
                        Add holy items to the parish inventory
                    </Text>
                </View>

                <Card style={styles.card} mode="elevated" elevation={3}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.cardTitle}>
                            Item Information
                        </Text>
                        <TextInput
                            label="Item Name *"
                            value={itemName}
                            onChangeText={setItemName}
                            mode="outlined"
                            style={styles.input}
                            left={<TextInput.Icon icon="bookmark" />}
                            placeholder="e.g., Holy Water, Rosary, Candle"
                        />
                        <TextInput
                            label="Stock Quantity *"
                            value={stock}
                            onChangeText={setStock}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.input}
                            left={<TextInput.Icon icon="package-variant" />}
                            placeholder="e.g., 50"
                        />
                        <TextInput
                            label="Availability Date (Optional)"
                            value={availabilityDate}
                            mode="outlined"
                            style={styles.input}
                            left={<TextInput.Icon icon="calendar" />}
                            placeholder="YYYY-MM-DD"
                            editable={false}
                            onPressIn={() => setShowDatePicker(true)}
                            right={
                                <TextInput.Icon
                                    icon="calendar-clock"
                                    onPress={() => setShowDatePicker(true)}
                                />
                            }
                        />
                        <DatePicker
                            modal
                            open={showDatePicker}
                            date={date}
                            mode="date"
                            onConfirm={handleDateConfirm}
                            onCancel={handleDateCancel}
                        />
                        <TextInput
                            label="Description/Notes (Optional)"
                            value={description}
                            onChangeText={setDescription}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            style={styles.input}
                            left={<TextInput.Icon icon="text" />}
                            placeholder="Add any notes about this item"
                        />
                        <View style={styles.switchRow}>
                            <View style={{ flex: 1 }}>
                                <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                                    Available for Order
                                </Text>
                                <Text
                                    variant="bodySmall"
                                    style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                                >
                                    Make this item available for parishioners to order
                                </Text>
                            </View>
                            <Switch
                                value={available}
                                onValueChange={setAvailable}
                                color={theme.colors.primary}
                            />
                        </View>
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            loading={submitting}
                            disabled={submitting}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                            icon="plus-circle"
                        >
                            Add Item
                        </Button>
                    </Card.Content>
                </Card>
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
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 16,
    },
    button: {
        marginTop: 8,
        borderRadius: 12,
    },
    buttonContent: {
        height: 48,
    },
});

export default CreateHolyItemScreen;
