import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpCenterScreen() {
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
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/profile')}>
            <MaterialIcons name="account-circle" size={24} color="#3e4942" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Centro de Ayuda</Text>
          <Text style={styles.heroSubtitle}>Estamos aquí para garantizar que cada transacción sea segura y transparente.</Text>
          
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#6e7a71" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="¿Cómo podemos ayudarte hoy?"
              placeholderTextColor="#6e7a71"
            />
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {/* Escrow */}
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.iconBox, { backgroundColor: '#00875a' }]}>
              <MaterialIcons name="verified-user" size={24} color="#ffffff" />
            </View>
            <Text style={styles.categoryTitle}>¿Cómo funciona el Escrow?</Text>
            <Text style={styles.categoryDesc}>Aprende cómo protegemos tu dinero hasta que recibes el producto.</Text>
            <View style={styles.categoryLink}>
              <Text style={[styles.linkText, { color: '#006b47' }]}>Ver guía paso a paso</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#006b47" />
            </View>
          </TouchableOpacity>

          {/* In-Person */}
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.iconBox, { backgroundColor: '#4a76b9' }]}>
              <MaterialIcons name="visibility" size={24} color="#ffffff" />
            </View>
            <Text style={styles.categoryTitle}>Seguridad en Persona</Text>
            <Text style={styles.categoryDesc}>Protocolos y puntos seguros recomendados para tus intercambios físicos.</Text>
            <View style={styles.categoryLink}>
              <Text style={[styles.linkText, { color: '#2e5d9e' }]}>Protocolos de seguridad</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#2e5d9e" />
            </View>
          </TouchableOpacity>

          {/* Payments */}
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.iconBox, { backgroundColor: '#ff6b6b' }]}>
              <MaterialIcons name="payments" size={24} color="#ffffff" />
            </View>
            <Text style={styles.categoryTitle}>Problemas con un Pago</Text>
            <Text style={styles.categoryDesc}>Qué hacer si una transferencia falla o necesitas una devolución.</Text>
            <View style={styles.categoryLink}>
              <Text style={[styles.linkText, { color: '#ae2f34' }]}>Reportar incidencia</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#ae2f34" />
            </View>
          </TouchableOpacity>

          {/* Verification */}
          <TouchableOpacity style={styles.categoryCard}>
            <View style={[styles.iconBox, { backgroundColor: '#e1e3e4' }]}>
              <MaterialIcons name="badge" size={24} color="#3e4942" />
            </View>
            <Text style={styles.categoryTitle}>Verificación de Cuenta</Text>
            <Text style={styles.categoryDesc}>Niveles de identidad y cómo obtener el check de confianza.</Text>
            <View style={styles.categoryLink}>
              <Text style={[styles.linkText, { color: '#3e4942' }]}>Subir documentos</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#3e4942" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured Article */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>DESTACADO</Text>
            </View>
            <Text style={styles.featuredTitle}>Manual de Supervivencia: Evita Estafas Digitales</Text>
            <Text style={styles.featuredDesc}>
              Una guía exhaustiva escrita por nuestro equipo de seguridad institucional para protegerte de los fraudes más comunes.
            </Text>
            <TouchableOpacity style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>Leer Guía Completa</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvm2xrNpYyBQVb_RgtSLEKp863Ad5jOBX1zbaPvkbrYAem3guIow4WUU2aPGKu0Lnz6j7ELvumwAW2wbkETeorEYboxK0Woem388xIZM1fYrs3NxdHH7UKJiO9-X7m6_AvhaVhw0jYArDrnvdkDwBgQGXxUaiU_eF6UofPYskxGry754aPDIV_AO0tL_BfZcMsI8_a-P1bAFDIWbTqUlqlF80T7prDYIu0rn1a3fPNpBbSI0_fP0rsNd0Iwd6gEunMdsgVtSjCHqo3' }}
            style={styles.featuredImage}
          />
        </View>

        {/* Quick Resources */}
        <View style={styles.resourcesCard}>
          <Text style={styles.resourcesTitle}>Recursos Rápidos</Text>
          
          <TouchableOpacity style={styles.resourceItem}>
            <MaterialIcons name="description" size={24} color="#006b47" />
            <Text style={styles.resourceText}>Términos del Servicio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem}>
            <MaterialIcons name="policy" size={24} color="#006b47" />
            <Text style={styles.resourceText}>Política de Privacidad</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem}>
            <MaterialIcons name="gavel" size={24} color="#006b47" />
            <Text style={styles.resourceText}>Centro de Disputas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem}>
            <MaterialIcons name="forum" size={24} color="#006b47" />
            <Text style={styles.resourceText}>Comunidad de Usuarios</Text>
          </TouchableOpacity>

          <View style={styles.contactSection}>
            <Text style={styles.contactLabel}>¿No encuentras lo que buscas?</Text>
            <Text style={styles.contactPhone}>Llámanos: +1 800 SECURE</Text>
          </View>
        </View>

      </ScrollView>

      {/* Floating Support Button */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/chat')}>
        <MaterialIcons name="chat" size={28} color="#ffffff" />
        <View style={styles.fabDot} />
      </TouchableOpacity>
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
    gap: 4,
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
    padding: 16,
    paddingBottom: 80,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#191c1d',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#3e4942',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    width: '100%',
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#191c1d',
  },
  categoriesGrid: {
    gap: 16,
    marginBottom: 32,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bdcac0',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 8,
  },
  categoryDesc: {
    fontSize: 14,
    color: '#3e4942',
    marginBottom: 16,
    lineHeight: 20,
  },
  categoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  featuredCard: {
    backgroundColor: '#006b47',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  featuredContent: {
    padding: 24,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#005235',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  featuredBadgeText: {
    color: '#8df7c1',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 32,
  },
  featuredDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 24,
    lineHeight: 22,
  },
  featuredButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    color: '#006b47',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  resourcesCard: {
    backgroundColor: '#e7e8e9',
    borderRadius: 24,
    padding: 24,
  },
  resourcesTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  resourceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  contactSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#bdcac0',
  },
  contactLabel: {
    fontSize: 12,
    color: '#3e4942',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    fontWeight: '700',
    color: '#006b47',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ae2f34',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#006b47',
    borderWidth: 2,
    borderColor: '#f8f9fa',
  },
});
