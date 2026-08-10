import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { ZonaLima, Pedido } from '../../src/types';
import QRScanner from '../../src/components/QRScanner';

const ZONAS: (ZonaLima | 'Todos')[] = [
  'Todos', 'Lima Norte', 'Lima Sur', 'Lima Centro', 'Lima Este', 'Lima Oeste', 'Callao'
];

export default function BandejaPedidos() {
  const router = useRouter();
  const { pedidos, turnoActivo } = useApp();
  const [zonaFiltro, setZonaFiltro] = useState<ZonaLima | 'Todos'>('Todos');
  const [scannerVisible, setScannerVisible] = useState(false);

  const hoy = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });

  const pedidosFiltrados = useMemo(() => {
    let p = pedidos.filter(p => p.fecha_despacho === new Date().toISOString().slice(0, 10));
    if (zonaFiltro !== 'Todos') {
      p = p.filter(pedido => pedido.zona === zonaFiltro);
    }
    return p;
  }, [pedidos, zonaFiltro]);

  const handleQRScan = (data: string) => {
    setScannerVisible(false);
    // Buscar pedido por ID o por Numero de Orden
    const pedido = pedidos.find(p => p.id === data || p.numero_orden === data);
    
    if (pedido) {
      router.push(`/(despacho)/etiqueta/${pedido.id}` as any);
    } else {
      Alert.alert('No encontrado', `No se encontró ningún pedido con el código: ${data}`);
    }
  };

  const resumen = useMemo(() => {
    const total = pedidosFiltrados.length;
    const asignados = pedidosFiltrados.filter(p => p.estado !== 'pendiente').length;
    return { total, asignados };
  }, [pedidosFiltrados]);

  const renderPedido = ({ item }: { item: Pedido }) => (
    <TouchableOpacity 
      style={styles.pedidoCard}
      onPress={() => router.push(`/(despacho)/etiqueta/${item.id}` as any)}
    >
      <View style={styles.pedidoHeader}>
        <Text style={styles.numeroOrden}>{item.numero_orden}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.estado) }]}>
          <Text style={styles.badgeText}>{item.estado.replace('_', ' ')}</Text>
        </View>
      </View>
      <Text style={styles.clienteText}>{item.cliente}</Text>
      <View style={styles.pedidoFooter}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#64748B" />
          <Text style={styles.infoText}>{item.distrito}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="package-variant" size={16} color="#64748B" />
          <Text style={styles.infoText}>{item.total_bultos} bultos</Text>
        </View>
        <View style={[styles.zonaBadge, { backgroundColor: getZonaColor(item.zona) }]}>
          <Text style={styles.zonaBadgeText}>{item.zona}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{hoy}</Text>
          <Text style={styles.statusLabel}>
            Estado Turno: <Text style={styles.statusValue}>{turnoActivo?.estado || 'Sin iniciar'}</Text>
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.scanBtn} onPress={() => setScannerVisible(true)}>
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#1E3A8A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(despacho)/cargar-pedido' as any)}>
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <QRScanner 
        visible={scannerVisible} 
        onClose={() => setScannerVisible(false)} 
        onScan={handleQRScan}
        title="Buscar Pedido"
      />

      <View style={styles.resumenBar}>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenCount}>{resumen.total}</Text>
          <Text style={styles.resumenLabel}>Pedidos</Text>
        </View>
        <View style={styles.resumenItem}>
          <Text style={styles.resumenCount}>{resumen.asignados}</Text>
          <Text style={styles.resumenLabel}>Asignados</Text>
        </View>
      </View>

      <View style={styles.filtrosContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={ZONAS}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.chip, zonaFiltro === item && styles.chipActive]}
              onPress={() => setZonaFiltro(item)}
            >
              <Text style={[styles.chipText, zonaFiltro === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chipsContent}
        />
      </View>

      <FlatList
        data={pedidosFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderPedido}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No hay pedidos para esta zona hoy</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(despacho)/asignar-rutas' as any)}
      >
        <MaterialCommunityIcons name="truck-delivery" size={24} color="#FFF" />
        <Text style={styles.fabText}>Asignar Rutas</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const getStatusColor = (estado: string) => {
  switch (estado) {
    case 'pendiente': return '#94A3B8';
    case 'asignado': return '#3B82F6';
    case 'en_ruta': return '#F59E0B';
    case 'entregado': return '#10B981';
    default: return '#EF4444';
  }
};

const getZonaColor = (zona: ZonaLima) => {
  switch (zona) {
    case 'Lima Norte': return '#DBEAFE';
    case 'Lima Sur': return '#DCFCE7';
    case 'Lima Centro': return '#FEF3C7';
    case 'Lima Este': return '#F3E8FF';
    case 'Lima Oeste': return '#E0F2FE';
    case 'Callao': return '#FEE2E2';
    default: return '#F1F5F9';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#FFF' 
  },
  dateText: { fontSize: 14, color: '#64748B', textTransform: 'capitalize' },
  statusLabel: { fontSize: 16, color: '#1E293B', marginTop: 4 },
  statusValue: { fontWeight: 'bold', color: '#1E3A8A' },
  headerActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  scanBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1E3A8A', justifyContent: 'center', alignItems: 'center' },
  resumenBar: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 15, borderTopWidth: 1, borderColor: '#F1F5F9' },
  resumenItem: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderColor: '#F1F5F9' },
  resumenCount: { fontSize: 20, fontWeight: 'bold', color: '#1E3A8A' },
  resumenLabel: { fontSize: 12, color: '#64748B' },
  filtrosContainer: { backgroundColor: '#FFF', paddingBottom: 10 },
  chipsContent: { paddingHorizontal: 15 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#1E3A8A', borderColor: '#1E3A8A' },
  chipText: { color: '#64748B', fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  listContent: { padding: 15, paddingBottom: 100 },
  pedidoCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  numeroOrden: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  clienteText: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  pedidoFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: 13, color: '#64748B' },
  zonaBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 'auto' },
  zonaBadgeText: { fontSize: 11, fontWeight: '600', color: '#1E3A8A' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', marginTop: 10, fontSize: 16 },
  fab: { position: 'absolute', bottom: 30, right: 20, left: 20, height: 56, backgroundColor: '#1E3A8A', borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  fabText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
