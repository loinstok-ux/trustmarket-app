import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top AppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.backButton}>
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
        
        {/* Header Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Configuración de Seguridad</Text>
          <Text style={styles.subtitle}>
            Gestiona el acceso a tu cuenta y mantén tus fondos protegidos con los estándares más altos de validación institucional.
          </Text>
        </View>

        {/* Identity Verification Card */}
        <View style={styles.identityCard}>
          <View style={styles.identityContent}>
            <View style={styles.verifiedRow}>
              <MaterialIcons name="verified-user" size={16} color="#006b47" />
              <Text style={styles.verifiedText}>VERIFICADO</Text>
            </View>
            <Text style={styles.cardTitle}>Verificación de Identidad</Text>
            <Text style={styles.cardDesc}>
              Tu cuenta está vinculada a tu documento oficial (Cédula/Pasaporte). Esto garantiza transacciones P2P seguras y aumenta tus límites de retiro.
            </Text>
            <TouchableOpacity style={styles.primaryButton}>
              <MaterialIcons name="badge" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Ver Documentos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.identityImageWrapper}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMIq8n0T8IiuOIUk5xlcCZvKFPIp9e58g00SERR4CcMtmSTqo7aDJe0i2ewINPYS7OHYSuifxAlYpVTe6leG72o9_yiNGYR-M3YT427jElVo3z_fOwgRwUSddsAhahZNn4beDexXkUqyxSg02BNCALVl-NMuCDNmUeYv_G_wdqEc4RLDiA36XClx5TxHBQD_N9-6bTG-XYkropZHnCzkVWU1ws1pBmZ4BnR4dAvYGTkGQPH8oyzSosCamxzWKxqJMOYCulZrCzFC4M' }}
              style={styles.identityImage}
            />
          </View>
        </View>

        {/* 2FA Card */}
        <View style={styles.twoFactorCard}>
          <MaterialIcons name="phonelink-lock" size={32} color="#ffffff" style={styles.twoFactorIcon} />
          <Text style={styles.twoFactorTitle}>Autenticación (2FA)</Text>
          <Text style={styles.twoFactorDesc}>Capa extra de protección mediante SMS o Google Authenticator.</Text>
          <View style={styles.twoFactorSwitchRow}>
            <Text style={styles.twoFactorStateText}>Estado: {is2FAEnabled ? 'Activo' : 'Inactivo'}</Text>
            <Switch
              value={is2FAEnabled}
              onValueChange={setIs2FAEnabled}
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#ffffff' }}
              thumbColor={is2FAEnabled ? '#4a76b9' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Biometrics Card */}
        <View style={styles.biometricsCard}>
          <View style={styles.biometricsIcon}>
            <MaterialIcons name="face" size={24} color="#006b47" />
          </View>
          <View style={styles.biometricsContent}>
            <View style={styles.biometricsHeaderRow}>
              <Text style={styles.biometricsTitle}>Validación Biométrica</Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMENDADO</Text>
              </View>
            </View>
            <Text style={styles.biometricsDesc}>
              Usa FaceID o tu huella dactilar para autorizar transacciones de forma instantánea y segura.
            </Text>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Configurar ahora</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#006b47" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Linked Devices Card */}
        <View style={styles.devicesCard}>
          <View style={styles.devicesHeader}>
            <MaterialIcons name="devices" size={20} color="#006b47" />
            <Text style={styles.devicesTitle}>Dispositivos Vinculados</Text>
          </View>
          
          <View style={styles.deviceItem}>
            <View style={styles.deviceInfoRow}>
              <MaterialIcons name="smartphone" size={24} color="#6e7a71" />
              <View style={styles.deviceTextCol}>
                <Text style={styles.deviceName}>iPhone 15 Pro (Este dispositivo)</Text>
                <Text style={styles.deviceDetail}>CDMX, México • Activo ahora</Text>
              </View>
            </View>
            <View style={styles.activeDot} />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.deviceItem}>
            <View style={styles.deviceInfoRow}>
              <MaterialIcons name="laptop" size={24} color="#6e7a71" />
              <View style={styles.deviceTextCol}>
                <Text style={styles.deviceName}>MacBook Pro M2</Text>
                <Text style={styles.deviceDetail}>Hace 2 horas</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.logoutDeviceText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Wallet Security Banner */}
        <View style={styles.walletBanner}>
          <View style={styles.walletBannerIcon}>
            <MaterialIcons name="account-balance-wallet" size={32} color="#ffffff" />
          </View>
          <View style={styles.walletBannerContent}>
            <Text style={styles.walletBannerTitle}>Escudo de Billetera Activo</Text>
            <Text style={styles.walletBannerDesc}>
              Tus fondos están protegidos por un sistema de custodia inteligente que requiere validación Emerald para cualquier retiro superior a $500 USD.
            </Text>
            <TouchableOpacity style={styles.auditButton}>
              <Text style={styles.auditButtonText}>Ver Auditoría</Text>
            </TouchableOpacity>
          </View>
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
  sectionHeader: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#191c1d',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#3e4942',
    lineHeight: 24,
  },
  identityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdcac0',
    overflow: 'hidden',
    marginBottom: 16,
  },
  identityContent: {
    padding: 20,
    zIndex: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#006b47',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#3e4942',
    marginBottom: 20,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#00875a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  identityImageWrapper: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 150,
    height: 150,
    opacity: 0.15,
    zIndex: 1,
  },
  identityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  twoFactorCard: {
    backgroundColor: '#4a76b9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  twoFactorIcon: {
    marginBottom: 12,
  },
  twoFactorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  twoFactorDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
  },
  twoFactorSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  twoFactorStateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  biometricsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(189,202,192,0.5)',
    padding: 16,
    gap: 16,
    marginBottom: 16,
  },
  biometricsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,107,71,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricsContent: {
    flex: 1,
  },
  biometricsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  biometricsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  recommendedBadge: {
    backgroundColor: 'rgba(0,107,71,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#006b47',
  },
  biometricsDesc: {
    fontSize: 13,
    color: '#3e4942',
    marginBottom: 12,
    lineHeight: 18,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006b47',
  },
  devicesCard: {
    backgroundColor: '#f3f4f5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  devicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  devicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deviceTextCol: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  deviceDetail: {
    fontSize: 12,
    color: '#3e4942',
    marginTop: 2,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#006b47',
  },
  logoutDeviceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ae2f34',
  },
  divider: {
    height: 1,
    backgroundColor: '#e1e3e4',
    marginVertical: 12,
  },
  walletBanner: {
    backgroundColor: '#2e3132',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  walletBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#00875a',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '5deg' }],
  },
  walletBannerContent: {
    flex: 1,
  },
  walletBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  walletBannerDesc: {
    fontSize: 13,
    color: '#e1e3e4',
    lineHeight: 20,
    marginBottom: 16,
  },
  auditButton: {
    backgroundColor: '#ae2f34',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  auditButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
