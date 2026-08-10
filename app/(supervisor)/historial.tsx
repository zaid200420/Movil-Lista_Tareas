import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { Turno } from '../../src/types';

export default function HistorialTurnos() {
  const { historialTurnos } = useApp();

  const renderTurno = ({ item }: { item: Turno }) => {
    const pct = item.metricas.total_pedidos > 0 
      ? (item.metricas.entregados / item.metricas.total_pedidos) * 100 
      : 0;

    return (
      <View style={styles.turnoCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.fechaText}>{item.fecha}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>CERRADO</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Total</Text>
            <Text style={styles.metricValue}>{item.metricas.total_pedidos}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Entregados</Text>
            <Text style={[styles.metricValue, { color: '#10B981' }]}>{item.metricas.entregados}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Efectividad</Text>
            <Text style={[styles.metricValue, { color: '#1E3A8A' }]}>{pct.toFixed(0)}%</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
          <Text style={styles.timeText}>
            Inicio: {new Date(item.timestamp_inicio).toLocaleTimeString()} — Fin: {item.timestamp_cierre ? new Date(item.timestamp_cierre).toLocaleTimeString() : '---'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historialTurnos}
        keyExtractor={item => item.id}
        renderItem={renderTurno}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Últimos 7 Turnos</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="history" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No hay turnos cerrados recientemente</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  listContent: { padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 20 },
  turnoCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  fechaText: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  statusBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F1F5F9', paddingVertical: 15 },
  metricItem: { alignItems: 'center', flex: 1 },
  metricLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  timeText: { fontSize: 12, color: '#94A3B8' },
  empty: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#94A3B8', marginTop: 15 }
});
