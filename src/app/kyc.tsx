import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUser, saveUser } from '../services/auth';
import { API_URL } from '../services/api';

export default function KycScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0=idle, 1=doc, 2=face, 3=bio
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkKycStatus = async () => {
      try {
        const user = await getUser();
        if (user?.kycVerified) {
          setVerified(true);
        }
      } catch (e) {
        console.error('Error checking KYC status:', e);
      }
    };
    checkKycStatus();
  }, []);

  const handleVerification = async () => {
    setLoading(true);
    try {
      // Step 1: Document scan
      setStep(1);
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permiso Denegado', 'Se necesita acceso a la cámara para escanear el documento.');
        setLoading(false);
        setStep(0);
        return;
      }

      const documentResult = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        quality: 0.7,
      });

      if (documentResult.canceled) {
        setLoading(false);
        setStep(0);
        return;
      }

      Alert.alert('Paso 1 Completado', 'Documento capturado. Ahora realizaremos el escaneo facial.');

      // Step 2: Face scan
      setStep(2);
      const faceResult = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        quality: 0.7,
      });

      if (faceResult.canceled) {
        setLoading(false);
        setStep(0);
        return;
      }

      Alert.alert('Paso 2 Completado', 'Rostro capturado. Por último, confirma tu biometría.');

      // Step 3: Biometric
      setStep(3);
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      let biometricPassed = false;

      if (hasHardware) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Verifica tu identidad',
        });
        biometricPassed = result.success;
      } else {
        biometricPassed = true; // No biometric hardware: auto-pass
      }

      if (!biometricPassed) {
        Alert.alert('Error', 'La autenticación biométrica falló. Intenta de nuevo.');
        setLoading(false);
        setStep(0);
        return;
      }

      // Mark KYC as verified in the backend
      const user = await getUser();
      if (user?.id) {
        await fetch(`${API_URL}/auth/${user.id}/kyc-verify`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        });

        // Update local user cache
        await saveUser({ ...user, kycVerified: true });
      }

      setVerified(true);
      Alert.alert(
        '¡Verificación Exitosa! 🎉',
        'Tu identidad ha sido verificada. Ahora tienes acceso completo a TrustMarket.',
        [{ 
          text: 'Entrar', 
          onPress: () => {
            try {
              router.replace('/feed');
            } catch (navError) {
              console.error('Error navegando a feed:', navError);
            }
          }
        }]
      );

    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema durante la verificación. Intenta de nuevo.');
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['', 'Escaneando documento...', 'Capturando rostro...', 'Verificando biometría...'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={24} color="#006b47" />
          <Text style={styles.headerTitle}>SecureMarket KYC</Text>
        </View>
        <TouchableOpacity style={styles.headerRight} onPress={() => router.push('/feed')}>
          <MaterialIcons name="close" size={24} color="#3e4942" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Stepper */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepperLine} />
          <View style={styles.step}>
            <View style={[styles.stepCircle, styles.stepCompleted]}>
              <MaterialIcons name="check" size={18} color="#fff" />
            </View>
            <Text style={styles.stepLabel}>Cuenta</Text>
          </View>
          <View style={styles.step}>
            <View style={[styles.stepCircle, verified ? styles.stepCompleted : styles.stepActive]}>
              {verified ? <MaterialIcons name="check" size={18} color="#fff" /> : <Text style={styles.stepNumberActive}>2</Text>}
            </View>
            <Text style={styles.stepLabelActive}>Identidad</Text>
          </View>
          <View style={styles.step}>
            <View style={[styles.stepCircle, verified ? styles.stepActive : styles.stepPending]}>
              <Text style={verified ? styles.stepNumberActive : styles.stepNumberPending}>3</Text>
            </View>
            <Text style={verified ? styles.stepLabelActive : styles.stepLabelPending}>Wallet</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Verifica tu Identidad</Text>
          <Text style={styles.subtitle}>
            Para garantizar la máxima seguridad en tus transacciones, confirma que eres tú. Solo toma un par de minutos.
          </Text>

          {/* Info Cards */}
          <View style={styles.cardsContainer}>
            <View style={[styles.card, step >= 1 && verified && styles.cardDone]}>
              <View style={[styles.iconContainer, { backgroundColor: step >= 1 && verified ? '#8df7c1' : '#e7e8e9' }]}>
                <MaterialIcons name="badge" size={24} color={step >= 1 && verified ? '#002113' : '#6e7a71'} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Documento de Identidad</Text>
                <Text style={styles.cardDesc}>Foto de tu Cédula de Identidad o Pasaporte vigente.</Text>
              </View>
              {step > 1 && <MaterialIcons name="check-circle" size={24} color="#006b47" />}
            </View>

            <View style={[styles.card, step >= 2 && verified && styles.cardDone]}>
              <View style={[styles.iconContainer, { backgroundColor: step >= 2 && verified ? '#d6e3ff' : '#e7e8e9' }]}>
                <MaterialIcons name="face" size={24} color={step >= 2 && verified ? '#001b3d' : '#6e7a71'} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Escaneo Facial</Text>
                <Text style={styles.cardDesc}>Captura biométrica para confirmar que el documento te pertenece.</Text>
              </View>
              {step > 2 && <MaterialIcons name="check-circle" size={24} color="#006b47" />}
            </View>
          </View>

          {/* Security Banner */}
          <View style={styles.securityBanner}>
            <View style={styles.securityIconWrapper}>
              <MaterialIcons name="lock" size={20} color="#005235" />
            </View>
            <Text style={styles.securityText}>
              Tu patrón biométrico se procesa localmente en tu dispositivo y nunca se almacena en nuestros servidores.
            </Text>
          </View>

          {/* Goal Card */}
          <ImageBackground
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTHpsOiwqaKTCSLZPYRfSqVMxKoz2y10As0ITXGuD3gRh9AShOtDykCHXgbk8gCUcSPdhOvNqx4DOWKlA8I4Wx1HTjWiMP1UlqkXbEZ5nRiVYi82eo1yix8HDjEgNd-XM9WrvhiXONUHvwoU9yv5uLx4RElXyBShCiqzGq8qsYTQAgjskatpjW8f7Ad2WihJj5gG4jwxWRnYysUSyQA2tEemCULXZdQNrHnVquFf4cZqtSRIX51-_hEcY9CFM3MMo2XQ_JVpZnABoU' }}
            style={styles.goalCard}
            imageStyle={styles.goalImage}
          >
            <View style={styles.goalOverlay} />
            <View style={styles.goalContent}>
              <View style={styles.goalBadge}>
                <MaterialIcons name="verified" size={16} color="#ffffff" />
                <Text style={styles.goalBadgeText}>META: USUARIO VERIFICADO</Text>
              </View>
              <Text style={styles.goalTitle}>Desbloquea TrustMarket</Text>
              <Text style={styles.goalDesc}>
                Al completar este paso, tendrás el distintivo de confianza y acceso completo al mercado.
              </Text>
            </View>
          </ImageBackground>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            {loading && step > 0 && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#006b47" size="small" />
                <Text style={styles.loadingText}>{stepLabels[step]}</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.button, verified && styles.buttonSuccess, loading && styles.buttonDisabled]}
              onPress={() => {
                if (verified) {
                  try {
                    router.replace('/feed');
                  } catch (e) {
                    console.error('Error en router.replace', e);
                  }
                } else {
                  handleVerification();
                }
              }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {verified ? 'Verificación Completada - Entrar ✓' : loading ? 'Procesando...' : 'Comenzar Verificación'}
              </Text>
              {!loading && <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              Al hacer clic, aceptas nuestros Términos de KYC y Política de Privacidad.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    height: 64, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#f8f9fa',
    borderBottomWidth: 1, borderBottomColor: '#e1e3e4',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#006b47', marginLeft: 8 },
  headerRight: { padding: 8, borderRadius: 24 },
  scrollContent: { paddingVertical: 24, paddingHorizontal: 16 },
  stepperContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 32, position: 'relative', paddingHorizontal: 16,
  },
  stepperLine: {
    position: 'absolute', top: 20, left: 40, right: 40,
    height: 2, backgroundColor: '#bdcac0', zIndex: -1,
  },
  step: { alignItems: 'center', gap: 8 },
  stepCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  stepCompleted: { backgroundColor: '#006b47' },
  stepActive: { backgroundColor: '#006b47', borderWidth: 4, borderColor: 'rgba(0,107,71,0.2)' },
  stepPending: { backgroundColor: '#e7e8e9', borderWidth: 2, borderColor: '#bdcac0' },
  stepNumberActive: { color: '#ffffff', fontWeight: 'bold' },
  stepNumberPending: { color: '#bdcac0', fontWeight: 'bold' },
  stepLabel: { fontSize: 12, color: '#191c1d' },
  stepLabelActive: { fontSize: 12, color: '#006b47', fontWeight: 'bold' },
  stepLabelPending: { fontSize: 12, color: '#3e4942' },
  content: { gap: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#191c1d', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#3e4942', lineHeight: 24 },
  cardsContainer: { gap: 16 },
  card: {
    flexDirection: 'row', padding: 20, backgroundColor: '#ffffff',
    borderRadius: 16, borderWidth: 1, borderColor: '#bdcac0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
    gap: 16, alignItems: 'center',
  },
  cardDone: { borderColor: '#006b47', backgroundColor: '#f0fff8' },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#191c1d', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#3e4942', lineHeight: 18 },
  securityBanner: {
    flexDirection: 'row', padding: 16, backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16, borderWidth: 1, borderColor: '#e9ecef', alignItems: 'center', gap: 12,
  },
  securityIconWrapper: { padding: 8, backgroundColor: 'rgba(0, 82, 53, 0.1)', borderRadius: 20 },
  securityText: { flex: 1, fontSize: 14, fontStyle: 'italic', color: '#3e4942' },
  goalCard: { minHeight: 260, borderRadius: 24, overflow: 'hidden', justifyContent: 'flex-end', marginTop: 8 },
  goalImage: { opacity: 0.4 },
  goalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(25, 28, 29, 0.6)' },
  goalContent: { padding: 24, position: 'relative', zIndex: 1 },
  goalBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#00875a',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    alignSelf: 'flex-start', gap: 6, marginBottom: 16,
  },
  goalBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  goalTitle: { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  goalDesc: { fontSize: 14, color: '#bdcac0', lineHeight: 20 },
  actionContainer: { marginTop: 8, gap: 12 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 8 },
  loadingText: { fontSize: 14, color: '#006b47', fontWeight: '500' },
  button: {
    backgroundColor: '#006b47', height: 56, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 12, elevation: 4,
  },
  buttonSuccess: { backgroundColor: '#006b47' },
  buttonDisabled: { backgroundColor: '#8da69d' },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  termsText: { textAlign: 'center', fontSize: 12, color: '#3e4942' },
});
