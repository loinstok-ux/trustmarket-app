import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const router = useRouter();
  const { id, title, price, image, seller } = useLocalSearchParams();

  const priceNum = parseFloat(price as string) || 0;
  const priceBs = (priceNum * 36.50).toLocaleString('es-VE', { minimumFractionDigits: 2 });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top AppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={24} color="#006b47" />
          <Text style={styles.headerTitle}>SecureMarket</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/feed')}>
          <MaterialIcons name="close" size={24} color="#3e4942" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Transaction Status Indicator */}
        <View style={styles.statusIndicator}>
          <View style={styles.badge}>
            <MaterialIcons name="verified-user" size={18} color="#002113" />
            <Text style={styles.badgeText}>Escrow P2P Verificado Activo</Text>
          </View>
          <Text style={styles.statusTitle}>Pago Confirmado</Text>
          <Text style={styles.statusSub}>ID de Transacción: <Text style={styles.monoText}>#SM-{Math.floor(Math.random() * 10000)}-XP</Text></Text>
        </View>

        {/* Escrow Card */}
        <View style={styles.escrowCard}>
          <View style={styles.statusBadgeAbs}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusBadgeText}>En Custodia</Text>
          </View>
          
          <View style={styles.escrowCardHeader}>
            <View style={styles.shieldIconWrapper}>
              <MaterialIcons name="security" size={40} color="#006b47" />
            </View>
            <Text style={styles.escrowCardTitle}>Fondos Protegidos</Text>
            <Text style={styles.escrowCardDesc}>
              El dinero ha sido retenido de forma segura. El vendedor lo recibirá solo cuando tú confirmes la recepción del producto.
            </Text>
          </View>

          {/* Payment Details */}
          <View style={styles.paymentDetailsBox}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Monto del Pago</Text>
              <View style={styles.paymentAmountCol}>
                <Text style={styles.paymentUsd}>${priceNum.toFixed(2)}</Text>
                <Text style={styles.paymentBs}>Ref. {priceBs} Bs.</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.productRow}>
              <View style={styles.productImageWrapper}>
                <Image source={{ uri: (image as string) || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhVsr9adpkuAA2oWL2PFhOM-717_8Xm9BAN5kFn02E3uZn7FrlV44YCzagv5j2gkAGW5Vq_z16mwfkirjg64mZvC44GWRbgqO_Nhd96k-1CF2co6mLDDwkvO2JQoGcJ5N3Wc9E7kK-6QXTqKBlESbucPauXRhP0REsC0yCA7nP0tWjtMTWYnLa3iJ71BvnYWBVr7zZWrypmd2EaXuJEGfs-pz8dYpWxGK_cNdWe5Km6SI_NVYShNmT6WJ65ck2h_FurkTkXRRfOHDq' }} style={styles.productImage} />
              </View>
              <View style={styles.productInfoCol}>
                <Text style={styles.productTitle} numberOfLines={1}>{title || 'Producto de TrustMarket'}</Text>
                <Text style={styles.productSeller}>Vendedor: {seller || 'Vendedor Verificado'}</Text>
              </View>
              <MaterialIcons name="verified" size={24} color="#006b47" />
            </View>
          </View>
        </View>

        {/* Instructions / Steps */}
        <View style={styles.instructionsGrid}>
          <View style={styles.instructionCard}>
            <View style={styles.instructionIconWrapper}>
              <MaterialIcons name="qr-code-2" size={24} color="#006b47" />
            </View>
            <View style={styles.instructionTextCol}>
              <Text style={styles.instructionTitle}>Muestra tu Código</Text>
              <Text style={styles.instructionDesc}>Escanea el código del vendedor al momento de la entrega física.</Text>
            </View>
          </View>

          <View style={styles.instructionCard}>
            <View style={styles.instructionIconWrapper}>
              <MaterialIcons name="location-on" size={24} color="#006b47" />
            </View>
            <View style={styles.instructionTextCol}>
              <Text style={styles.instructionTitle}>Validación GPS</Text>
              <Text style={styles.instructionDesc}>Asegúrate de estar en el lugar acordado para validar la proximidad.</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Primary Action */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push(`/transaction/${id}`)}>
          <Text style={styles.primaryButtonText}>Continuar al Intercambio</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.disclaimerText}>
          Al hacer clic, confirmas que has revisado los detalles de la transacción y estás listo para reunirte con el vendedor.
        </Text>
      </View>
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
  statusIndicator: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8df7c1',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 8,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002113',
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#191c1d',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusSub: {
    fontSize: 16,
    color: '#3e4942',
    textAlign: 'center',
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  escrowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdcac0',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  statusBadgeAbs: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,107,71,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    zIndex: 10,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#006b47',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006b47',
  },
  escrowCardHeader: {
    padding: 24,
    alignItems: 'center',
  },
  shieldIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,107,71,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  escrowCardTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 8,
    textAlign: 'center',
  },
  escrowCardDesc: {
    fontSize: 16,
    color: '#3e4942',
    textAlign: 'center',
    lineHeight: 24,
  },
  paymentDetailsBox: {
    backgroundColor: '#edeeef',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(189,202,192,0.3)',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#3e4942',
  },
  paymentAmountCol: {
    alignItems: 'flex-end',
  },
  paymentUsd: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006b47',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  paymentBs: {
    fontSize: 14,
    color: '#6e7a71',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(189,202,192,0.3)',
    marginBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productImageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfoCol: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191c1d',
  },
  productSeller: {
    fontSize: 12,
    color: '#6e7a71',
  },
  instructionsGrid: {
    gap: 16,
  },
  instructionCard: {
    backgroundColor: '#f3f4f5',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  instructionIconWrapper: {
    backgroundColor: 'rgba(0,107,71,0.1)',
    padding: 8,
    borderRadius: 8,
  },
  instructionTextCol: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191c1d',
    marginBottom: 4,
  },
  instructionDesc: {
    fontSize: 14,
    color: '#3e4942',
    lineHeight: 20,
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e3e4',
  },
  primaryButton: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    gap: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#6d0010',
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6e7a71',
    textAlign: 'center',
    lineHeight: 16,
  },
});
