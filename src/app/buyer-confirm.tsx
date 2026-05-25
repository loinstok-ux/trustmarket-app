import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

export default function BuyerConfirmScreen() {
  const router = useRouter();
  const transactionId = 'SM-94821';
  const qrValue = JSON.stringify({ txId: transactionId, action: 'CONFIRM_DELIVERY' });

  const handleReportProblem = () => {
    Alert.alert(
      'Reportar Problema',
      '¿Hubo algún problema con el producto o el envío?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Contactar Soporte', onPress: () => console.log('Soporte contactado') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/chat')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#006b47" />
          </TouchableOpacity>
          <MaterialIcons name="security" size={24} color="#006b47" />
          <Text style={styles.headerTitle}>SecureMarket</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#3e4942" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Status Tracker */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.orderNumber}>Orden #{transactionId}</Text>
              <Text style={styles.statusTitle}>Envío en Camino</Text>
            </View>
            <View style={styles.protectedBadge}>
              <MaterialIcons name="verified" size={16} color="#005235" />
              <Text style={styles.protectedBadgeText}>Protegido</Text>
            </View>
          </View>

          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperLineBg} />
            <View style={styles.stepperLineProgress} />
            
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCompleted]}>
                <MaterialIcons name="check" size={16} color="#ffffff" />
              </View>
              <Text style={styles.stepText}>Pagado</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCompleted]}>
                <MaterialIcons name="local-shipping" size={16} color="#ffffff" />
              </View>
              <Text style={styles.stepText}>Enviado</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepActive]}>
                <MaterialIcons name="inventory" size={16} color="#006b47" />
              </View>
              <Text style={[styles.stepText, styles.stepTextActive]}>Reparto</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepPending]}>
                <MaterialIcons name="how-to-reg" size={16} color="#6e7a71" />
              </View>
              <Text style={styles.stepText}>Recibido</Text>
            </View>
          </View>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <View style={styles.qrCard}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={qrValue}
                size={160}
                color="#191c1d"
                backgroundColor="#ffffff"
              />
              <View style={styles.qrOverlayCorner}>
                <MaterialIcons name="lock" size={20} color="#006b47" />
              </View>
            </View>
            
            <Text style={styles.qrInstruction}>
              Muestra este código al vendedor o introdúcelo para certificar la entrega y liberar los fondos.
            </Text>
            
            <View style={styles.manualCodeContainer}>
              <Text style={styles.manualCode}>842 — 921</Text>
            </View>
            <Text style={styles.manualCodeLabel}>Código manual de 6 dígitos</Text>
          </View>
        </View>

        {/* Product Context Card */}
        <View style={styles.productCard}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0GRwCR7WbH0EzyMQ9t3NPUXAyIoycueXRmlj7_9An6VavCYHVHiCETckbb3Z1fOwhwm5w_S-gj9q81pOInE8O9DPiIJdVYG-U8mTxWyZ81kLEp9OU1Lm0S6o1-JGD-KhZDq4EE3kzhsK7hOXuj9P7QWjsNZfXvcObJ2gI0qiGKz0evqI87azcTrBoZ8YyGf7DFW0n6x81fgCYggfBR8O8lYhFDDPFJdqE906MDQ0-lrthnOBSSFL-z-7OfS4irr8xG7-wzw9BsJ3c' }}
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={1}>Auriculares Pro Noise Cancel</Text>
            <Text style={styles.productSeller}>Vendedor: Alex TechStore (4.9★)</Text>
            <View style={styles.escrowAmountContainer}>
              <MaterialIcons name="account-balance-wallet" size={14} color="#0e4686" />
              <Text style={styles.escrowAmountText}>Fondos en Escrow: $249.00</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.reportButton} onPress={handleReportProblem}>
            <MaterialIcons name="report-problem" size={20} color="#ae2f34" />
            <Text style={styles.reportButtonText}>Tuve un problema con el producto</Text>
          </TouchableOpacity>
          <Text style={styles.securityWarning}>
            No compartas este código hasta que hayas revisado el producto.
          </Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    height: 64, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#f8f9fa',
    borderBottomWidth: 1, borderBottomColor: '#e1e3e4',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backButton: { padding: 4, marginRight: 4 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#006b47', marginLeft: 4 },
  iconButton: { padding: 8, borderRadius: 20 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  
  statusSection: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e1e3e4', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  orderNumber: { fontSize: 12, color: '#6e7a71', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  statusTitle: { fontSize: 20, fontWeight: '700', color: '#191c1d' },
  protectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#8df7c1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  protectedBadgeText: { fontSize: 12, color: '#005235', fontWeight: '600' },
  
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', position: 'relative' },
  stepperLineBg: { position: 'absolute', top: 16, left: 10, right: 10, height: 2, backgroundColor: '#e1e3e4', zIndex: 0 },
  stepperLineProgress: { position: 'absolute', top: 16, left: 10, width: '70%', height: 2, backgroundColor: '#006b47', zIndex: 1 },
  stepItem: { alignItems: 'center', zIndex: 2 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  stepCompleted: { backgroundColor: '#006b47' },
  stepActive: { backgroundColor: '#ffffff', borderWidth: 3, borderColor: '#006b47' },
  stepPending: { backgroundColor: '#e7e8e9', shadowOpacity: 0, elevation: 0 },
  stepText: { fontSize: 11, color: '#6e7a71', marginTop: 8 },
  stepTextActive: { color: '#006b47', fontWeight: 'bold' },
  
  qrSection: { alignItems: 'center', marginBottom: 24 },
  qrCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 32, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#e1e3e4', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  qrWrapper: { padding: 16, backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e1e3e4', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, position: 'relative' },
  qrOverlayCorner: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', padding: 2, borderRadius: 8 },
  qrInstruction: { fontSize: 14, color: '#191c1d', textAlign: 'center', marginTop: 24, marginBottom: 16, lineHeight: 22 },
  manualCodeContainer: { backgroundColor: 'rgba(141, 247, 193, 0.2)', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, borderWidth: 1, borderColor: '#8df7c1', marginBottom: 8 },
  manualCode: { fontSize: 24, fontWeight: '700', color: '#006b47', letterSpacing: 4 },
  manualCodeLabel: { fontSize: 12, color: '#6e7a71' },
  
  productCard: { flexDirection: 'row', backgroundColor: '#edeeef', padding: 12, borderRadius: 16, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#e1e3e4', marginBottom: 24 },
  productImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#fff' },
  productDetails: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '600', color: '#191c1d', marginBottom: 4 },
  productSeller: { fontSize: 12, color: '#3e4942', marginBottom: 6 },
  escrowAmountContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  escrowAmountText: { fontSize: 12, color: '#0e4686', fontWeight: '500' },
  
  actionsContainer: { paddingTop: 8, paddingBottom: 24 },
  reportButton: { height: 56, borderWidth: 2, borderColor: '#ae2f34', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'transparent' },
  reportButtonText: { color: '#ae2f34', fontSize: 14, fontWeight: '600' },
  securityWarning: { textAlign: 'center', fontSize: 12, color: '#6e7a71', marginTop: 16 },
});
