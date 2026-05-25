import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Animated,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { saveToken, saveUser, getToken, getUser, saveLastEmail, getLastEmail, removeLastEmail } from '../services/auth';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../services/api';

type Mode = 'login' | 'register';
// Login:    step 1=email, step 2=otp
// Register: step 1=email, step 2=otp, step 3=password, step 4=phone
type Step = 1 | 2 | 3 | 4;

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [registeredUserId, setRegisteredUserId] = useState('');
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const otpRefs = useRef<TextInput[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-login check when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const checkSession = async () => {
        try {
          const token = await getToken();
          const user = await getUser();
          if (token && user) {
            router.replace('/feed');
            return;
          }
          const last = await getLastEmail();
          if (last) {
            setSavedEmail(last);
            setEmail(last);
          }
        } catch (e) {
          console.warn('Session check error', e);
        }
      };
      checkSession();
    }, [])
  );

  // Countdown for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const animateStep = (fn: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      fn();
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const switchMode = (newMode: Mode) => {
    animateStep(() => { setMode(newMode); setStep(1); setOtp(['', '', '', '', '', '']); });
  };

  const goBack = () => {
    animateStep(() => setStep((s) => Math.max(1, s - 1) as Step));
  };

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  // ── Step 1: Send email OTP ────────────────────────────────────────────────────

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/send-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setCountdown(60);
        animateStep(() => setStep(2));
      } else {
        Alert.alert('Error', data.message || 'No se pudo enviar el código');
      }
    } catch {
      Alert.alert('Error de Conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify email OTP ──────────────────────────────────────────────────

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Código incompleto', 'Ingresa los 6 dígitos del código.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        // Login: verify OTP and get JWT directly
        const res = await fetch(`${API_URL}/auth/login-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
        });
        const data = await res.json();
        if (data.accessToken) {
          await saveToken(data.accessToken);
          await saveUser(data.user);
          await saveLastEmail(email.trim().toLowerCase());
          router.replace('/feed');
        } else {
          const msg = data.message || 'Código inválido';
          Alert.alert('Error', Array.isArray(msg) ? msg.join('\n') : msg);
        }
      } else {
        // Register: verify OTP then go to password step
        const res = await fetch(`${API_URL}/auth/verify-email-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
        });
        const data = await res.json();
        if (data.verified) {
          animateStep(() => setStep(3));
        } else {
          Alert.alert('Código Inválido', 'El código es incorrecto o expiró. Inténtalo de nuevo.');
        }
      }
    } catch {
      Alert.alert('Error de Conexión', 'No se pudo verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavedEmailLogin = async () => {
    if (password.length < 6) {
      Alert.alert('Error', 'Ingresa tu contraseña válida.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: savedEmail, password }),
      });
      const data = await res.json();
      if (data.accessToken) {
        await saveToken(data.accessToken);
        await saveUser(data.user);
        router.replace('/feed');
      } else {
        Alert.alert('Error', data.message || 'Contraseña incorrecta');
      }
    } catch {
      Alert.alert('Error', 'No se pudo conectar.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    await removeLastEmail();
    setSavedEmail(null);
    setShowPasswordPrompt(false);
    setEmail('');
    setPassword('');
  };

  // ── Step 3 (register): Set password ──────────────────────────────────────────

  const handleSetPassword = async () => {
    if (!name.trim()) {
      Alert.alert('Nombre requerido', 'Por favor ingresa tu nombre completo.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña corta', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Contraseñas no coinciden', 'Las contraseñas ingresadas no son iguales.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/complete-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, name }),
      });
      const data = await res.json();
      if (data.accessToken) {
        // Save session but continue to phone step
        await saveToken(data.accessToken);
        await saveUser(data.user);
        await saveLastEmail(email.trim().toLowerCase());
        setRegisteredUserId(data.user.id);
        setShowSuccess(true);
      } else {
        const msg = data.message || 'Error al crear la cuenta';
        Alert.alert('Error', Array.isArray(msg) ? msg.join('\n') : msg);
      }
    } catch {
      Alert.alert('Error de Conexión', 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 4 (register): Phone verification via Supabase ───────────────────────

  const handleSavePhone = async () => {
    if (!phone.trim() || phone.length < 7) {
      Alert.alert('Teléfono inválido', 'Ingresa un número de teléfono válido con código de país (ej. +58 412 1234567).');
      return;
    }
    setLoading(true);
    try {
      // Save phone to user profile
      const token = await getToken();
      await fetch(`${API_URL}/auth/${registeredUserId}/phone`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      // Update local user
      const user = await getUser();
      if (user) await saveUser({ ...user, phone: phone.trim() });

      // Navigate to feed - phone OTP via Supabase will be done in KYC
      router.replace('/feed');
    } catch {
      Alert.alert('Error de Conexión', 'No se pudo guardar el teléfono.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPhone = () => {
    router.replace('/feed');
  };

  // ── OTP input handling ────────────────────────────────────────────────────────

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, '').slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────────

  const getStepTitle = () => {
    if (mode === 'login') return step === 1 ? 'Iniciar Sesión' : 'Ingresa el Código';
    const titles = ['', 'Crear Cuenta', 'Verifica tu Correo', 'Elige tu Contraseña', 'Tu Número de Teléfono'];
    return titles[step];
  };

  const getStepSubtitle = () => {
    if (mode === 'login') {
      return step === 1
        ? 'Ingresa tu correo y te enviamos un código'
        : `Código enviado a ${email}`;
    }
    const subs = [
      '',
      'Introduce tu correo para comenzar',
      `Código enviado a ${email}`,
      'Tu contraseña protege tu cuenta',
      'Para verificar tu identidad en transacciones',
    ];
    return subs[step];
  };

  const totalSteps = mode === 'login' ? 2 : 4;

  return (
    <SafeAreaView style={styles.container}>
      {savedEmail ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.savedAccountCard}>
              <View style={styles.savedAvatar}>
                <MaterialIcons name="person" size={48} color="#006b47" />
              </View>
              <Text style={styles.savedWelcome}>¡Hola de nuevo!</Text>
              
              {!showPasswordPrompt ? (
                <>
                  <TouchableOpacity 
                    style={styles.savedEmailButton} 
                    onPress={() => setShowPasswordPrompt(true)}
                  >
                    <MaterialIcons name="account-circle" size={24} color="#006b47" />
                    <Text style={styles.savedEmailTextOnly}>{savedEmail}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.switchAccountBtn} onPress={handleSwitchAccount}>
                    <Text style={styles.switchAccountText}>Iniciar sesión con otra cuenta</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.selectedEmailHeader}>
                    <TouchableOpacity onPress={() => setShowPasswordPrompt(false)} style={styles.backToAccountsBtn}>
                      <MaterialIcons name="arrow-back" size={20} color="#6e7a71" />
                    </TouchableOpacity>
                    <Text style={styles.savedEmailText}>{savedEmail}</Text>
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="Ingresa tu contraseña"
                        placeholderTextColor="#aaa"
                        secureTextEntry={secureText}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoFocus
                      />
                      <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeBtn}>
                        <MaterialIcons name={secureText ? 'visibility-off' : 'visibility'} size={24} color="#6e7a71" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled, { width: '100%' }]}
                    onPress={handleSavedEmailLogin}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#fff" /> : (
                      <View style={styles.btnRow}>
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                        <MaterialIcons name="login" size={18} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.switchAccountBtn} onPress={handleSwitchAccount}>
                    <Text style={styles.switchAccountText}>Usar otra cuenta</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <>
          {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {step > 1 && (
            <TouchableOpacity onPress={goBack} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={22} color="#006b47" />
            </TouchableOpacity>
          )}
          <MaterialIcons name="security" size={22} color="#006b47" />
          <Text style={styles.headerTitle}>TrustMarket</Text>
        </View>
        {/* Step indicators */}
        <View style={styles.stepIndicators}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[styles.stepDot, i + 1 <= step && styles.stepDotActive, i + 1 < step && styles.stepDotDone]}
            />
          ))}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {/* Mode toggle — only on step 1 */}
          {step === 1 && (
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => switchMode('login')}>
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, mode === 'register' && styles.tabActive]} onPress={() => switchMode('register')}>
                <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
          )}

          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconBg}>
                <MaterialIcons
                  name={step === 1 ? 'email' : step === 2 ? 'lock' : step === 3 ? 'vpn-key' : 'phone'}
                  size={28}
                  color="#006b47"
                />
              </View>
              <Text style={styles.title}>{getStepTitle()}</Text>
              <Text style={styles.subtitle}>{getStepSubtitle()}</Text>
            </View>

            {/* Step 1: Email */}
            {step === 1 && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Correo Electrónico</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : (
                    <View style={styles.btnRow}>
                      <Text style={styles.buttonText}>Enviar Código</Text>
                      <MaterialIcons name="send" size={18} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: OTP Input */}
            {step === 2 && (
              <View>
                <View style={styles.otpContainer}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => { if (ref) otpRefs.current[i] = ref; }}
                      style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                      value={digit}
                      onChangeText={(v) => handleOtpChange(v, i)}
                      onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.button, (loading || otp.join('').length < 6) && styles.buttonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={loading || otp.join('').length < 6}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : (
                    <View style={styles.btnRow}>
                      <Text style={styles.buttonText}>Verificar Código</Text>
                      <MaterialIcons name="check-circle" size={18} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.resendBtn, countdown > 0 && styles.resendBtnDisabled]}
                  onPress={countdown === 0 ? handleSendOtp : undefined}
                  disabled={countdown > 0}
                >
                  <Text style={styles.resendText}>
                    {countdown > 0 ? `Reenviar en ${countdown}s` : '¿No llegó? Reenviar código'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3 (register): Name + Password */}
            {step === 3 && mode === 'register' && (
              <View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nombre Completo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Juan Pérez"
                    placeholderTextColor="#aaa"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Contraseña</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor="#aaa"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={secureText}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setSecureText(!secureText)}>
                      <MaterialIcons name={secureText ? 'visibility-off' : 'visibility'} size={22} color="#3e4942" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Confirmar Contraseña</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Repite tu contraseña"
                    placeholderTextColor="#aaa"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSetPassword}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : (
                    <View style={styles.btnRow}>
                      <Text style={styles.buttonText}>Guardar Contraseña</Text>
                      <MaterialIcons name="arrow-forward" size={18} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Step 4 (register): Phone */}
            {step === 4 && mode === 'register' && (
              <View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Número de Teléfono</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+58 412 1234567"
                    placeholderTextColor="#aaa"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                  <Text style={styles.hintText}>
                    Incluye el código de país. Ej: +58 para Venezuela.
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSavePhone}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : (
                    <View style={styles.btnRow}>
                      <Text style={styles.buttonText}>Guardar y Entrar</Text>
                      <MaterialIcons name="check-circle" size={18} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipBtn} onPress={handleSkipPhone}>
                  <Text style={styles.skipText}>Omitir por ahora</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      </>
      )}

      {/* Footer */}
      <View style={styles.footerBanner}>
        <MaterialIcons name="local-police" size={24} color="#006b47" />
        <Text style={styles.footerText}>
          Tus datos están encriptados de extremo a extremo y protegidos por leyes de privacidad.
        </Text>
      </View>

      {/* Success Overlay Modal */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconWrapper}>
              <MaterialIcons name="check-circle" size={64} color="#006b47" />
            </View>
            <Text style={styles.successTitle}>¡Cuenta Creada!</Text>
            <Text style={styles.successDesc}>
              Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión con tu correo y contraseña.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccess(false);
                switchMode("login");
              }}
            >
              <Text style={styles.successButtonText}>Ir al Inicio de Sesión</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  savedAccountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  savedAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  savedWelcome: { fontSize: 24, fontWeight: 'bold', color: '#191c1d', marginBottom: 16 },
  savedEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1fae5',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  savedEmailTextOnly: { fontSize: 16, color: '#006b47', fontWeight: '600' },
  selectedEmailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
  },
  backToAccountsBtn: { marginRight: 12, padding: 4 },
  savedEmailText: { fontSize: 14, color: '#6e7a71', fontWeight: '500' },
  eyeBtn: { padding: 8 },
  switchAccountBtn: { marginTop: 24, padding: 8 },
  switchAccountText: { color: '#006b47', fontSize: 14, fontWeight: '600' },
  successOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#fff', padding: 24, borderRadius: 16, alignItems: 'center',
    width: '80%', maxWidth: 320,
  },
  successIconWrapper: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#f0fdf4',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: '#191c1d', marginBottom: 8 },
  successDesc: { fontSize: 14, color: '#6e7a71', textAlign: 'center', marginBottom: 24 },
  successButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#006b47',
    paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, gap: 8,
  },
  successButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  container: { flex: 1, backgroundColor: '#fdfdfd' },
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { padding: 4, marginRight: 4 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#006b47' },
  stepIndicators: { flexDirection: 'row', gap: 6 },
  stepDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#bdcac0',
  },
  stepDotActive: { backgroundColor: '#006b47', width: 20 },
  stepDotDone: { backgroundColor: '#71dba6', width: 8 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 24, paddingHorizontal: 16 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f3f5',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 2, elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '500', color: '#6e7a71' },
  tabTextActive: { color: '#006b47', fontWeight: '700' },
  card: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e1e3e4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  stepHeader: { alignItems: 'center', marginBottom: 28 },
  stepIconBg: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#dcfce7',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#191c1d', marginBottom: 6, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#3e4942', textAlign: 'center', lineHeight: 20 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#191c1d', marginBottom: 8 },
  input: {
    height: 52, backgroundColor: '#f3f4f5',
    borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#191c1d',
    borderWidth: 1, borderColor: 'transparent',
  },
  hintText: { fontSize: 12, color: '#6e7a71', marginTop: 6 },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f3f4f5', borderRadius: 12,
  },
  passwordInput: { flex: 1, height: 52, paddingHorizontal: 16, fontSize: 16, color: '#191c1d' },
  eyeIcon: { padding: 16 },
  button: {
    height: 54, backgroundColor: '#006b47',
    borderRadius: 14, justifyContent: 'center', alignItems: 'center',
    marginTop: 8,
    shadowColor: '#006b47', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  buttonDisabled: { backgroundColor: '#8da69d', shadowOpacity: 0 },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  otpContainer: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 10, marginBottom: 28,
  },
  otpBox: {
    width: 48, height: 58, borderRadius: 12,
    backgroundColor: '#f3f4f5', textAlign: 'center',
    fontSize: 24, fontWeight: '700', color: '#191c1d',
    borderWidth: 2, borderColor: 'transparent',
  },
  otpBoxFilled: { borderColor: '#006b47', backgroundColor: '#f0fdf4' },
  resendBtn: { marginTop: 16, alignItems: 'center', padding: 8 },
  resendBtnDisabled: { opacity: 0.5 },
  resendText: { fontSize: 13, color: '#006b47', fontWeight: '600' },
  skipBtn: { marginTop: 12, alignItems: 'center', padding: 8 },
  skipText: { fontSize: 13, color: '#6e7a71' },
  footerBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f0fdf4', paddingVertical: 12, paddingHorizontal: 16,
    borderTopWidth: 1, borderTopColor: '#d1fae5', gap: 8,
  },
  footerText: { fontSize: 12, color: '#006b47', flex: 1, lineHeight: 18 },
});
