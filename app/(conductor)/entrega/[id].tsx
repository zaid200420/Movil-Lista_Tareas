import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../../src/context/AppContext';
import { MotivoNoEntrega } from '../../../src/types';

const MOTIVOS: { label: string, value: MotivoNoEntrega }[] = [
  { label: 'Cliente ausente', value: 'cliente_ausente' },
  { label: 'Dirección incorrecta', value: 'direccion_incorrecta' },
  { label: 'Rechazado por cliente', value: 'rechazado_por_cliente' },
  { label: 'Fuera de hora', value: 'fuera_de_ventana_horaria' },
  { label: 'Producto dañado', value: 'producto_danado' },
  { label: 'Otro', value: 'otro' },
];

export default function DetalleEntrega() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { pedidos, conductorActivo, confirmarEntrega, reportarNoEntrega } = useApp();

  const [showIncidencia, setShowIncidencia] = useState(false);
  const [motivoSelected, setMotivoSelected] = useState<MotivoNoEntrega | null>(null);
  const [nota, setNota] = useState('');

  const pedido = pedidos.find(p => p.id === id);

  if (!pedido) return null;

  const handleConfirmar = () => {
    Alert.alert('Confirmar Entrega', '¿Has entregado todos los bultos correctamente?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, Entregado', onPress: async () => {
        if (conductorActivo) {
          await confirmarEntrega(pedido.id, conductorActivo);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        }
      }}
    ]);
  };

  const handleNoEntrega = async () => {
    if (!motivoSelected) {
      Alert.alert('Error', 'Selecciona un motivo');
      return;
    }
    if (conductorActivo) {
      await reportarNoEntrega(pedido.id, motivoSelected, nota, conductorActivo);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      router.back();
    }
  };

  const abrirMapa = async () => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(`${pedido.direccion_entrega}, ${pedido.distrito}, Lima`)}`;
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.clienteName}>{pedido.cliente}</Text>
          <Text style={styles.guiaNum}>Guía: {pedido.numero_guia_remision}</Text>
        </View>

        <TouchableOpacity style={styles.mapCard} onPress={abrirMapa}>
          <MaterialCommunityIcons name="google-maps" size={32} color="#1E3A8A" />
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.direccionText}>{pedido.direccion_entrega}</Text>
            <Text style={styles.distritoText}>{pedido.distrito}</Text>
          </View>
          <MaterialCommunityIcons name="open-in-new" size={20} color="#64748B" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ÍTEMS A ENTREGAR</Text>
          {pedido.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemCant}>
                <Text style={styles.itemCantText}>{item.cantidad}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.itemDesc}>{item.descripcion}</Text>
                <Text style={styles.itemSku}>{item.sku}</Text>
              </View>
              <Text style={styles.itemPeso}>{item.peso_total_kg} kg</Text>
            </View>
          ))}
          <View style={styles.totalsRow}>
            <Text style={styles.totalLabel}>TOTAL BULTOS: {pedido.total_bultos}</Text>
          </View>
        </View>

        {pedido.estado === 'en_ruta' && !showIncidencia && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmar}>
              <MaterialCommunityIcons name="check-circle" size={28} color="#FFF" />
              <Text style={styles.btnText}>CONFIRMAR ENTREGA</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnFail} onPress={() => setShowIncidencia(true)}>
              <MaterialCommunityIcons name="close-circle" size={28} color="#FFF" />
              <Text style={styles.btnText}>NO SE PUDO ENTREGAR</Text>
            </TouchableOpacity>
          </View>
        )}

        {showIncidencia && (
          <View style={styles.incidenciaBox}>
            <Text style={styles.incidenciaTitle}>Motivo de No Entrega</Text>
            <View style={styles.motivosGrid}>
              {MOTIVOS.map(m => (
                <TouchableOpacity 
                  key={m.value}
                  style={[styles.motivoChip, motivoSelected === m.value && styles.motivoChipActive]}
                  onPress={() => setMotivoSelected(m.value)}
                >
                  <Text style={[styles.motivoText, motivoSelected === m.value && styles.motivoTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput 
              style={styles.textArea}
              placeholder="Notas adicionales..."
              multiline
              numberOfLines={3}
              value={nota}
              onChangeText={setNota}
            />
            <View style={styles.incidenciaActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowIncidencia(false)}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSend} onPress={handleNoEntrega}>
                <Text style={styles.btnSendText}>Reportar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  clienteName: { fontSize: 26, fontWeight: '900', color: '#1E293B' },
  guiaNum: { fontSize: 16, color: '#64748B', marginTop: 5 },
  mapCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 16, elevation: 2, marginBottom: 25 },
  direccionText: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  distritoText: { fontSize: 16, color: '#64748B' },
  section: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 1, marginBottom: 15 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemCant: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  itemCantText: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A' },
  itemDesc: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  itemSku: { fontSize: 14, color: '#64748B' },
  itemPeso: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  totalsRow: { marginTop: 15, alignItems: 'flex-end' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#1E3A8A' },
  actions: { marginTop: 30, gap: 15 },
  btnConfirm: { backgroundColor: '#16A34A', height: 74, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  btnFail: { backgroundColor: '#DC2626', height: 74, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  btnText: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  incidenciaBox: { marginTop: 20, backgroundColor: '#FFF', borderRadius: 16, padding: 20, elevation: 4 },
  incidenciaTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  motivosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  motivoChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  motivoChipActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  motivoText: { fontSize: 14, color: '#64748B' },
  motivoTextActive: { color: '#FFF', fontWeight: 'bold' },
  textArea: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 15, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  incidenciaActions: { flexDirection: 'row', gap: 10 },
  btnCancel: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', backgroundColor: '#F1F5F9' },
  btnCancelText: { color: '#64748B', fontWeight: 'bold' },
  btnSend: { flex: 2, padding: 15, borderRadius: 12, alignItems: 'center', backgroundColor: '#DC2626' },
  btnSendText: { color: '#FFF', fontWeight: 'bold' }
});
