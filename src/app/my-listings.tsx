import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MyListingsScreen() {
  const router = useRouter();

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
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#3e4942" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton} onPress={() => router.push('/profile')}>
            <MaterialIcons name="person" size={20} color="#002113" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <View style={styles.breadcrumb}>
              <Text style={styles.breadcrumbText}>Marketplace</Text>
              <MaterialIcons name="chevron-right" size={14} color="#6e7a71" />
              <Text style={styles.breadcrumbActive}>Mis Publicaciones</Text>
            </View>
            <Text style={styles.heroTitle}>Gestión de Inventario</Text>
            <Text style={styles.heroSubtitle}>
              Supervisa tus ventas, edita tus listados y mantén el control total de tus transacciones seguras en tiempo real.
            </Text>
          </View>
          <TouchableOpacity style={styles.newButton} onPress={() => router.push('/publish')}>
            <MaterialIcons name="add" size={24} color="#ffffff" />
            <Text style={styles.newButtonText}>Nueva Publicación</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer} contentContainerStyle={styles.chipContent}>
          <TouchableOpacity style={[styles.chip, styles.chipActive]}>
            <Text style={styles.chipTextActive}>Todas (12)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Activas (8)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Vendidas (3)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}>
            <Text style={styles.chipText}>Revision (1)</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Listings Grid */}
        <View style={styles.gridContainer}>
          
          {/* Active Item */}
          <View style={styles.itemCard}>
            <View style={styles.itemImageWrapper}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpwlclTscVA6X8e-QRigJXw3cCYk9hHAfa8On0Gl4rJClx6EWtfBmMdrtaWAXpxTy_ZJha4p13YTQLv-KH3Bybq9PCxf2JhbQrBkRo4bNnPIZMzslLSbrjN7eFBkxFFQCXJ_5BHa8h7bpdc0QMbWcSJoqoj98Fu_9ZMquSsNZr2fdKhnPuEI730k62Y5dUUZYSlL4N43gfh-IAozfXx-Msm4wxAsUqtaiqpQW3Gvpd9WEssFHb8FGSKzS6M-BUNZNXiwhl0hG24iuU' }}
                style={styles.itemImage}
              />
              <View style={styles.escrowBadge}>
                <MaterialIcons name="verified-user" size={12} color="#ffffff" />
                <Text style={styles.escrowText}>Escrow Activo</Text>
              </View>
            </View>
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.statusTextActive}>ACTIVA</Text>
                <View style={styles.viewsRow}>
                  <MaterialIcons name="visibility" size={14} color="#3e4942" />
                  <Text style={styles.viewsText}>1.2k vistas</Text>
                </View>
              </View>
              <Text style={styles.itemTitle}>MacBook Pro M2 - 512GB SSD</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>
                Equipo impecable, un solo dueño. Incluye todos los accesorios originales y garantía extendida de SecureMarket por 6 meses.
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.itemPrice}>$1,450.00</Text>
                <Text style={styles.itemRefPrice}>≈ 52,200 Bs</Text>
              </View>
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.editButton}>
                  <MaterialIcons name="edit" size={18} color="#006b47" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pauseButton}>
                  <MaterialIcons name="pause-circle-outline" size={18} color="#3e4942" />
                  <Text style={styles.pauseButtonText}>Pausar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Stats Summary */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>RESUMEN DE VENTAS</Text>
            <View style={styles.statsList}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Ventas totales</Text>
                <Text style={styles.statValue}>$4,290</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>En Custodia (Escrow)</Text>
                <Text style={[styles.statValue, { color: '#006b47' }]}>$850</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Calificación Vendedor</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={16} color="#f59e0b" />
                  <Text style={styles.ratingValue}>4.9</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsTooltip}>
              <Text style={styles.statsTooltipText}>
                "Tu perfil está verificado. Tus publicaciones tienen un 40% más de visibilidad."
              </Text>
            </View>
          </View>

          {/* Sold Item */}
          <View style={[styles.itemCard, styles.itemSold]}>
            <View style={styles.itemImageWrapper}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0CvEN3hq_M82UHLWGZqE_juVuN9YLyd_U4UvNqVn4v84ESaONpRKBjZhkYsxj5BJZOh6Rd3doftjd7tFP95QvAt2FRo5ZpyDaoXghVPFRpHka_iRxVHiMeXCmWsRwQwu0Y4t_8Af8DW1nYjG3nNeqts8IUIx8HW0dXyDFqHiCQqJ80y3q26BoC0u4RdccI2ftwEqV4exSwjN1WyiDptA4keY5Xh3TCQmSl-iUEZaA2sTm4GHF4dFTHAjGREdfFAMzz83JcuX7m6rw' }}
                style={styles.itemImage}
              />
              <View style={styles.soldOverlay}>
                <View style={styles.soldBadge}>
                  <Text style={styles.soldBadgeText}>VENDIDO</Text>
                </View>
              </View>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Reloj Minimalist Black</Text>
              <Text style={styles.itemPrice}>$120.00</Text>
              <Text style={styles.itemDate}>Vendido el 12 de Oct, 2023</Text>
              <TouchableOpacity style={styles.detailsLink}>
                <MaterialIcons name="description" size={16} color="#006b47" />
                <Text style={styles.detailsLinkText}>Ver Detalles</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pending Item */}
          <View style={styles.itemCard}>
            <View style={styles.itemImageWrapper}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABOjg5Hy9Lbm2ke9A7KebAIkjdKJinuqYU66uT14cOYwGYds17YSpy1L8yr_CQkIIRTVulxBrdoswpiospODrsw3QSp2qktQ8rQEoyFFt274h7dvqL3K5rO7sq8kcXSO38Ha33t0Gip9MH-ykOVCzQoKbPxtioffQVC-dsMyMfEY_enBfxBd_HEN4ST7PUttGBDhCVhexizk2PKx5hHKeksasMB18vxUHQo8d0lnuOn9GdJuxa6fjhDBGu9pPLajWFb5fHB-nsjxuD' }}
                style={styles.itemImage}
              />
              <View style={styles.pendingOverlay} />
            </View>
            <View style={styles.itemContent}>
              <View style={styles.pendingHeader}>
                <View style={styles.pendingDot} />
                <Text style={styles.pendingText}>PENDIENTE DE REVISIÓN</Text>
              </View>
              <Text style={styles.itemTitle}>Audífonos Studio Hi-Fi</Text>
              <Text style={[styles.itemPrice, { marginBottom: 12 }]}>$280.00</Text>
              <View style={styles.pendingInfoBox}>
                <MaterialIcons name="info" size={16} color="#d97706" />
                <Text style={styles.pendingInfoText}>
                  Estamos verificando las fotos para asegurar la protección escrow.
                </Text>
              </View>
            </View>
          </View>

        </View>

        <TouchableOpacity style={styles.loadMoreButton}>
          <Text style={styles.loadMoreText}>Cargar más publicaciones</Text>
          <MaterialIcons name="expand-more" size={24} color="#191c1d" />
        </TouchableOpacity>

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
  headerRight: {
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
  avatarButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8df7c1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
    gap: 16,
  },
  heroTextContainer: {
    flex: 1,
    minWidth: 200,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#6e7a71',
  },
  breadcrumbActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#006b47',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#191c1d',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#3e4942',
    lineHeight: 24,
  },
  newButton: {
    backgroundColor: '#006b47',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#006b47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  newButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  chipContainer: {
    marginBottom: 24,
  },
  chipContent: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#e7e8e9',
  },
  chipActive: {
    backgroundColor: '#00875a',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3e4942',
  },
  chipTextActive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  gridContainer: {
    gap: 24,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(189,202,192,0.3)',
    overflow: 'hidden',
  },
  itemSold: {
    opacity: 0.75,
  },
  itemImageWrapper: {
    height: 200,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  escrowBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,107,71,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  escrowText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemContent: {
    padding: 24,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006b47',
    letterSpacing: 1,
  },
  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: '#3e4942',
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 8,
  },
  itemDesc: {
    fontSize: 16,
    color: '#3e4942',
    lineHeight: 24,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 24,
  },
  itemPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#191c1d',
  },
  itemRefPrice: {
    fontSize: 16,
    color: '#6e7a71',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderColor: '#006b47',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  editButtonText: {
    color: '#006b47',
    fontSize: 14,
    fontWeight: '600',
  },
  pauseButton: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderColor: '#6e7a71',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pauseButtonText: {
    color: '#3e4942',
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    backgroundColor: 'rgba(74, 118, 185, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 118, 185, 0.2)',
    borderRadius: 24,
    padding: 24,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0e4686',
    letterSpacing: 2,
    marginBottom: 16,
  },
  statsList: {
    gap: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#3e4942',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1d',
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(189, 202, 192, 0.3)',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191c1d',
  },
  statsTooltip: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  statsTooltipText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#3e4942',
  },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(25, 28, 29, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  soldBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191c1d',
    letterSpacing: 1,
  },
  itemDate: {
    fontSize: 12,
    color: '#6e7a71',
    marginBottom: 16,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006b47',
  },
  pendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 24,
    margin: 8,
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d97706',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#d97706',
  },
  pendingInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(189,202,192,0.2)',
    gap: 8,
  },
  pendingInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#3e4942',
  },
  loadMoreButton: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#6e7a71',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
});
