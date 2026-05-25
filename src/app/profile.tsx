import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top AppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/feed')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#006b47" />
          </TouchableOpacity>
          <MaterialIcons name="security" size={24} color="#006b47" />
          <Text style={styles.headerTitle}>SecureMarket</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#3e4942" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsELHJJTiakj-NF8LbbK2RmZ1jjJoyz3jq7Ne9UKwvJ1MvNzv-H31f1jWJHPjshPvbyn9WAD2sPUPXPS1KokWj46UPHbLxH0CQB2jVUKI3VpQe_abiNREKxxmpEJjWZVcWaRzlWRNFFvBvQKrF7NdWfBqhHG3cMZhG5VhcJ9tn83VzbMBUQkSIMjZ9VLiMTCKUbapL2GURw1RKFDQwrvy80pmhVmLWnp_-_RFGb5KqK7m52sFVCIqApY8Vrcv7BSMsNHhPPseZ9uw6' }}
                style={styles.avatarImage}
              />
            </View>
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="verified" size={14} color="#ffffff" />
            </View>
          </View>
          
          <Text style={styles.userName}>Alex Thompson</Text>
          <View style={styles.eliteBadge}>
            <MaterialIcons name="stars" size={14} color="#ffffff" />
            <Text style={styles.eliteText}>Nivel Elite</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>148</Text>
            <Text style={styles.statLabel}>Ventas completadas</Text>
          </View>
          <View style={styles.statBox}>
            <View style={styles.ratingRow}>
              <Text style={styles.statValue}>4.9</Text>
              <MaterialIcons name="star" size={20} color="#006b47" />
            </View>
            <Text style={styles.statLabel}>Calificación</Text>
          </View>
          <View style={styles.statBoxWide}>
            <View style={styles.responseIcon}>
              <MaterialIcons name="bolt" size={20} color="#2e5d9e" />
            </View>
            <View style={styles.responseTexts}>
              <Text style={styles.responseTitle}>Tiempo de Respuesta</Text>
              <Text style={styles.responseSubtitle}>Usualmente responde en 5 min</Text>
            </View>
          </View>
        </View>

        {/* Verification Status Card */}
        <View style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <MaterialIcons name="shield" size={24} color="#8df7c1" />
            <Text style={styles.securityTitle}>Estado de Confianza</Text>
          </View>
          
          <View style={styles.securityList}>
            <View style={styles.securityItem}>
              <View style={styles.securityItemLeft}>
                <MaterialIcons name="fingerprint" size={20} color="#8df7c1" />
                <Text style={styles.securityItemText}>Identidad Validada con Biometría</Text>
              </View>
              <MaterialIcons name="check-circle" size={20} color="#71dba6" />
            </View>
            <View style={styles.securityItem}>
              <View style={styles.securityItemLeft}>
                <MaterialIcons name="location-on" size={20} color="#8df7c1" />
                <Text style={styles.securityItemText}>GPS Verificado</Text>
              </View>
              <MaterialIcons name="check-circle" size={20} color="#71dba6" />
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/my-listings')}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="inventory-2" size={24} color="#3e4942" />
              <Text style={styles.menuItemText}>Mis Publicaciones</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6e7a71" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="settings" size={24} color="#3e4942" />
              <Text style={styles.menuItemText}>Configuración de Seguridad</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6e7a71" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/help')}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name="help-center" size={24} color="#3e4942" />
              <Text style={styles.menuItemText}>Centro de Ayuda</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6e7a71" />
          </TouchableOpacity>
          
        </View>

      </ScrollView>
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e3e4',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006b47',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#00875a',
    padding: 4,
    backgroundColor: '#ffffff',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#006b47',
    padding: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 8,
  },
  eliteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00875a',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  eliteText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 32,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdcac0',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#006b47',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#3e4942',
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statBoxWide: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdcac0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  responseIcon: {
    padding: 8,
    backgroundColor: '#d6e3ff',
    borderRadius: 8,
  },
  responseTexts: {
    flex: 1,
  },
  responseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  responseSubtitle: {
    fontSize: 12,
    color: '#3e4942',
  },
  securityCard: {
    backgroundColor: '#006b47',
    borderRadius: 16,
    padding: 24,
    marginTop: 32,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  securityTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  securityList: {
    gap: 16,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 53, 0.4)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityItemText: {
    color: '#ffffff',
    fontSize: 14,
  },
  menuSection: {
    marginTop: 32,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdcac0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  logoutItem: {
    marginTop: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ae2f34',
  },
});
