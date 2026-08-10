import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useApp } from '../../../src/context/AppContext';

export default function GuiaRemision() {
  const { id } = useLocalSearchParams();
  const { pedidos, camiones, conductores } = useApp();

  const pedido = pedidos.find(p => p.id === id);
  const camion = camiones.find(c => c.id === pedido?.camion_id);
  const conductor = conductores.find(c => c.id === pedido?.conductor_id);

  if (!pedido) return null;

  const abrirMapa = async () => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(`${pedido.direccion_entrega}, ${pedido.distrito}, Lima`)}`;
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.guiaPaper}>
          <View style={styles.header}>
            <View style={styles.remitente}>
              <Text style={styles.empresaName}>INTERANDINA JGBL S.A.C.</Text>
              <Text style={styles.ruc}>RUC: 20601234567</Text>
              <Text style={styles.empresaDetalle}>Av. El Sol 1234, Villa El Salvador</Text>
              <Text style={styles.empresaDetalle}>Lima, Perú</Text>
            </View>
            <View style={styles.guiaNumBox}>
              <Text style={styles.guiaLabel}>GUÍA DE REMISIÓN REMITENTE</Text>
              <Text style={styles.guiaNumero}>{pedido.numero_guia_remision}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DATOS DEL TRASLADO</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>FECHA DE EMISIÓN</Text>
                <Text style={styles.value}>{pedido.fecha_despacho}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>MOTIVO TRASLADO</Text>
                <Text style={styles.value}>Venta</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PUNTO DE LLEGADA</Text>
            <Text style={styles.label}>DESTINATARIO</Text>
            <Text style={styles.valueBold}>{pedido.cliente}</Text>
            <Text style={styles.label}>DIRECCIÓN</Text>
            <Text style={styles.value}>{pedido.direccion_entrega}</Text>
            <Text style={styles.value}>{pedido.distrito}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DATOS DEL TRANSPORTE</Text>
            <View style={styles.row}>
              <View style={[styles.col, { flex: 2 }]}>
                <Text style={styles.label}>CONDUCTOR</Text>
                <Text style={styles.value}>{conductor?.nombre || '---'}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>PLACA</Text>
                <Text style={styles.valueBold}>{camion?.placa || '---'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>SKU</Text>
              <Text style={[styles.tableHeaderText, { flex: 3 }]}>DESCRIPCIÓN</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>CANT.</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>PESO</Text>
            </View>
            {pedido.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.sku}</Text>
                <Text style={[styles.tableCell, { flex: 3 }]}>{item.descripcion}</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.cantidad}</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>{item.peso_total_kg} kg</Text>
              </View>
            ))}
          </View>

          <View style={styles.totales}>
            <Text style={styles.totalText}>Total Bultos: {pedido.total_bultos}</Text>
            <Text style={styles.totalText}>Peso Total: {pedido.peso_total_kg} kg</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.mapBtn} onPress={abrirMapa}>
          <MaterialCommunityIcons name="google-maps" size={24} color="#FFF" />
          <Text style={styles.mapBtnText}>VER EN MAPA</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#64748B' },
  scrollContent: { padding: 15 },
  guiaPaper: { backgroundColor: '#FFF', padding: 20, borderRadius: 4, elevation: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  remitente: { flex: 1 },
  empresaName: { fontSize: 16, fontWeight: '900', color: '#000' },
  ruc: { fontSize: 13, fontWeight: 'bold', marginVertical: 4 },
  empresaDetalle: { fontSize: 11, color: '#444' },
  guiaNumBox: { borderWidth: 2, borderColor: '#000', padding: 10, alignItems: 'center', width: 140 },
  guiaLabel: { fontSize: 10, textAlign: 'center', fontWeight: 'bold' },
  guiaNumero: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  section: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', backgroundColor: '#F0F0F0', padding: 4, marginBottom: 8 },
  row: { flexDirection: 'row' },
  col: { flex: 1 },
  label: { fontSize: 10, color: '#666', marginTop: 5 },
  value: { fontSize: 13, color: '#000' },
  valueBold: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  table: { marginTop: 10, borderWidth: 1, borderColor: '#000' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#000', padding: 8 },
  tableHeaderText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tableCell: { fontSize: 11, color: '#000' },
  totales: { alignItems: 'flex-end', marginTop: 15 },
  totalText: { fontSize: 13, fontWeight: 'bold' },
  mapBtn: { backgroundColor: '#1E3A8A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 12, marginTop: 20 },
  mapBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
