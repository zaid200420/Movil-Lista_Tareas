import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';

const { width } = Dimensions.get('window');

export default function SupervisorDashboard() {
  const router = useRouter();
  const { turnoActivo, autorizarSalida, cerrarTurno, conductores, pedidos } = useApp();

  const metricas = turnoActivo?.metricas || { total_pedidos: 0, entregados: 0, no_entregados: 0, con_incidencia: 0 };
  const progreso = metricas.total_pedidos > 0 ? (metricas.entregados / metricas.total_pedidos) * 100 : 0;

  const handleAutorizar = async () => {
    await autorizarSalida();
  };

  const handleCerrar = async () => {
    await cerrarTurno();
  };

  const MetricCard = ({ label, value, color, icon }: any) => (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Panel de Control</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.metricGrid}>
          <MetricCard label="Total Pedidos" value={metricas.total_pedidos} color="#1E3A8A" icon="clipboard-list" />
          <MetricCard label="Entregados" value={metricas.entregados} color="#10B981" icon="check-decagram" />
          <MetricCard label="Pendientes" value={metricas.total_pedidos - metricas.entregados - metricas.no_entregados} color="#F59E0B" icon="truck-delivery" />
          <MetricCard label="No Entregados" value={metricas.no_entregados} color="#EF4444" icon="alert-circle" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso del Turno</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progreso}%` }]} />
            </View>
            <Text style={styles.progressPct}>{progreso.toFixed(1)}% completado</Text>
          </View>
        </View>

        <View style={styles.impactBox}>
          <Text style={styles.impactTitle}>Impacto de la Digitalización (TO-BE)</Text>
          <View style={styles.impactRow}>
            <View style={styles.impactItem}>
              <Text style={styles.impactLabel}>Antes (AS-IS)</Text>
              <Text style={styles.impactValue}>~3h consolidación manual</Text>
              <Text style={styles.impactValue}>Errores frecuentes etiquetas</Text>
            </View>
            <View style={styles.impactItem}>
              <Text style={[styles.impactLabel, { color: '#10B981' }]}>Ahora (Con App)</Text>
              <Text style={styles.impactValue}>&lt;5min auto-consolidación</Text>
              <Text style={styles.impactValue}>0 errores etiquetas digitales</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          {turnoActivo?.estado === 'asignado' && (
            <TouchableOpacity style={styles.btnAutorizar} onPress={handleAutorizar}>
              <MaterialCommunityIcons name="lock-open-variant" size={24} color="#FFF" />
              <Text style={styles.btnText}>AUTORIZAR SALIDA</Text>
            </TouchableOpacity>
          )}

          {turnoActivo?.estado === 'en_ruta' && (
            <View style={styles.infoBanner}>
              <MaterialCommunityIcons name="information" size={20} color="#1E3A8A" />
              <Text style={styles.infoBannerText}>El turno está actualmente en ruta.</Text>
            </View>
          )}

          {turnoActivo && (
            <TouchableOpacity style={styles.btnCerrar} onPress={handleCerrar}>
              <MaterialCommunityIcons name="archive-check" size={24} color="#FFF" />
              <Text style={styles.btnText}>CERRAR TURNO</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.btnHistorial} onPress={() => router.push('/(supervisor)/historial' as any)}>
            <MaterialCommunityIcons name="history" size={24} color="#1E3A8A" />
            <Text style={[styles.btnText, { color: '#1E3A8A' }]}>VER HISTORIAL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 25 },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  date: { fontSize: 16, color: '#64748B' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25 },
  metricCard: { width: (width - 52) / 2, backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 2 },
  metricIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  metricValue: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  metricLabel: { fontSize: 13, color: '#64748B' },
  section: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, elevation: 2, marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  progressContainer: { alignItems: 'center' },
  progressBarBg: { width: '100%', height: 12, backgroundColor: '#E2E8F0', borderRadius: 6, marginBottom: 8 },
  progressBarFill: { height: 12, backgroundColor: '#10B981', borderRadius: 6 },
  progressPct: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  impactBox: { backgroundColor: '#1E3A8A', padding: 20, borderRadius: 16, marginBottom: 25 },
  impactTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  impactRow: { flexDirection: 'row', gap: 15 },
  impactItem: { flex: 1 },
  impactLabel: { color: '#CBD5E1', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  impactValue: { color: '#FFF', fontSize: 11, marginBottom: 4 },
  actions: { gap: 15, marginBottom: 40 },
  btnAutorizar: { backgroundColor: '#10B981', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnCerrar: { backgroundColor: '#1E3A8A', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnHistorial: { backgroundColor: '#FFF', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: '#1E3A8A' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#DBEAFE', padding: 15, borderRadius: 12 },
  infoBannerText: { color: '#1E3A8A', fontWeight: 'bold' }
});
