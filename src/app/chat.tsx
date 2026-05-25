import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, SafeAreaView, Alert, Modal, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { io, Socket } from 'socket.io-client';
import * as Location from 'expo-location';
import { API_URL, freezeFunds, releaseFunds } from '../services/api';
import { getUser } from '../services/auth';

export default function ChatScreen() {
  const router = useRouter();
  const { id, title, price, image } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [errorModal, setErrorModal] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const productId = (id as string) || '1';
  const displayTitle = (title as string) || 'Sony WH-1000XM4';
  const displayPrice = (price as string) || '280.00';
  const displayImage = (image as string) || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBILHqDWbczdE29M2kYQMis_5jlUt3KowprofuNYyCwgub5hUaPrqPdO-20cKVf0RhO83eZu3lM3OX5ThDLVzKAvycyFwv9vRsbEpoXSdfRakdgvd2aXjKKDWljv_aLZ9RUyBDWMLKbSR7dPKXTm53CYfO7grkQvDpc1Lkphl4ha55LtUS2npGab6L-j8pxBeea2hzgPRxA6mikGUG6O3KXYGqQOjFcNtAcXFRnCasidrPGaj2j_7t4jFeXD_n8bqv6STsMej_16bDu';

  useEffect(() => {
    // Connect to the /chat namespace
    socketRef.current = io(`${API_URL}/chat`, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Chat server');
      socketRef.current?.emit('join_room', { productId });
    });

    socketRef.current.on('new_message', (data: any) => {
      setMessages((prev) => [...prev, data]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      productId,
      text: message,
      sender: 'Buyer', // Mock sender
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socketRef.current?.emit('send_message', newMessage);
    setMessage('');
  };

  const handleInitiateTransaction = async (type: 'in_person' | 'shipping') => {
    try {
      const user = await getUser();
      const userId = user?.id || 'user_123';
      
      const numPrice = parseFloat(displayPrice);
      await freezeFunds(userId, numPrice, productId);
      
      router.push({
        pathname: '/checkout',
        params: { id: productId, title: displayTitle, price: displayPrice }
      });
    } catch (error: any) {
      setErrorModal(error.message || 'No se pudieron congelar los fondos.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.push('/feed')} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#006b47" />
            </TouchableOpacity>
            <MaterialIcons name="security" size={24} color="#006b47" />
            <Text style={styles.headerTitle}>SecureMarket</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#3e4942" />
          </TouchableOpacity>
        </View>

        {/* Negotiation Sticky Module */}
        <View style={styles.negotiationModule}>
          {/* Product Info */}
          <View style={styles.productInfo}>
            <Image 
              source={{ uri: displayImage }} 
              style={styles.productImage} 
            />
            <View style={styles.productDetails}>
              <View style={styles.productTitleRow}>
                <Text style={styles.productTitle} numberOfLines={1}>{displayTitle}</Text>
              </View>
              <View style={styles.productTitleRow}>
                <Text style={styles.productPrice}>${displayPrice}</Text>
              </View>
              <View style={styles.sellerRow}>
                <Text style={styles.sellerText}>Vendedor: Marcos R.</Text>
                <MaterialIcons name="verified" size={16} color="#006b47" />
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MaterialIcons name="more-vert" size={24} color="#3e4942" />
            </TouchableOpacity>
          </View>

          {/* Agreement Prompt */}
          <View style={styles.agreementPrompt}>
            <View style={styles.agreementTextContainer}>
              <Text style={styles.agreementTitle}>¿Llegaron a un acuerdo?</Text>
              <Text style={styles.agreementSubtitle}>Iniciar Intercambio Seguro</Text>
            </View>
            <View style={styles.agreementActions}>
              <TouchableOpacity 
                style={styles.btnPrimary} 
                onPress={() => handleInitiateTransaction('in_person')}
              >
                <MaterialIcons name="person" size={18} color="#ffffff" />
                <Text style={styles.btnPrimaryText}>En Persona</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOutline} onPress={() => handleInitiateTransaction('shipping')}>
                <MaterialIcons name="local-shipping" size={18} color="#006b47" />
                <Text style={styles.btnOutlineText}>Por Envío</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messageArea} showsVerticalScrollIndicator={false}>
          <View style={styles.dateDivider}>
            <Text style={styles.dateDividerText}>Hoy</Text>
          </View>

          {/* System Status */}
          <View style={styles.systemStatusContainer}>
            <View style={styles.systemStatus}>
              <MaterialIcons name="shield" size={16} color="#005235" />
              <Text style={styles.systemStatusText}>
                Chat encriptado. Tus pagos están protegidos por Escrow.
              </Text>
            </View>
          </View>

          {/* Dynamic Messages */}
          {messages.map((msg, index) => {
            const isMe = msg.sender === 'Buyer';
            return (
              <View key={index} style={isMe ? styles.messageRightContainer : styles.messageLeftContainer}>
                <View style={isMe ? styles.messageBubbleRight : styles.messageBubbleLeft}>
                  <Text style={isMe ? styles.messageTextRight : styles.messageTextLeft}>{msg.text}</Text>
                </View>
                {isMe ? (
                  <View style={styles.messageTimeRightContainer}>
                    <Text style={styles.messageTimeRight}>{msg.time}</Text>
                    <MaterialIcons name="done-all" size={14} color="#006b47" />
                  </View>
                ) : (
                  <Text style={styles.messageTimeLeft}>{msg.time}</Text>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.addButton}>
            <MaterialIcons name="add" size={24} color="#6e7a71" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#bdcac0"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <MaterialIcons name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Bottom Nav Spacer */}
        <View style={{ height: 24 }} />
      </View>

      {/* Error Modal */}
      <Modal visible={!!errorModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <MaterialIcons name="error-outline" size={32} color="#ba1a1a" />
            </View>
            <Text style={styles.modalTitle}>No se pudo completar</Text>
            <Text style={styles.modalDesc}>{errorModal}</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setErrorModal(null)}>
                <Text style={styles.modalBtnCancelText}>Cerrar</Text>
              </TouchableOpacity>
              {errorModal?.toLowerCase().includes('fondos') && (
                <TouchableOpacity style={styles.modalBtnAction} onPress={() => {
                  setErrorModal(null);
                  router.push('/wallet');
                }}>
                  <Text style={styles.modalBtnActionText}>Ir a Wallet</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
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
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#006b47',
    marginLeft: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  negotiationModule: {
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  productInfo: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#bdcac0',
    alignItems: 'center',
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e7e8e9',
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  bullet: {
    fontSize: 12,
    color: '#6e7a71',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#006b47',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  sellerText: {
    fontSize: 14,
    color: '#3e4942',
  },
  moreButton: {
    padding: 8,
  },
  agreementPrompt: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  agreementTextContainer: {
    marginBottom: 12,
  },
  agreementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
  },
  agreementSubtitle: {
    fontSize: 12,
    color: '#3e4942',
    marginTop: 2,
  },
  agreementActions: {
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#006b47',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  btnPrimaryDisabled: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8da69d',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  qrModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  qrModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  qrModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qrModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#191c1d',
  },
  qrModalSubtitle: {
    fontSize: 14,
    color: '#3e4942',
    marginBottom: 24,
    lineHeight: 20,
  },
  qrCodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bdcac0',
    marginBottom: 24,
  },
  qrNative: {
    width: 200,
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e1e3e4',
    gap: 8,
  },
  qrCodeText: {
    fontSize: 12,
    color: '#3e4942',
    fontFamily: 'monospace',
  },
  securityWarning: {
    flexDirection: 'row',
    backgroundColor: '#fce8e8',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  securityWarningText: {
    flex: 1,
    fontSize: 12,
    color: '#b3261e',
    marginLeft: 8,
    fontWeight: '500',
  },
  testScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#006b47',
    borderRadius: 12,
    gap: 8,
  },
  testScanText: {
    color: '#006b47',
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryConfirmationContainer: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    zIndex: 100,
  },
  deliveryCard: {
    backgroundColor: '#e6f4ea',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#006b47',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  deliveryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#006b47',
    marginBottom: 8,
  },
  deliverySubtitle: {
    fontSize: 14,
    color: '#3e4942',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmDeliveryButton: {
    backgroundColor: '#006b47',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  confirmDeliveryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#006b47',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  btnOutlineText: {
    color: '#006b47',
    fontSize: 14,
    fontWeight: '600',
  },
  messageArea: {
    padding: 16,
    paddingBottom: 24,
  },
  dateDivider: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dateDividerText: {
    backgroundColor: '#e7e8e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
    color: '#3e4942',
  },
  systemStatusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  systemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(113, 219, 166, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  systemStatusText: {
    fontSize: 12,
    color: '#005235',
  },
  messageLeftContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageBubbleLeft: {
    backgroundColor: '#e7e8e9',
    padding: 16,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  messageTextLeft: {
    fontSize: 16,
    color: '#191c1d',
    lineHeight: 24,
  },
  messageTimeLeft: {
    fontSize: 11,
    color: '#6e7a71',
    marginTop: 4,
    marginLeft: 4,
  },
  messageRightContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  messageBubbleRight: {
    backgroundColor: '#006b47',
    padding: 16,
    borderRadius: 16,
    borderTopRightRadius: 4,
  },
  messageTextRight: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  messageTimeRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginRight: 4,
    gap: 4,
  },
  messageTimeRight: {
    fontSize: 11,
    color: '#6e7a71',
  },
  statusCardContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bdcac0',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '80%',
  },
  statusCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1d',
    marginBottom: 4,
  },
  statusCardDesc: {
    fontSize: 12,
    color: '#3e4942',
    textAlign: 'center',
  },
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#bdcac0',
    zIndex: 20,
  },
  addButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#f3f4f5',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#191c1d',
    marginHorizontal: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#006b47',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#006b47',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffdad6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#191c1d',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 16,
    color: '#3e4942',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f5',
  },
  modalBtnCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3e4942',
  },
  modalBtnAction: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006b47',
  },
  modalBtnActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
