import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/wallet')} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color="#006b47" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="share" size={24} color="#006b47" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#006b47" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Transaction Header Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.checkIconWrapper}>
            <MaterialIcons name="check-circle" size={40} color="#00875a" />
          </View>
          <Text style={styles.statusTitle}>Transacción Completada</Text>
          <Text style={styles.statusDesc}>Los fondos han sido liberados exitosamente del escrow.</Text>
          
          <View style={styles.amountBox}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Monto Pagado</Text>
              <Text style={styles.amountValueUsd}>$ 1,240.00</Text>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabelSmall}>Tasa de cambio (BCV)</Text>
              <Text style={styles.amountValueBs}>Bs. 44,640.00</Text>
            </View>
          </View>
        </View>

        {/* Escrow Protection Badge */}
        <View style={styles.escrowBadge}>
          <MaterialIcons name="verified-user" size={24} color="#ffffff" />
          <View style={styles.escrowBadgeTextCol}>
            <Text style={styles.escrowBadgeTitle}>Escrow TrustMarket</Text>
            <Text style={styles.escrowBadgeSub}>Fondos Protegidos & Liberados</Text>
          </View>
          <MaterialIcons name="verified" size={24} color="#8df7c1" />
        </View>

        {/* Transaction Details Bento Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsCardHeader}>
            <Text style={styles.detailsCardHeaderTitle}>INFORMACIÓN DE LA OPERACIÓN</Text>
          </View>
          
          <View style={styles.detailsCardBody}>
            <View style={styles.dataGrid}>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>ID Transacción</Text>
                <Text style={styles.dataValueMono}>#{id || 'TRX-992841-BZ'}</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Fecha</Text>
                <Text style={styles.dataValue}>24 Oct, 2023</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Hora</Text>
                <Text style={styles.dataValue}>03:45 PM (VET)</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Método Pago</Text>
                <Text style={styles.dataValue}>Zelle / Pago Móvil</Text>
              </View>
            </View>

            <View style={styles.sellerSection}>
              <Text style={styles.dataLabel}>Contraparte (Vendedor)</Text>
              <View style={styles.sellerBox}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIkDvgfomw6QGDLNasf9bbWrtxIFSU-eumIlVAi3TFREsZFbFDyr6blGuSUf7IPMa2OgNQS60Qy38NncrL6xuyopsLrlnMbNAtYgOazBeaCdejThQICimnAQZwFF-umhN8hCtWjNP9uxgnv1ASCwj90qXT5osbhE4dpymtYTlhdS5sSVMPiFas5N0_hNtaPvpWJcc8DcuLCMdawSlY_ypILdtaA5lakdSmxCQwbeZeE3ONuhXZJ8iuh70kKyII1SKB3qwm3lm9URFG' }}
                  style={styles.sellerAvatar}
                />
                <View style={styles.sellerInfo}>
                  <View style={styles.sellerNameRow}>
                    <Text style={styles.sellerName}>Carlos Mendoza</Text>
                    <MaterialIcons name="verified" size={16} color="#006b47" />
                  </View>
                  <View style={styles.sellerRatingRow}>
                    <MaterialIcons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.sellerRatingText}>4.9 (1.2k ventas)</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.chatButton}>
                  <MaterialIcons name="chat-bubble" size={20} color="#8c1520" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.receiptButton}>
            <MaterialIcons name="receipt-long" size={20} color="#ffffff" />
            <Text style={styles.receiptButtonText}>Ver Comprobante Digital</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportButton}>
            <MaterialIcons name="support-agent" size={20} color="#3e4942" />
            <Text style={styles.supportButtonText}>Contactar Soporte Técnico</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          Esta transacción está protegida por nuestra política de Seguridad Institucional y Escrow 24/7.
        </Text>

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
    backgroundColor: '#f8f9fa',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006b47',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bdcac0',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#71dba6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusDesc: {
    fontSize: 14,
    color: '#3e4942',
    textAlign: 'center',
    marginBottom: 16,
  },
  amountBox: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(189,202,192,0.3)',
    paddingVertical: 16,
    gap: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#3e4942',
    fontWeight: '500',
  },
  amountValueUsd: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006b47',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  amountLabelSmall: {
    fontSize: 12,
    color: '#6e7a71',
  },
  amountValueBs: {
    fontSize: 14,
    color: '#3e4942',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  escrowBadge: {
    backgroundColor: '#00875a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  escrowBadgeTextCol: {
    flex: 1,
  },
  escrowBadgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  escrowBadgeSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bdcac0',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsCardHeader: {
    backgroundColor: '#f3f4f5',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#bdcac0',
  },
  detailsCardHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
    letterSpacing: 0.5,
  },
  detailsCardBody: {
    padding: 24,
    gap: 24,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 24,
    columnGap: 16,
  },
  dataCol: {
    width: '45%',
  },
  dataLabel: {
    fontSize: 12,
    color: '#6e7a71',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 14,
    color: '#191c1d',
    fontWeight: '500',
  },
  dataValueMono: {
    fontSize: 14,
    color: '#191c1d',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sellerSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(189,202,192,0.5)',
    paddingTop: 24,
  },
  sellerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(189,202,192,0.3)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 16,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  sellerInfo: {
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  sellerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  sellerRatingText: {
    fontSize: 12,
    color: '#3e4942',
  },
  chatButton: {
    backgroundColor: '#ffdad8',
    padding: 10,
    borderRadius: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  receiptButton: {
    height: 56,
    backgroundColor: '#006b47',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  receiptButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  supportButton: {
    height: 56,
    backgroundColor: '#e1e3e4',
    borderWidth: 1,
    borderColor: '#bdcac0',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  supportButtonText: {
    color: '#3e4942',
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 12,
    color: '#6e7a71',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
