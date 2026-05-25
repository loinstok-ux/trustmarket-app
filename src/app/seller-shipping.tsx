import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function SellerShippingScreen() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso Requerido', 'Se necesita permiso para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleConfirmShipping = () => {
    if (!trackingNumber && !imageUri) {
      Alert.alert('Datos incompletos', 'Por favor ingresa un número de tracking o sube una foto de la guía.');
      return;
    }

    Alert.alert(
      'Confirmar Envío',
      '¿Estás seguro de que has entregado el paquete a la agencia de envíos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            // Simulamos actualización en el backend
            Alert.alert('Envío Registrado', 'El comprador será notificado.', [
              { text: 'OK', onPress: () => router.push('/success') }
            ]);
          }
        }
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

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperLineBg} />
            <View style={styles.stepperLineProgress} />
            
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepCompleted]}>
                <MaterialIcons name="check" size={18} color="#ffffff" />
              </View>
              <Text style={styles.stepText}>Pago</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepActive]}>
                <MaterialIcons name="local-shipping" size={20} color="#00875a" />
              </View>
              <Text style={[styles.stepText, styles.stepTextActive]}>Envío</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepPending]}>
                <MaterialIcons name="lock-open" size={18} color="#6e7a71" />
              </View>
              <Text style={styles.stepText}>Liberación</Text>
            </View>
          </View>

          {/* Secure Funds Alert */}
          <View style={styles.alertCard}>
            <View style={styles.alertIconWrapper}>
              <MaterialIcons name="shield" size={24} color="#ffffff" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>
                El pago del comprador <Text style={styles.textBold}>$280.00</Text> está <Text style={styles.textUnderline}>congelado de forma segura</Text> en el Escrow de SecureMarket.
              </Text>
              <View style={styles.badgeContainer}>
                <View style={styles.pulseDot} />
                <Text style={styles.badgeText}>Protección activa en custodia</Text>
              </View>
            </View>
          </View>

          {/* Shipping Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Detalles del Envío</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <MaterialIcons name="photo-camera" size={16} /> Foto de la Guía de Envío
              </Text>
              <TouchableOpacity style={styles.uploadArea} onPress={handlePickImage}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.previewImage} />
                ) : (
                  <>
                    <View style={styles.uploadIconContainer}>
                      <MaterialIcons name="upload-file" size={32} color="#006b47" />
                    </View>
                    <Text style={styles.uploadTitle}>Haz clic para subir imagen</Text>
                    <Text style={styles.uploadSubtitle}>PNG, JPG hasta 5MB</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <MaterialIcons name="tag" size={16} /> Número de Tracking
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: VZLA-88293-XP"
                  placeholderTextColor="#6e7a71"
                  value={trackingNumber}
                  onChangeText={setTrackingNumber}
                />
                <TouchableOpacity style={styles.qrIcon}>
                  <MaterialIcons name="qr-code-scanner" size={24} color="#006b47" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={20} color="#2e5d9e" />
              <Text style={styles.infoText}>
                Una vez confirmado, el comprador recibirá una notificación para seguir el paquete.
              </Text>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleConfirmShipping}>
              <MaterialIcons name="check-circle" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Confirmar Envío</Text>
            </TouchableOpacity>
            <Text style={styles.termsText}>
              Al confirmar, declaras que el paquete ha sido entregado a la agencia.
            </Text>
          </View>

          {/* Product Summary */}
          <View style={styles.productSummaryCard}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBILHqDWbczdE29M2kYQMis_5jlUt3KowprofuNYyCwgub5hUaPrqPdO-20cKVf0RhO83eZu3lM3OX5ThDLVzKAvycyFwv9vRsbEpoXSdfRakdgvd2aXjKKDWljv_aLZ9RUyBDWMLKbSR7dPKXTm53CYfO7grkQvDpc1Lkphl4ha55LtUS2npGab6L-j8pxBeea2hzgPRxA6mikGUG6O3KXYGqQOjFcNtAcXFRnCasidrPGaj2j_7t4jFeXD_n8bqv6STsMej_16bDu' }}
              style={styles.productThumbnail}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productTitle} numberOfLines={1}>Sony WH-1000XM4</Text>
              <Text style={styles.productStatus}>Estado: Esperando envío</Text>
              <View style={styles.protectedBadge}>
                <MaterialIcons name="verified-user" size={14} color="#006b47" />
                <Text style={styles.protectedText}>VENTA PROTEGIDA</Text>
              </View>
            </View>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
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
  
  stepperContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, position: 'relative', paddingHorizontal: 10 },
  stepperLineBg: { position: 'absolute', top: 16, left: 20, right: 20, height: 2, backgroundColor: '#e1e3e4', zIndex: 0 },
  stepperLineProgress: { position: 'absolute', top: 16, left: 20, width: '50%', height: 2, backgroundColor: '#00875a', zIndex: 1 },
  stepItem: { alignItems: 'center', zIndex: 2, gap: 8 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  stepCompleted: { backgroundColor: '#00875a' },
  stepActive: { backgroundColor: '#ffffff', borderWidth: 3, borderColor: '#00875a' },
  stepPending: { backgroundColor: '#e1e3e4' },
  stepText: { fontSize: 12, color: '#6e7a71' },
  stepTextActive: { color: '#006b47', fontWeight: 'bold' },
  
  alertCard: { backgroundColor: '#8df7c1', borderRadius: 16, padding: 20, flexDirection: 'row', gap: 16, marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  alertIconWrapper: { backgroundColor: '#005235', padding: 12, borderRadius: 12, height: 48, justifyContent: 'center' },
  alertContent: { flex: 1 },
  alertText: { fontSize: 14, color: '#002113', lineHeight: 22, marginBottom: 12 },
  textBold: { fontWeight: '700' },
  textUnderline: { textDecorationLine: 'underline', fontWeight: 'bold' },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, alignSelf: 'flex-start', gap: 6 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#006b47' },
  badgeText: { fontSize: 12, color: '#005235', fontWeight: '600' },
  
  formSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#191c1d', marginBottom: 16 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#3e4942', fontWeight: '600', marginBottom: 8 },
  
  uploadArea: { borderWidth: 2, borderColor: '#bdcac0', borderStyle: 'dashed', borderRadius: 16, padding: 24, alignItems: 'center', backgroundColor: '#f3f4f5', minHeight: 140, justifyContent: 'center' },
  previewImage: { width: '100%', height: 160, borderRadius: 12, resizeMode: 'cover' },
  uploadIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,107,71,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  uploadTitle: { fontSize: 14, fontWeight: '600', color: '#191c1d', marginBottom: 4 },
  uploadSubtitle: { fontSize: 12, color: '#6e7a71' },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f5', borderRadius: 16, borderWidth: 1, borderColor: '#e1e3e4' },
  input: { flex: 1, height: 56, paddingHorizontal: 16, fontSize: 16, color: '#191c1d' },
  qrIcon: { padding: 16 },
  
  infoBox: { flexDirection: 'row', backgroundColor: '#e7e8e9', padding: 12, borderRadius: 12, alignItems: 'center', gap: 12, marginBottom: 24 },
  infoText: { flex: 1, fontSize: 12, color: '#3e4942', lineHeight: 18 },
  
  submitButton: { backgroundColor: '#00875a', height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 4, shadowColor: '#00875a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  termsText: { textAlign: 'center', fontSize: 12, color: '#6e7a71', marginTop: 12 },
  
  productSummaryCard: { flexDirection: 'row', backgroundColor: '#ffffff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e1e3e4', alignItems: 'center', gap: 16 },
  productThumbnail: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#f3f4f5' },
  productDetails: { flex: 1 },
  productTitle: { fontSize: 14, fontWeight: '600', color: '#191c1d', marginBottom: 4 },
  productStatus: { fontSize: 12, color: '#6e7a71', marginBottom: 8 },
  protectedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  protectedText: { fontSize: 10, fontWeight: '700', color: '#006b47', letterSpacing: 0.5 },
});
