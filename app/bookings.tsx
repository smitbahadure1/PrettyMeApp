import { Image } from 'expo-image';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, FlatList, Alert, Modal, TextInput } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function BookingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [bookings, setBookings] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchBookings = async () => {
                try {
                    const storedBookings = await AsyncStorage.getItem('bookings');
                    if (storedBookings) {
                        setBookings(JSON.parse(storedBookings).reverse()); // Newest first
                    }
                } catch (e) {
                    console.error('Failed to load bookings');
                }
            };

            fetchBookings();
        }, [])
    );

    const navigateTo = (route: string) => {
        if (route === 'home') router.push('/home');
        if (route === 'categories') router.push('/categories');
        if (route === 'bookings') router.push('/bookings');
        if (route === 'support') router.push('/support');
        if (route === 'account') router.push('/account');
    };

    // State for Modals
    const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const handleReschedule = (booking: any) => {
        setSelectedBooking(booking);
        setNewDate(booking.date);
        setNewTime(booking.time || '10:00 AM');
        setRescheduleModalVisible(true);
    };

    const confirmReschedule = async () => {
        if (!selectedBooking) return;

        const updatedBookings = bookings.map(b =>
            b.id === selectedBooking.id ? { ...b, date: newDate, time: newTime, status: 'Rescheduled' } : b
        );

        setBookings(updatedBookings);
        await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setRescheduleModalVisible(false);
        Alert.alert('Success', 'Booking Rescheduled Successfully');
    };

    const handleViewDetails = (booking: any) => {
        setSelectedBooking(booking);
        setDetailsModalVisible(true);
    };

    const handleCancelBooking = (id: string) => {
        Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
            { text: 'No, Keep It', style: 'cancel' },
            {
                text: 'Yes, Cancel', style: 'destructive', onPress: async () => {
                    const updatedBookings = bookings.filter(b => b.id !== id);
                    setBookings(updatedBookings);
                    await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));
                    setDetailsModalVisible(false);
                    Alert.alert('Cancelled', 'Your booking has been cancelled.');
                }
            }
        ]);
    };

    const renderBookingItem = ({ item }: { item: any }) => {
        if (!item) return null;
        return (
            <View style={styles.bookingCard}>
                <Image source={{ uri: item.image }} style={styles.bookingImg} contentFit="cover" />
                <View style={styles.bookingInfo}>
                    <View style={styles.bookingHeader}>
                        <Text style={styles.serviceName}>{item.title}</Text>
                        {/* ... rest of content */}
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.bookingDate}>
                        <Ionicons name="calendar-outline" size={14} /> {item.date} • {item.time || '10:00 AM'}
                    </Text>
                    <Text style={styles.bookingPrice}>₹{item.price?.toLocaleString()}</Text>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.outlineBtn} onPress={() => handleReschedule(item)}>
                            <Text style={styles.outlineBtnText}>Reschedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => handleViewDetails(item)}>
                            <Text style={styles.primaryBtnText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MY BOOKINGS</Text>
            </View>

            {bookings && bookings.length > 0 ? (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyContent}>
                    {/* Illustration */}
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486744.png' }}
                        style={styles.illustration}
                        contentFit="contain"
                    />

                    <Text style={styles.title}>NO BOOKINGS YET</Text>
                    <Text style={styles.subtitle}>Check out our latest offers and book a session.</Text>

                    <TouchableOpacity style={styles.exploreBtn} onPress={() => navigateTo('categories')}>
                        <Text style={styles.exploreBtnText}>EXPLORE</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Reschedule Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={rescheduleModalVisible}
                onRequestClose={() => setRescheduleModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Reschedule Booking</Text>
                        <Text style={styles.modalSub}>{selectedBooking?.title}</Text>

                        <TextInput
                            style={styles.input}
                            value={newDate}
                            onChangeText={setNewDate}
                            placeholder="New Date (DD/MM/YYYY)"
                        />
                        <TextInput
                            style={styles.input}
                            value={newTime}
                            onChangeText={setNewTime}
                            placeholder="New Time (e.g. 02:00 PM)"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setRescheduleModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={confirmReschedule}>
                                <Text style={styles.saveText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Details Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={detailsModalVisible}
                onRequestClose={() => setDetailsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {selectedBooking ? (
                        <View style={[styles.modalContent, { padding: 0 }]}>
                            <Image source={{ uri: selectedBooking.image }} style={{ width: '100%', height: 150, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} contentFit="cover" />
                            <View style={{ padding: 20 }}>
                                <Text style={styles.modalTitle}>{selectedBooking.title}</Text>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Booking ID:</Text>
                                    <Text style={styles.detailValue}>#{selectedBooking.id?.slice(-6) || 'NA'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Date:</Text>
                                    <Text style={styles.detailValue}>{selectedBooking.date} at {selectedBooking.time || '10:00 AM'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Address:</Text>
                                    <Text style={styles.detailValue} numberOfLines={2}>{selectedBooking.address || 'N/A'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Total Amount:</Text>
                                    <Text style={[styles.detailValue, { color: '#2D6A4F', fontWeight: 'bold' }]}>₹{selectedBooking.price?.toLocaleString()}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Status:</Text>
                                    <Text style={[styles.detailValue, { color: '#E67E22', fontWeight: 'bold' }]}>{selectedBooking.status}</Text>
                                </View>

                                <TouchableOpacity style={[styles.saveBtn, { marginTop: 20 }]} onPress={() => setDetailsModalVisible(false)}>
                                    <Text style={styles.saveText}>Close</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.cancelBtn, { marginTop: 10, backgroundColor: '#FFF5F5' }]} onPress={() => handleCancelBooking(selectedBooking.id)}>
                                    <Text style={[styles.cancelText, { color: '#FF4d4d' }]}>Cancel Booking</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.modalContent}>
                            <Text>Loading...</Text>
                        </View>
                    )}
                </View>
            </Modal>

            {/* Bottom Nav */}
            <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 10 }]}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('home')}>
                    <Ionicons name="home-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('categories')}>
                    <Ionicons name="grid-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Categories</Text>
                </TouchableOpacity>
                <View style={styles.navItem}>
                    <Ionicons name="calendar" size={24} color="#000" />
                    <Text style={[styles.navText, { color: '#000', fontWeight: 'bold' }]}>Bookings</Text>
                </View>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('support')}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('account')}>
                    <Ionicons name="person-outline" size={24} color="#999" />
                    <Text style={styles.navText}>Account</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8', // Slightly grey background for list
    },
    header: {
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#000',
    },
    // List Styles
    listContent: {
        padding: 20,
        paddingBottom: 100, // Space for nav
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    bookingImg: {
        width: '100%',
        height: 150,
    },
    bookingInfo: {
        padding: 15,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        backgroundColor: '#E6FFEA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2D6A4F',
    },
    bookingDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 6,
    },
    bookingPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    outlineBtn: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        alignItems: 'center',
    },
    outlineBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    primaryBtn: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#000',
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    // Empty State
    emptyContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingBottom: 80,
    },
    illustration: {
        width: 250,
        height: 250,
        marginBottom: 30,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#000',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
        maxWidth: '80%',
    },
    exploreBtn: {
        backgroundColor: '#000',
        paddingVertical: 15,
        width: '100%',
        borderRadius: 5,
        alignItems: 'center',
    },
    exploreBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: 5,
    },
    navItem: {
        alignItems: 'center',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    modalSub: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 15,
        fontSize: 14,
        color: '#000',
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 10,
    },
    cancelBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    saveBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    cancelText: {
        fontWeight: '600',
        color: '#333',
    },
    saveText: {
        fontWeight: '600',
        color: '#fff',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '600',
        maxWidth: '60%',
        textAlign: 'right',
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        color: '#999',
    },
});
