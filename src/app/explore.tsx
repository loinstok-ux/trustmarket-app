import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: '1', name: 'Electronics', icon: 'devices', color: '#8df7c1', iconColor: '#002113' },
  { id: '2', name: 'Vehicles', icon: 'directions-car', color: '#ffdad8', iconColor: '#410006' },
  { id: '3', name: 'Clothing', icon: 'checkroom', color: '#d6e3ff', iconColor: '#001b3d' },
  { id: '4', name: 'Home', icon: 'home-work', color: '#e7e8e9', iconColor: '#3e4942' },
  { id: '5', name: 'Gaming', icon: 'sports-esports', color: '#e7e8e9', iconColor: '#3e4942' },
  { id: '6', name: 'Arts', icon: 'brush', color: '#e7e8e9', iconColor: '#3e4942' },
];

const RECENT_PRODUCTS = [
  {
    id: '1',
    title: 'MacBook Pro M2 - 512GB',
    price: 1299.00,
    location: 'San Francisco, CA',
    verified: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-_rDQyLz4iyrG_I8RJ8_d7vogPte8rcgmfZ_VjY18KBIV4tGls-a0deNYsvX5iFnCtukeVcAuDUVWcVweXOncaKPUE_JLTjYwisYgaPHsy5raXZPYQHEs4RIhdNfbPi7HuW4QsH0aIO19TY23_N4S4hE44SH-Pge4HrHWgJvyYuRBgr7eSeQxyMDP3Q4zq3Y9h053DViRCGUBr5H26HKBQUGVPIscFSopXK94iuVT2FbwgCGEW-OHZ3JFoJX6C5Ph-aPVDuOEvihu'
  },
  {
    id: '2',
    title: 'Limited Edition Air Max',
    price: 245.00,
    location: 'New York, NY',
    verified: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzpc8LS3DuKcu8J4hKgFp8xCjrOSFnEipkcnXhlVnhwtM449PQ91pybLWgY6TN3EMEwmI3YnoaBV-hGptI8dx7X1w8Lg_y6v9KNT8aQFkVBgHuKtyz2Q7uWXHgrPlyseL5GCCTPeO3PqtpJvCXemIhzyQ5vmGqlDsTdnCeAIpO_1XSXH5mM6dxMi3dbufJmkZbTQcjk6S7iy6eSmYD6CJ9uD4ZYay2Gj3mN2ZAgM3ciJs5T4sm4vBVFWeTHjUxSsAD4kLRZrMH6abe'
  },
  {
    id: '3',
    title: 'Industrial LED Task Lamp',
    price: 89.00,
    location: 'Austin, TX',
    verified: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhuWWTV3VZYsYnU5h3vwkV7G2w8FlMyRzTZTJ1fUqULgsNv5AYaSHv6UQDkK_yad5vJ8XsGpddgad6AjbQETNaCMdWUqTD5zh52gL1aUINZHltloOfSOV8EsLet5BhzrcW3Wx5G2hNfLs7BbA8j0uUY2xhxXdMWKR7gsdpF50ealzgXqmIJtGUmzqIKXO3s4Pe3s1Pz_cR2DwNhTtDhyXJQYrweYXfpmYgoVmri6LafizjpSENxJGC9TH9UyNDvlUKWAj8cFxeNOzd'
  },
  {
    id: '4',
    title: 'Precision Steel Watch',
    price: 2400.00,
    location: 'Miami, FL',
    verified: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2gN6EybmORV4fqMHdQE4WmESxRyL-KKzvrRwN60AY-2k7DdaK1nS_X6soCcJ7AcGq2yIF9Kuf7zU_D5J3XWFRPLwrr_G_6Z4M5XxXduN1IDpuSulvn6d6DfP2oE9z4w6Axg91sQxZcu3dWfAJdz91-hQCJQvJdgmdA9t6oYOiO4w9_AxFsoBgnQH99o6ByHZMNx2LsKKCGL1584PlAJP4fKzxcx2nK0i6OcBYfJLeGSlZp8DEh6qpMv0IYzsV-o1nvPF0bAtzs7-r'
  }
];

export default function ExploreScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const renderHeader = () => (
    <View style={styles.contentPadding}>
      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#3e4942" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="What are you looking for today?"
            placeholderTextColor="#3e4942"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="tune" size={24} color="#3e4942" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryButton}>
            <View style={[styles.categoryIconContainer, { backgroundColor: cat.color }]}>
              {/* @ts-ignore */}
              <MaterialIcons name={cat.icon} size={28} color={cat.iconColor} />
            </View>
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recent Products Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Products</Text>
        <View style={styles.secureTradesBadge}>
          <MaterialIcons name="verified" size={16} color="#006b47" />
          <Text style={styles.secureTradesText}>Secure Trades Only</Text>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerBanner}>
      <View style={styles.footerBannerContent}>
        <View style={styles.footerIconContainer}>
          <MaterialIcons name="security" size={28} color="#006b47" />
        </View>
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerTitle}>Institutional Grade Escrow</Text>
          <Text style={styles.footerDesc}>Your funds are held safely until you confirm receipt.</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.footerButton}>
        <Text style={styles.footerButtonText}>Learn How It Works</Text>
      </TouchableOpacity>
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
            <MaterialIcons name="notifications" size={24} color="#3e4942" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={RECENT_PRODUCTS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({
              pathname: '/product/[id]',
              params: { id: item.id, title: item.title, price: item.price, location: item.location }
            })}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.favoriteButton}>
                <MaterialIcons name="favorite" size={20} color="#ae2f34" />
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <View style={styles.verifiedRow}>
                <MaterialIcons name="verified-user" size={16} color="#006b47" />
                <Text style={styles.verifiedText}>Biometrically Verified Seller</Text>
              </View>
              
              <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
              
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={14} color="#3e4942" />
                <Text style={styles.locationInfo} numberOfLines={1}>{item.location}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <View style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </View>
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
  listContent: {
    paddingBottom: 24,
  },
  contentPadding: {
    paddingTop: 16,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#191c1d',
  },
  filterButton: {
    width: 56,
    height: 56,
    backgroundColor: '#e7e8e9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#191c1d',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006b47',
  },
  categoriesScroll: {
    marginBottom: 32,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryButton: {
    alignItems: 'center',
    gap: 8,
    minWidth: 72,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3e4942',
  },
  secureTradesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureTradesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006b47',
  },
  row: {
    flex: 1,
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
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
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 6,
    borderRadius: 20,
  },
  cardContent: {
    padding: 16,
    gap: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#006b47',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationInfo: {
    fontSize: 12,
    color: '#3e4942',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006b47',
  },
  viewButton: {
    backgroundColor: '#006b47',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: '#8df7c1',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'column',
    gap: 16,
  },
  footerBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerTextContainer: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002113',
    marginBottom: 4,
  },
  footerDesc: {
    fontSize: 16,
    color: 'rgba(0,33,19,0.8)',
  },
  footerButton: {
    backgroundColor: '#006b47',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
