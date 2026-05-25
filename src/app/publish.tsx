import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { createProduct, upgradeUser } from '../services/api';

const EXCHANGE_RATE = 36.50;

export default function PublishScreen() {
  const router = useRouter();
  
  // State for Stepper
  const [currentStep, setCurrentStep] = useState(1);
  
  // State for Step 1
  const [mainPhoto, setMainPhoto] = useState<string | null>('https://lh3.googleusercontent.com/aida-public/AB6AXuBXHP87G7KpZL0VA2F2tvPH4VS3QATMl50CeJLM6kBw8pf_Vqh9uZCavAbhq2LAcFFFBh31b_j_XfkzWls2rr1APL8b8q7qkEZXWdC6R-j1neFJSwgcnph0WEkQDXxXrBAo3MKH6D6pMAf15wLyg5zqPE1Kq2pwxD7nDmL5tL6anqe39xTux4_wtY-nxYDB5EqnDc7hTI6chZ9soYLOPvJJn3MVBCsV1t_0d7WIQQqQvtW997UW_Z6fh8TXstBVYlAYQLZU4WtyZsMK');

  // State for Step 2
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('Nuevo');
  const [description, setDescription] = useState('');
  
  // State for Step 3
  const [price, setPrice] = useState('');
  const [inPersonDelivery, setInPersonDelivery] = useState(true);
  const [escrowDelivery, setEscrowDelivery] = useState(true);

  const priceBs = price ? (parseFloat(price) * EXCHANGE_RATE).toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '0,00';

  const pickImage = async (useCamera: boolean) => {
    try {
      if (useCamera) {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara.');
          return;
        }
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería.');
          return;
        }
      }

      const result = useCamera 
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          });

      if (!result.canceled) {
        setMainPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert('Error', 'No se pudo cargar la imagen.');
    }
  };

  const handleAddPhoto = () => {
    Alert.alert(
      'Añadir Foto Principal',
      '¿De dónde quieres obtener la imagen?',
      [
        { text: 'Cámara', onPress: () => pickImage(true) },
        { text: 'Galería', onPress: () => pickImage(false) },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePublish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/feed');
    }
  };

  const handlePublish = async () => {
    if (!title || !price) {
      Alert.alert('Error', 'Título y precio son obligatorios');
      return;
    }

    try {
      const newProduct = await createProduct({
        title,
        price: parseFloat(price),
        description,
        seller: 'Usuario Actual',
        location: 'Caracas, Venezuela',
        delivery: escrowDelivery ? 'Entrega Segura' : 'Entrega Personal',
        image: mainPhoto || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHr9E31TtyhVfD-Qz4Y15E9_L8tQd5N41f71A9A9A4A2R_hZqg1_fJzC2g2A-x9F2rN2Z2_eU1gXfR-Yw8E_4_sM2A4z2H-w_5fH_w5E9T9g-Y_X_ZfE_h3T9q0M_sA_Ww3N8x5Y1Y-z2A4f5r0H_h1fT8f1A-M'
      });

      if (newProduct) {
        Alert.alert('¡Publicado Exitosamente!', 'Tu producto ya está visible en el marketplace.');
        router.push('/feed');
      }
    } catch (error: any) {
      if (error.message && error.message.includes('Límite')) {
        Alert.alert(
          'Límite Alcanzado 🔒', 
          'Has alcanzado el límite de 3 publicaciones gratuitas. ¿Quieres mejorar a Premium (Simulado)?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Upgrade Premium', 
              onPress: async () => {
                try {
                  await upgradeUser('Usuario Actual');
                  Alert.alert('¡Felicidades!', 'Ahora eres usuario Premium. Puedes publicar ilimitadamente.');
                  handlePublish();
                } catch (e) {
                  Alert.alert('Error', 'No se pudo procesar la mejora.');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudo publicar el producto: ' + error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#3e4942" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Publicar - {currentStep === 1 ? 'Fotos' : currentStep === 2 ? 'Detalles' : 'Precio'}
          </Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="security" size={24} color="#006b47" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Progress Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepperLine} />
            
            {/* Step 1 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep > 1 ? styles.stepCircleDone : styles.stepCircleActive]}>
                {currentStep > 1 ? (
                  <MaterialIcons name="check" size={18} color="#ffffff" />
                ) : (
                  <Text style={styles.stepTextActive}>1</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, currentStep >= 1 ? styles.stepLabelActive : {}]}>Fotos</Text>
            </View>
            
            {/* Step 2 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep > 2 ? styles.stepCircleDone : currentStep === 2 ? styles.stepCircleActive : styles.stepCircleInactive]}>
                {currentStep > 2 ? (
                  <MaterialIcons name="check" size={18} color="#ffffff" />
                ) : (
                  <Text style={[styles.stepTextActive, currentStep < 2 && styles.stepTextInactive]}>2</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, currentStep >= 2 ? styles.stepLabelActive : {}]}>Detalles</Text>
            </View>

            {/* Step 3 */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, currentStep === 3 ? styles.stepCircleActive : styles.stepCircleInactive]}>
                <Text style={[styles.stepTextActive, currentStep < 3 && styles.stepTextInactive]}>3</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep === 3 ? styles.stepLabelActive : {}]}>Precio</Text>
            </View>
          </View>

          {/* STEP 1: FOTOS */}
          {currentStep === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>Añade imágenes de tu producto</Text>
              <Text style={styles.subtitle}>
                Sube hasta 8 fotos. Las fotos claras y bien iluminadas venden más rápido.{' '}
                <Text style={{ fontWeight: '700', color: '#006b47' }}>Consejo:</Text> Muestra diferentes ángulos.
              </Text>

              <View style={styles.photoGrid}>
                {mainPhoto ? (
                  <View style={styles.mainPhotoWrapper}>
                    <Image source={{ uri: mainPhoto }} style={styles.mainPhotoImg} />
                    <TouchableOpacity style={styles.removePhotoBtn} onPress={() => setMainPhoto(null)}>
                      <MaterialIcons name="close" size={16} color="#ffffff" />
                    </TouchableOpacity>
                    <View style={styles.mainPhotoLabel}>
                      <Text style={styles.mainPhotoLabelText}>FOTO PRINCIPAL</Text>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.uploadArea} onPress={handleAddPhoto}>
                    <View style={styles.uploadIconWrapper}>
                      <MaterialIcons name="add-a-photo" size={32} color="#00875a" />
                    </View>
                    <Text style={styles.uploadTitle}>Añadir Foto Principal</Text>
                    <Text style={styles.uploadSub}>Máximo 10MB por imagen</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.smallSlotsRow}>
                  {[1, 2, 3, 4].map((i) => (
                    <TouchableOpacity key={i} style={styles.smallSlot}>
                      <MaterialIcons name="add" size={24} color="#bdcac0" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.securityBadgeRow}>
                <MaterialIcons name="verified-user" size={24} color="#006b47" />
                <View style={styles.securityBadgeTextCol}>
                  <Text style={styles.securityBadgeTitle}>Venta Segura Escrow</Text>
                  <Text style={styles.securityBadgeDesc}>
                    Tus fotos son revisadas automáticamente para garantizar que cumples con nuestros estándares de seguridad.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: DETALLES */}
          {currentStep === 2 && (
            <View style={styles.stepContent}>
              <View style={styles.formCard}>
                <View style={styles.formGroup}>
                  <View style={styles.labelRow}>
                    <MaterialIcons name="title" size={16} color="#3e4942" />
                    <Text style={styles.label}>Título del Producto</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: MacBook Pro M2 2023 - 16GB RAM"
                    placeholderTextColor="#6e7a71"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <View style={styles.labelRow}>
                      <MaterialIcons name="category" size={16} color="#3e4942" />
                      <Text style={styles.label}>Categoría</Text>
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej: Tecnología"
                      placeholderTextColor="#6e7a71"
                      value={category}
                      onChangeText={setCategory}
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <View style={styles.labelRow}>
                      <MaterialIcons name="verified" size={16} color="#3e4942" />
                      <Text style={styles.label}>Condición</Text>
                    </View>
                    <View style={styles.conditionToggle}>
                      <TouchableOpacity 
                        style={[styles.conditionBtn, condition === 'Nuevo' && styles.conditionBtnActive]}
                        onPress={() => setCondition('Nuevo')}
                      >
                        <Text style={[styles.conditionText, condition === 'Nuevo' && styles.conditionTextActive]}>Nuevo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.conditionBtn, condition === 'Usado' && styles.conditionBtnActive]}
                        onPress={() => setCondition('Usado')}
                      >
                        <Text style={[styles.conditionText, condition === 'Usado' && styles.conditionTextActive]}>Usado</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.labelRow}>
                    <MaterialIcons name="description" size={16} color="#3e4942" />
                    <Text style={styles.label}>Descripción detallada</Text>
                  </View>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Cuéntanos más sobre tu producto, características, garantía, etc."
                    placeholderTextColor="#6e7a71"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                </View>

                <View style={styles.securityAlertBox}>
                  <MaterialIcons name="shield" size={24} color="#006b47" />
                  <View style={styles.securityAlertTextCol}>
                    <Text style={styles.securityAlertTitle}>Publicación Segura</Text>
                    <Text style={styles.securityAlertDesc}>
                      Tu anuncio será revisado por nuestro sistema de seguridad para garantizar una experiencia confiable.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: PRECIO Y SEGURIDAD */}
          {currentStep === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.title}>Configura el precio</Text>
              
              <View style={styles.priceCard}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Precio en USD</Text>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="0.00"
                      placeholderTextColor="#6e7a71"
                      keyboardType="numeric"
                      value={price}
                      onChangeText={setPrice}
                    />
                  </View>
                </View>
                
                <View style={styles.bsRefBox}>
                  <View>
                    <Text style={styles.bsRefLabel}>REFERENCIA EN BS</Text>
                    <Text style={[styles.bsRefValue, price ? {color: '#191c1d'} : {}]}>Bs. {priceBs}</Text>
                  </View>
                  <MaterialIcons name="info-outline" size={20} color="#6e7a71" />
                </View>
                <Text style={styles.exchangeRateText}>Tasa de cambio actual: 1 USD = 36.50 Bs (BCV)</Text>
              </View>

              <Text style={[styles.title, { marginTop: 24, fontSize: 24 }]}>Métodos de Entrega</Text>
              <View style={styles.deliveryMethods}>
                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryIconWrapper}>
                    <MaterialIcons name="location-on" size={24} color="#006b47" />
                  </View>
                  <View style={styles.deliveryTextCol}>
                    <Text style={styles.deliveryTitle}>Entrega en Persona</Text>
                    <Text style={styles.deliverySub}>Validación por GPS obligatoria</Text>
                  </View>
                  <Switch
                    value={inPersonDelivery}
                    onValueChange={setInPersonDelivery}
                    trackColor={{ false: '#e1e3e4', true: '#006b47' }}
                  />
                </View>

                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryIconWrapper}>
                    <MaterialIcons name="local-shipping" size={24} color="#006b47" />
                  </View>
                  <View style={styles.deliveryTextCol}>
                    <Text style={styles.deliveryTitle}>Envío Protegido</Text>
                    <Text style={styles.deliverySub}>Custodia de pago (Escrow)</Text>
                  </View>
                  <Switch
                    value={escrowDelivery}
                    onValueChange={setEscrowDelivery}
                    trackColor={{ false: '#e1e3e4', true: '#006b47' }}
                  />
                </View>
              </View>

              <View style={[styles.securityAlertBox, { marginTop: 24 }]}>
                <View style={{ backgroundColor: '#006b47', padding: 8, borderRadius: 8 }}>
                  <MaterialIcons name="verified-user" size={20} color="#ffffff" />
                </View>
                <Text style={[styles.securityAlertDesc, { flex: 1, marginLeft: 12 }]}>
                  Tu pago estará siempre protegido por nuestro sistema de custodia. El vendedor recibe el dinero solo cuando confirmas la recepción.
                </Text>
              </View>
            </View>
          )}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          {currentStep === 3 ? (
            <>
              <View style={styles.bottomPriceCol}>
                <Text style={styles.bottomPriceLabel}>Precio sugerido</Text>
                <Text style={styles.bottomPriceValue}>
                  ${price || '0.00'} <Text style={styles.bottomPriceBs}>/ {priceBs} Bs.</Text>
                </Text>
              </View>
              <TouchableOpacity style={styles.nextButtonFinal} onPress={handleNext}>
                <Text style={styles.nextButtonTextFinal}>Publicar</Text>
                <MaterialIcons name="check-circle" size={20} color="#ffffff" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Siguiente</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
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
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006b47',
  },
  iconButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  stepperLine: {
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: '#e1e3e4',
    zIndex: -1,
  },
  stepItem: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleDone: {
    backgroundColor: '#006b47',
  },
  stepCircleActive: {
    backgroundColor: '#00875a',
    borderWidth: 2,
    borderColor: '#006b47',
  },
  stepCircleInactive: {
    backgroundColor: '#e1e3e4',
    borderWidth: 2,
    borderColor: '#bdcac0',
  },
  stepTextActive: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  stepTextInactive: {
    color: '#6e7a71',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6e7a71',
  },
  stepLabelActive: {
    color: '#006b47',
    fontWeight: '700',
  },
  stepContent: {
    gap: 16,
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
    marginBottom: 16,
  },
  photoGrid: {
    gap: 16,
  },
  mainPhotoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#bdcac0',
    position: 'relative',
  },
  mainPhotoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(25,28,29,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPhotoLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  mainPhotoLabelText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  uploadArea: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#bdcac0',
    borderStyle: 'dashed',
    backgroundColor: '#f3f4f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8df7c1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#006b47',
  },
  uploadSub: {
    fontSize: 12,
    color: '#3e4942',
    marginTop: 4,
  },
  smallSlotsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  smallSlot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#edeeef',
    borderWidth: 1,
    borderColor: '#bdcac0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityBadgeRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,107,71,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,107,71,0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  securityBadgeTextCol: {
    flex: 1,
  },
  securityBadgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006b47',
    marginBottom: 4,
  },
  securityBadgeDesc: {
    fontSize: 13,
    color: '#3e4942',
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 20,
  },
  formGroup: {},
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3e4942',
  },
  input: {
    backgroundColor: '#f3f4f5',
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#191c1d',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  conditionToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f5',
    borderRadius: 12,
    padding: 4,
    minHeight: 56,
  },
  conditionBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  conditionBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,107,71,0.1)',
  },
  conditionText: {
    fontSize: 14,
    color: '#6e7a71',
    fontWeight: '500',
  },
  conditionTextActive: {
    color: '#006b47',
    fontWeight: '700',
  },
  securityAlertBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(113, 219, 166, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0,107,71,0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  securityAlertTextCol: {
    flex: 1,
  },
  securityAlertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006b47',
    marginBottom: 4,
  },
  securityAlertDesc: {
    fontSize: 12,
    color: '#005235',
    opacity: 0.8,
    lineHeight: 18,
  },
  priceCard: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdcac0',
    padding: 24,
    gap: 20,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f5',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3e4942',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    height: 64,
    fontSize: 28,
    fontWeight: '700',
    color: '#191c1d',
  },
  bsRefBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#edeeef',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6e7a71',
  },
  bsRefLabel: {
    fontSize: 12,
    color: '#3e4942',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bsRefValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6e7a71',
  },
  exchangeRateText: {
    fontSize: 12,
    color: '#3e4942',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  deliveryMethods: {
    gap: 12,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bdcac0',
    borderRadius: 16,
    padding: 16,
  },
  deliveryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#edeeef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deliveryTextCol: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#191c1d',
  },
  deliverySub: {
    fontSize: 12,
    color: '#3e4942',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(189,202,192,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: '#6e7a71',
  },
  bottomPriceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006b47',
  },
  bottomPriceBs: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6e7a71',
  },
  nextButtonFinal: {
    backgroundColor: '#ae2f34',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 56,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonTextFinal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#006b47',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
