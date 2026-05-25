import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SuccessScreen() {
  const router = useRouter();

  // Animations
  const scaleValue = useSharedValue(0.5);
  const opacityValue = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);

  useEffect(() => {
    scaleValue.value = withSpring(1, { damping: 10, stiffness: 100 });
    opacityValue.value = withTiming(1, { duration: 500 });
    
    cardOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    cardTranslateY.value = withDelay(400, withSpring(0, { damping: 12 }));
  }, []);

  const animatedCheckStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Shell */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={24} color="#006b47" />
          <Text style={styles.headerTitle}>SecureMarket</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="share" size={24} color="#3e4942" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/feed')}>
            <MaterialIcons name="close" size={24} color="#3e4942" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        
        {/* Success Badge */}
        <Animated.View style={[styles.badgeContainer, animatedCheckStyle]}>
          <View style={styles.glowCircle}>
            <MaterialIcons name="check-circle" size={80} color="#006b47" />
          </View>
          <View style={styles.verifiedTag}>
            <MaterialIcons name="verified" size={14} color="#005235" />
            <Text style={styles.verifiedTagText}>TrustMarket verified</Text>
          </View>
        </Animated.View>

        {/* Main Message */}
        <Animated.View style={[styles.messageContainer, { opacity: opacityValue }]}>
          <Text style={styles.title}>¡Transacción Segura Completada!</Text>
          <Text style={styles.subtitle}>
            El intercambio ha sido verificado satisfactoriamente. Los fondos han sido liberados de forma segura.
          </Text>
        </Animated.View>

        {/* Transaction Summary Card */}
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>ID de Transacción</Text>
            <Text style={styles.cardId}>#SM-8829-XP</Text>
          </View>
          
          <View style={styles.cardBody}>
            <Text style={styles.amountLabel}>MONTO LIBERADO</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amountPrimary}>$1,240.00</Text>
              <Text style={styles.amountCurrency}>USD</Text>
            </View>
            <Text style={styles.amountSecondary}>Bs. 55.800,00</Text>
            
            <View style={styles.balanceInfo}>
              <MaterialIcons name="account-balance-wallet" size={20} color="#006b47" />
              <View style={styles.balanceTexts}>
                <Text style={styles.balanceTitle}>Balance disponible</Text>
                <Text style={styles.balanceDesc}>Acreditado instantáneamente en tu billetera SecureMarket.</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actions, animatedCardStyle]}>
          <TouchableOpacity style={styles.primaryButton}>
            <MaterialIcons name="receipt-long" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Ver Comprobante</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/feed')}>
            <MaterialIcons name="home" size={20} color="#006b47" />
            <Text style={styles.secondaryButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </Animated.View>
        
      </View>

      {/* Visual Polish: Background Gradients */}
      <LinearGradient
        colors={['rgba(141, 247, 193, 0.2)', 'transparent']}
        style={styles.bgGradientTop}
      />
      <LinearGradient
        colors={['transparent', 'rgba(255, 107, 107, 0.1)']}
        style={styles.bgGradientBottom}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    height: 64, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#006b47' },
  iconButton: { padding: 8, borderRadius: 20 },
  
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, zIndex: 2 },
  
  badgeContainer: { alignItems: 'center', marginBottom: 32, position: 'relative' },
  glowCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#8df7c1', justifyContent: 'center', alignItems: 'center', shadowColor: '#006b47', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  verifiedTag: { position: 'absolute', top: -10, right: -10, backgroundColor: '#8df7c1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  verifiedTagText: { fontSize: 12, color: '#005235', fontWeight: '600' },
  
  messageContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#191c1d', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#3e4942', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  
  card: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#bdcac0', marginBottom: 40 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e1e3e4', paddingBottom: 16, marginBottom: 24 },
  cardLabel: { fontSize: 14, color: '#6e7a71' },
  cardId: { fontSize: 14, fontWeight: '700', color: '#191c1d' },
  
  cardBody: { gap: 8 },
  amountLabel: { fontSize: 12, color: '#6e7a71', fontWeight: '600', letterSpacing: 1 },
  amountContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  amountPrimary: { fontSize: 36, fontWeight: '700', color: '#006b47', letterSpacing: -1 },
  amountCurrency: { fontSize: 16, color: '#6e7a71' },
  amountSecondary: { fontSize: 20, color: '#6e7a71', fontWeight: '600', marginBottom: 16 },
  
  balanceInfo: { flexDirection: 'row', backgroundColor: 'rgba(141, 247, 193, 0.3)', padding: 16, borderRadius: 16, alignItems: 'center', gap: 12 },
  balanceTexts: { flex: 1 },
  balanceTitle: { fontSize: 14, color: '#005235', fontWeight: '600' },
  balanceDesc: { fontSize: 12, color: '#3e4942', marginTop: 4, lineHeight: 18 },
  
  actions: { width: '100%', gap: 16 },
  primaryButton: { height: 56, backgroundColor: '#006b47', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 4, shadowColor: '#006b47', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { height: 56, borderWidth: 2, borderColor: '#006b47', borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  secondaryButtonText: { color: '#006b47', fontSize: 16, fontWeight: '600' },
  
  bgGradientTop: { position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 200, zIndex: 0 },
  bgGradientBottom: { position: 'absolute', bottom: -150, left: -150, width: 500, height: 500, borderRadius: 250, zIndex: 0 },
});
