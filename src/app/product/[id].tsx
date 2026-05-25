import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Dimensions, ActivityIndicator, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { freezeFunds } from '../../services/api';
import { getUser } from '../../services/auth';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id, title, price, seller, location, image } = useLocalSearchParams();
  const router = useRouter();
  const [buying, setBuying] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  // Fallbacks in case params are missing
  const displayTitle = title || 'Memoria RAM Corsair Vengeance RGB Pro 16GB';
  const displayPrice = price || '100.00';
  const displaySeller = seller || 'Alex Sterling';
  const displayLocation = location || 'Caracas, Chacao';
  const displayImage = image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdGep0t8erH6vwCogRb6e5mZ_R9WX4dRJJjJKSifhSuwbLsjmPBYvCCuWUk9QSM-ilj7lv3X_WC6h0gUyHmgAb5d9AVult0PClS8ruB1SVWoZ9yXZG2V6MhBCMhsZkm0Pg_HrU2bdcvgvQ8s92xX5BRcIH9LGj7GDGhXwNDxtKaWgd3lvf9sDGnqLtbJmXIrHrcKSXeEN8Q_rYI0Y_4vns2C5GlwAsndQee_L6EKlpYwuMj1BUordfXnEWeJgmw_SZGJe9Xi8Yrf5I';

  const handleBuy = () => {
    router.push({
      pathname: '/chat',
      params: { id, title: displayTitle, price: displayPrice, image: image as string }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top AppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/feed')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#006b47" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SecureMarket</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#006b47" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            <Image source={{ uri: displayImage as string }} style={styles.galleryImage} />
            <Image source={{ uri: displayImage as string }} style={styles.galleryImage} />
          </ScrollView>
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicatorDot, styles.indicatorActive]} />
            <View style={styles.indicatorDot} />
          </View>
        </View>

        <View style={styles.contentPadding}>
          {/* Main Info */}
          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>{displayTitle}</Text>
              <TouchableOpacity style={styles.favoriteBtn}>
                <MaterialIcons name="favorite-border" size={24} color="#ae2f34" />
              </TouchableOpacity>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.price}>${displayPrice}</Text>
              <Text style={styles.refPrice}>Ref: {(parseFloat(displayPrice as string) * 45).toFixed(2)} Bs.</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeader}>DESCRIPCIÓN DETALLADA</Text>
            <Text style={styles.description}>
              Potencia tu equipo con este increíble producto. No solo ofrece un rendimiento excepcional, sino que también cuenta con garantía y durabilidad comprobada.
              {'\n\n'}
              Optimizada para un rendimiento máximo con perfiles listos para usar de manera sencilla.
            </Text>
          </View>

          {/* Seller Card */}
          <View style={styles.cardSection}>
            <View style={styles.sellerHeader}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBojGTyQk0xHbO4EpfoXIC7E97gbSADWHeQdH5jYntnc0wmkXnehK-K_dbSAPccwzk8jAKo54UWfhELavBIkY4Fnr-JmDZKV7Mp5Ilebe5FgVJW425wurJBmgeJYNRDXnIz2N-bmZh-xqQpTTEsFlKw9kgOTh5_UmT0xzEmIsxWJgbcUSXxh_3OKOGVfRD3QlPUl7uNoyTKh6XKSaLmPjBymQd_-S-R01-OsBCw-MCjSpDOH7jL9j8_rlXaqeIoOpC-mxHaK9S1c6LJ' }}
                  style={styles.avatar}
                />
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={12} color="#ffffff" />
                </View>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{displaySeller}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={16} color="#f59e0b" />
                  <Text style={styles.ratingText}>4.9</Text>
                  <Text style={styles.salesText}>(124 ventas)</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.biometricBadge}>
              <MaterialIcons name="fingerprint" size={18} color="#006b47" />
              <Text style={styles.biometricText}>Identidad Validada con Biometría</Text>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Tiempo de respuesta</Text>
              <Text style={styles.statValue}>&lt; 30 min</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statLabel}>Ubicación</Text>
              <Text style={styles.statValue}>{displayLocation}</Text>
            </View>
          </View>

          {/* Secure Transaction Info */}
          <View style={styles.secureCard}>
            <View style={styles.secureHeader}>
              <MaterialIcons name="gpp-good" size={20} color="#2e5d9e" />
              <Text style={styles.secureTitle}>Compra 100% Protegida</Text>
            </View>
            <Text style={styles.secureText}>
              Tu pago se mantiene en custodia (escrow) hasta que confirmes la recepción y el estado del producto.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/chat')}>
          <MaterialIcons name="chat-bubble-outline" size={24} color="#ae2f34" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuy} disabled={buying}>
          {buying ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <MaterialIcons name="shield" size={20} color="#ffffff" />
              <Text style={styles.buyButtonText}>Comprar Ahora (Protegido)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Modal */}
      <Modal visible={!!errorModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <MaterialIcons name="error-outline" size={32} color="#ba1a1a" />
            </View>
            <Text style={styles.modalTitle}>No se pudo completar</Text>
            <Text style={styles.modalDesc}>{errorModal}</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setErrorModal(null)}>
                <Text style={styles.modalBtnCancelText}>Cerrar</Text>
              </TouchableOpacity>
              {errorModal?.toLowerCase().includes('fondos') && (
                <TouchableOpacity style={styles.modalBtnAction} onPress={() => {
                  setErrorModal(null);
                  router.push('/wallet');
                }}>
                  <Text style={styles.modalBtnActionText}>Ir a Wallet</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

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
    paddingBottom: 100,
  },
  galleryContainer: {
    position: 'relative',
    height: width * 0.75,
    backgroundColor: '#e7e8e9',
  },
  galleryImage: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  indicatorActive: {
    backgroundColor: '#ffffff',
  },
  contentPadding: {
    padding: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#191c1d',
    lineHeight: 28,
  },
  favoriteBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(174, 47, 52, 0.1)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#191c1d',
  },
  refPrice: {
    fontSize: 14,
    color: '#6e7a71',
    fontStyle: 'italic',
  },
  cardSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdcac0',
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6e7a71',
    letterSpacing: 1,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#3e4942',
    lineHeight: 24,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#8df7c1',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#00875a',
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#191c1d',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  salesText: {
    fontSize: 12,
    color: '#6e7a71',
  },
  biometricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(141, 247, 193, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  biometricText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#005235',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  statLabel: {
    fontSize: 13,
    color: '#6e7a71',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#191c1d',
  },
  secureCard: {
    backgroundColor: 'rgba(74, 118, 185, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 118, 185, 0.3)',
  },
  secureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  secureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e5d9e',
  },
  secureText: {
    fontSize: 13,
    color: '#0e4686',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(189, 202, 192, 0.3)',
  },
  chatButton: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: '#ae2f34',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffdad6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#191c1d',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 16,
    color: '#3e4942',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f5',
  },
  modalBtnCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3e4942',
  },
  modalBtnAction: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006b47',
  },
  modalBtnActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
