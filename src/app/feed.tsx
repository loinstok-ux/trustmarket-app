import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUser } from '../services/auth';
import { fetchProducts } from '../services/api';

const CATEGORIES = [
  { id: '1', name: 'Electrónica', icon: 'devices' },
  { id: '2', name: 'Vehículos', icon: 'directions-car' },
  { id: '3', name: 'Hogar', icon: 'home' },
  { id: '4', name: 'Moda', icon: 'checkroom' },
  { id: '5', name: 'Hobbies', icon: 'sports-esports' },
  { id: '6', name: 'Más', icon: 'more-horiz' },
];

export default function FeedScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [kycVerified, setKycVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        setProducts(data);
      }
    };
    const loadUser = async () => {
      const user = await getUser();
      setKycVerified(user?.kycVerified ?? false);
    };
    loadProducts();
    loadUser();
  }, []);

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderHeader = () => (
    <View style={styles.contentPadding}>
      {/* Location & Filters */}
      <View style={styles.locationContainer}>
        <TouchableOpacity style={styles.locationButton}>
          <MaterialIcons name="radar" size={20} color="#006b47" />
          <Text style={styles.locationText} numberOfLines={1}>Buscando a 10 km a la redonda (Validación GPS activa)</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryButton}>
            <View style={styles.categoryIconContainer}>
              {/* @ts-ignore */}
              <MaterialIcons name={cat.icon} size={24} color="#3e4942" />
            </View>
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={24} color="#006b47" />
          <Text style={styles.headerTitle}>SecureMarket</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="search" size={24} color="#3e4942" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.notificationBadgeContainer}>
              <MaterialIcons name="notifications" size={24} color="#3e4942" />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* KYC Banner */}
      {kycVerified === false && (
        <TouchableOpacity style={styles.kycBanner} onPress={() => router.push('/kyc')}>
          <MaterialIcons name="verified-user" size={20} color="#92400e" />
          <View style={styles.kycBannerText}>
            <Text style={styles.kycBannerTitle}>Verifica tu identidad</Text>
            <Text style={styles.kycBannerSub}>Completa el KYC para comprar y vender</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#92400e" />
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => router.push({
              pathname: '/product/[id]',
              params: { id: item.id, title: item.title, price: item.price, seller: item.seller, location: item.location }
            })}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.escrowBadge}>
                <MaterialIcons name="verified-user" size={14} color="#006b47" />
                <Text style={styles.escrowText}>ESCROW</Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.priceRow}>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${item.price}</Text>
                  <Text style={styles.currency}>/ Ref. Bs.</Text>
                </View>
                <MaterialIcons name="check-circle" size={18} color="#006b47" />
              </View>
              
              <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
              
              <View style={styles.locationRow}>
                <MaterialIcons name={item.delivery === 'Entrega Segura' ? "location-on" : "local-shipping"} size={14} color="#3e4942" />
                <Text style={styles.locationInfo} numberOfLines={1}>{item.location} • {item.delivery}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e3e4',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006b47',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  notificationBadgeContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: '#ae2f34',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#f8f9fa',
  },
  listContent: {
    paddingBottom: 24,
  },
  contentPadding: {
    paddingTop: 24,
  },
  locationContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bdcac0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
    flexShrink: 1,
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryButton: {
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#e7e8e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3e4942',
  },
  row: {
    flex: 1,
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bdcac0',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  escrowBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,107,71,0.2)',
    gap: 4,
  },
  escrowText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#006b47',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 12,
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  currency: {
    fontSize: 10,
    color: '#3e4942',
  },
  productTitle: {
    fontSize: 14,
    color: '#191c1d',
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  locationInfo: {
    fontSize: 11,
    fontWeight: '500',
    color: '#3e4942',
    flex: 1,
  },
  kycBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  kycBannerText: {
    flex: 1,
  },
  kycBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400e',
  },
  kycBannerSub: {
    fontSize: 11,
    color: '#b45309',
    marginTop: 1,
  },
});
