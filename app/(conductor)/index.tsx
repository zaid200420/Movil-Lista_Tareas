import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../src/context/AppContext';

export default function ConductorLogin() {
  const [pin, setPin] = useState('');
  const router = useRouter();
  const { loginConductor } = useApp();

  const handlePress = async (num: string) => {
    if (pin.length >= 4) return;
    
    const newPin = pin + num;
    setPin(newPin);

    if (newPin.length === 4) {
      const ok = await loginConductor(newPin);
      if (ok) {
        router.replace('/(conductor)/ruta' as any);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Error', 'PIN incorrecto');
        setPin('');
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const Key = ({ val, icon }: { val?: string, icon?: any }) => (
    <TouchableOpacity 
      style={styles.key} 
      onPress={() => val ? handlePress(val) : handleDelete()}
    >
      {icon ? (
        <MaterialCommunityIcons name={icon as any} size={32} color="#1E3A8A" />
      ) : (
        <Text style={styles.keyText}>{val}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="truck-delivery" size={64} color="#1E3A8A" />
        <Text style={styles.title}>InterAndina</Text>
        <Text style={styles.subtitle}>Ingreso de Conductor</Text>
      </View>

      <View style={styles.pinContainer}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={[styles.dot, pin.length >= i && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.keypad}>
        <View style={styles.row}>
          <Key val="1" />
          <Key val="2" />
          <Key val="3" />
        </View>
        <View style={styles.row}>
          <Key val="4" />
          <Key val="5" />
          <Key val="6" />
        </View>
        <View style={styles.row}>
          <Key val="7" />
          <Key val="8" />
          <Key val="9" />
        </View>
        <View style={styles.row}>
          <View style={[styles.key, { opacity: 0 }]} />
          <Key val="0" />
          <Key icon="backspace-outline" />
        </View>
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/' as any)}>
        <Text style={styles.backBtnText}>Volver a Selección de Rol</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '900', color: '#1E3A8A' },
  subtitle: { fontSize: 18, color: '#64748B', marginTop: 5 },
  pinContainer: { flexDirection: 'row', gap: 20, marginBottom: 50 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1' },
  dotActive: { backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' },
  keypad: { width: '80%', gap: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  key: { flex: 1, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 28, fontWeight: 'bold', color: '#1E3A8A' },
  backBtn: { marginTop: 40 },
  backBtnText: { color: '#64748B', fontSize: 16, textDecorationLine: 'underline' }
});
