import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getWalletSummary, depositToWallet } from '../services/api';
import { getUser, logout } from '../services/auth';

export default function WalletScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [frozen, setFrozen] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadWallet = async () => {
    const user = await getUser();
    if (user) setCurrentUser(user);
    const userId = user?.id || 'user_123';
    const data = await getWalletSummary(userId);
    if (data) {
      setBalance(data.availableBalance || 0);
      setFrozen(data.frozenBalance || 0);
      setTransactions(data.recentTransactions || []);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleDeposit = async () => {
    const user = await getUser();
    const userId = user?.id || 'user_123';
    const data = await depositToWallet(userId, 1500);
    if (data) {
      setBalance(data.availableBalance || 0);
      setFrozen(data.frozenBalance || 0);
      setTransactions(data.recentTransactions || []);
      Alert.alert('Recarga Exitosa', 'Se han depositado $1500.00 en tu cuenta');
    } else {
      Alert.alert('Error', 'No se pudo realizar la recarga');
    }
  };

  const handleLogout = async () => {
    const doLogout = async () => {
      await logout();
      router.replace('/');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('¿Deseas cerrar sesión?')) {
        await doLogout();
      }
    } else {
      Alert.alert('Cerrar Sesión', '¿Deseas cerrar sesión?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={24} color="#006b47" />
          <Text style={styles.headerTitle}>SecureMarket</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="notifications" size={24} color="#3e4942" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile & Trust Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileInfo} onPress={() => router.push('/profile')}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD27jOV00jN9JVD_2l9RE2GW4fiUSUkKH96ANl03UCclzAdOriZl7MRR7dkDI8JbScrRmQhiM9c2QYrqJmaO9tFvFWzIlkRB8K7zFWni8LeYnd8fUl0Y-QVrDqtzltfrRAqvKKoaKeelo-jeznV_3FdwAnwfFLEJAPg3Y47QtX8GRApHCwXjhOAfdQ3Lq8kivh4IElcPmd37LitZI-Xy01BRCyjL3EHqvsnhejYEzZ6IQXILdgkQEK-I8g6jHVu0KBOfDGo1XnPzEes' }}
                style={styles.avatar}
              />
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={12} color="#ffffff" />
              </View>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{currentUser?.name || currentUser?.email || 'Mi Perfil'}</Text>
              <View style={styles.profileTags}>
                <View style={[styles.eliteTag, { backgroundColor: currentUser?.plan === 'premium' ? '#c59d00' : '#00875a' }]}>
                  <MaterialIcons name={currentUser?.plan === 'premium' ? 'star' : 'verified'} size={14} color="#ffffff" />
                  <Text style={styles.eliteTagText}>{currentUser?.plan === 'premium' ? 'Premium' : 'Free'}</Text>
                </View>
                {currentUser?.kycVerified && <Text style={styles.verifiedSinceText}>✓ KYC Verificado</Text>}
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#3e4942" />
          </TouchableOpacity>
        </View>

        {/* Wallet Card */}
        <View style={styles.walletCardContainer}>
          <LinearGradient
            colors={['#0e4686', '#1a5ba8']}
            style={styles.walletCard}
          >
            <View style={styles.walletCardHeader}>
              <View>
                <Text style={styles.balanceLabel}>SALDO DISPONIBLE</Text>
                <Text style={styles.balanceAmount}>$ {balance.toFixed(2)}</Text>
                <Text style={styles.balanceFiat}>≈ Bs. {(balance * 36.3).toFixed(2)}</Text>
              </View>
              <MaterialIcons name="account-balance-wallet" size={40} color="rgba(141, 247, 193, 0.5)" />
            </View>

            <View style={styles.escrowContainer}>
              <View style={styles.escrowLeft}>
                <MaterialIcons name="lock" size={20} color="#fbbf24" />
                <View style={styles.escrowTextContainer}>
                  <Text style={styles.escrowLabel}>Retenido en Garantía</Text>
                  <Text style={styles.escrowAmount}>$ {frozen.toFixed(2)}</Text>
                </View>
              </View>
              <MaterialIcons name="info-outline" size={20} color="rgba(255,255,255,0.5)" />
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButtonDeposit} onPress={handleDeposit}>
            <MaterialIcons name="add-circle-outline" size={20} color="#6d0010" />
            <Text style={styles.actionTextDeposit}>Recargar $1500</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonWithdraw}>
            <MaterialIcons name="payments" size={20} color="#006b47" />
            <Text style={styles.actionTextWithdraw}>Retirar</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Historial de transacciones</Text>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="receipt-long" size={40} color="#bdcac0" />
              <Text style={styles.emptyStateText}>Aún no tienes transacciones.{`\n`}¡Recarga tu saldo para comenzar!</Text>
            </View>
          ) : (
            transactions.map((tx: any, i: number) => {
              const isDeposit = tx.type === 'DEPOSIT' || tx.type === 'ESCROW_RELEASE';
              const isEscrow = tx.type === 'ESCROW_LOCK';
              return (
                <View key={i} style={styles.transactionCard}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIconBg, {
                      backgroundColor: isDeposit ? 'rgba(113, 219, 166, 0.2)' : isEscrow ? '#fef3c7' : 'rgba(25,28,29,0.08)'
                    }]}>
                      <MaterialIcons
                        name={isDeposit ? 'arrow-downward' : isEscrow ? 'lock' : 'arrow-upward'}
                        size={20}
                        color={isDeposit ? '#006b47' : isEscrow ? '#d97706' : '#191c1d'}
                      />
                    </View>
                    <View>
                      <Text style={styles.transactionTitle}>
                        {tx.type === 'DEPOSIT' ? 'Depósito' :
                         tx.type === 'ESCROW_LOCK' ? 'Escrow Activo' :
                         tx.type === 'ESCROW_RELEASE' ? 'Fondos Liberados' : 'Egreso'}
                      </Text>
                      <Text style={styles.transactionSubtitle}>
                        {new Date(tx.createdAt).toLocaleDateString('es-VE')} • {tx.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, {
                      color: isDeposit ? '#006b47' : isEscrow ? '#d97706' : '#191c1d'
                    }]}>
                      {isDeposit ? '+' : '-'} $ {Number(tx.amount).toFixed(2)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Security Badge */}
        <LinearGradient
          colors={['rgba(0, 107, 71, 0.05)', 'rgba(46, 93, 158, 0.05)']}
          style={styles.securityBadge}
        >
          <MaterialIcons name="security" size={40} color="#006b47" style={styles.securityIcon} />
          <Text style={styles.securityBadgeTitle}>Transacción Protegida</Text>
          <Text style={styles.securityBadgeText}>
            Tus fondos están asegurados por nuestro sistema de contratos inteligentes en cada paso de la compra-venta.
          </Text>
        </LinearGradient>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    borderBottomWidth: 1,
    borderBottomColor: '#e1e3e4',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006b47',
    marginLeft: 4,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#006b47',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#006b47',
    padding: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileText: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#191c1d',
    marginBottom: 4,
  },
  profileTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eliteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00875a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  eliteTagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedSinceText: {
    fontSize: 12,
    color: '#3e4942',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f5',
  },
  walletCardContainer: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#0e4686',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  walletCard: {
    padding: 24,
    borderRadius: 24,
  },
  walletCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d6e3ff',
    letterSpacing: 1,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  balanceFiat: {
    fontSize: 16,
    color: 'rgba(214, 227, 255, 0.8)',
    marginTop: 4,
  },
  escrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  escrowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  escrowTextContainer: {
    justifyContent: 'center',
  },
  escrowLabel: {
    fontSize: 12,
    color: '#d6e3ff',
  },
  escrowAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionButtonDeposit: {
    flex: 1,
    height: 56,
    backgroundColor: '#ff6b6b',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTextDeposit: {
    color: '#6d0010',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonWithdraw: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: '#006b47',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionTextWithdraw: {
    color: '#006b47',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    marginBottom: 32,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#191c1d',
  },
  historySeeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006b47',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#3e4942',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionFiat: {
    fontSize: 12,
    color: '#6e7a71',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6e7a71',
    textAlign: 'center',
    lineHeight: 22,
  },
  securityBadge: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 107, 71, 0.1)',
  },
  securityIcon: {
    marginBottom: 8,
  },
  securityBadgeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#006b47',
    marginBottom: 8,
  },
  securityBadgeText: {
    fontSize: 14,
    color: '#3e4942',
    textAlign: 'center',
    lineHeight: 20,
  },
});
