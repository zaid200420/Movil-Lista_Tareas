import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    const success = await login(email.trim(), password.trim());
    setIsSubmitting(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="clipboard-check" size={80} color="#6366F1" />
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>App de Tareas</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Email o usuario</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account" size={24} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Ingresa tu email o usuario"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={24} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.togglePassword}>
              <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerLink} onPress={() => router.push('/register' as any)}>
          <Text style={styles.registerLinkText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>

        <View style={styles.credentialsBox}>
          <Text style={styles.credentialsTitle}>Credenciales de prueba:</Text>
          <View style={styles.credentialItem}>
            <Text style={styles.credentialLabel}>Admin: </Text>
            <Text style={styles.credentialValue}>admin / admin123</Text>
          </View>
          <View style={styles.credentialItem}>
            <Text style={styles.credentialLabel}>Usuario: </Text>
            <Text style={styles.credentialValue}>usuario / user123</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#6366F1', fontWeight: '500' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#1F2937', marginTop: 20 },
  subtitle: { fontSize: 18, color: '#6B7280', marginTop: 5 },
  form: { paddingHorizontal: 24 },
  field: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#F9FAFB' },
  inputIcon: { paddingLeft: 16 },
  input: { flex: 1, paddingVertical: 16, paddingRight: 16, fontSize: 16, color: '#1F2937' },
  togglePassword: { paddingRight: 16 },
  loginBtn: { backgroundColor: '#6366F1', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  registerLink: { marginTop: 18, alignItems: 'center' },
  registerLinkText: { color: '#6366F1', fontSize: 15, fontWeight: '600' },
  credentialsBox: { marginTop: 40, backgroundColor: '#F3F4F6', padding: 20, borderRadius: 12 },
  credentialsTitle: { fontSize: 14, fontWeight: '700', color: '#4B5563', marginBottom: 12 },
  credentialItem: { flexDirection: 'row', marginBottom: 6 },
  credentialLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  credentialValue: { fontSize: 14, color: '#1F2937', fontWeight: '600' },
});
