import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../services/api';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    try {
      // Intentar procesar la data del QR
      // La data esperada es un JSON con transactionId
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        Alert.alert('Código Inválido', 'Este código QR no pertenece a SecureMarket.');
        return;
      }

      if (parsedData && parsedData.transactionId) {
        Alert.alert(
          'Entrega Confirmada',
          `Se ha escaneado el código exitosamente. Liberando fondos para la transacción: ${parsedData.transactionId}`,
          [
            { 
              text: 'OK', 
              onPress: async () => {
                // Aquí se llamaría al backend para release
                await fetch(`${API_URL}/wallet/release`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: 'user_123', amount: 50 }) // Mock data
                });
                router.push('/wallet');
              }
            }
          ]
        );
      } else {
        Alert.alert('Código Inválido', 'El código QR no contiene información válida de entrega.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema validando el código.');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/chat')} style={styles.backButton}>
          <MaterialIcons name="close" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear Código QR</Text>
      </View>

      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={styles.camera}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.instructions}>Apunta la cámara al código QR del comprador para liberar los fondos.</Text>
        </View>
      </CameraView>
      
      {scanned && (
        <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
          <Text style={styles.rescanText}>Volver a escanear</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 100, // accommodate safe area
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#191c1d',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#006b47',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  instructions: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 32,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#006b47',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  rescanText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
