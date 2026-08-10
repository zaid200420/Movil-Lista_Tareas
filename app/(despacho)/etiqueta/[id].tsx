import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../../src/context/AppContext';

export default function EtiquetaDigital() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { pedidos, camiones, conductores, turnoActivo } = useApp();

  const pedido = pedidos.find(p => p.id === id);
  const camion = camiones.find(c => c.id === pedido?.camion_id);
  const conductor = conductores.find(c => c.id === pedido?.conductor_id);

  const turnoPedidos = useMemo(() => {
    if (!turnoActivo) return [];
    return pedidos.filter(p => turnoActivo.pedidos_ids.includes(p.id));
  }, [turnoActivo, pedidos]);

  const currentIndex = turnoPedidos.findIndex(p => p.id === id);

  if (!pedido) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.etiquetaContainer}>
          <View style={styles.header}>
            <Text style={styles.logoText}>INTERANDINA JGBL</Text>
            <View style={styles.zonaBadge}>
              <Text style={styles.zonaText}>{pedido.zona}</Text>
            </View>
          </View>

          <View style={styles.mainInfo}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>N° ORDEN</Text>
                <Text style={styles.valueLarge}>{pedido.numero_orden}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>N° GUÍA</Text>
                <Text style={styles.valueLarge}>{pedido.numero_guia_remision}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoBlock}>
              <Text style={styles.label}>CLIENTE</Text>
              <Text style={styles.valueMain}>{pedido.cliente}</Text>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>DIRECCIÓN</Text>
              <Text style={styles.value}>{pedido.direccion_entrega}</Text>
              <Text style={styles.value}>{pedido.distrito}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>BULTOS</Text>
                <Text style={styles.valueHighlight}>{pedido.total_bultos}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>PESO TOTAL</Text>
                <Text style={styles.valueHighlight}>{pedido.peso_total_kg} kg</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoBlock}>
              <Text style={styles.label}>CONDUCTOR / PLACA</Text>
              <Text style={styles.value}>{conductor?.nombre || 'No asignado'}</Text>
              <Text style={styles.valueBold}>{camion?.placa || '---'}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>FECHA DESPACHO</Text>
                <Text style={styles.value}>{pedido.fecha_despacho}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>VENTANA</Text>
                <Text style={styles.value}>
                  {pedido.ventana_horaria ? `${pedido.ventana_horaria.inicio} - ${pedido.ventana_horaria.fin}` : 'Libre'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>LogistiApp — Gestión Digital de Etiquetas</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.guiaBtn}
          onPress={() => router.push(`/(despacho)/guia/${pedido.id}` as any)}
        >
          <MaterialCommunityIcons name="file-document-outline" size={24} color="#FFF" />
          <Text style={styles.guiaBtnText}>Ver Guía de Remisión</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIndex <= 0 && styles.navBtnDisabled]}
          disabled={currentIndex <= 0}
          onPress={() => router.replace(`/(despacho)/etiqueta/${turnoPedidos[currentIndex - 1].id}` as any)}
        >
          <MaterialCommunityIcons name="chevron-left" size={32} color={currentIndex <= 0 ? "#CBD5E1" : "#1E3A8A"} />
          <Text style={[styles.navText, currentIndex <= 0 && styles.navTextDisabled]}>Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.navCount}>{currentIndex + 1} / {turnoPedidos.length}</Text>

        <TouchableOpacity 
          style={[styles.navBtn, currentIndex >= turnoPedidos.length - 1 && styles.navBtnDisabled]}
          disabled={currentIndex >= turnoPedidos.length - 1}
          onPress={() => router.replace(`/(despacho)/etiqueta/${turnoPedidos[currentIndex + 1].id}` as any)}
        >
          <Text style={[styles.navText, currentIndex >= turnoPedidos.length - 1 && styles.navTextDisabled]}>Siguiente</Text>
          <MaterialCommunityIcons name="chevron-right" size={32} color={currentIndex >= turnoPedidos.length - 1 ? "#CBD5E1" : "#1E3A8A"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  etiquetaContainer: { backgroundColor: '#FFF', borderRadius: 16, borderLeftWidth: 12, borderLeftColor: '#1E3A8A', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  logoText: { fontSize: 18, fontWeight: '900', color: '#1E3A8A', letterSpacing: 1 },
  zonaBadge: { backgroundColor: '#1E3A8A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  zonaText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  mainInfo: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  col: { flex: 1 },
  label: { fontSize: 10, color: '#64748B', fontWeight: 'bold', marginBottom: 4 },
  valueLarge: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  valueMain: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  valueHighlight: { fontSize: 24, fontWeight: '800', color: '#1E3A8A' },
  valueBold: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  value: { fontSize: 15, color: '#334155' },
  infoBlock: { marginBottom: 15 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  footer: { backgroundColor: '#F8FAFC', padding: 15, alignItems: 'center', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  footerText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic' },
  guiaBtn: { backgroundColor: '#1E3A8A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 12, marginTop: 20 },
  guiaBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  navBtnDisabled: { opacity: 0.5 },
  navText: { fontSize: 16, fontWeight: 'bold', color: '#1E3A8A' },
  navTextDisabled: { color: '#CBD5E1' },
  navCount: { fontSize: 16, fontWeight: 'bold', color: '#64748B' }
});
