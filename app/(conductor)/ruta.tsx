import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { Pedido } from '../../src/types';
import QRScanner from '../../src/components/QRScanner';

export default function RutaConductor() {
  const router = useRouter();
  const { pedidos, conductorActivo, turnoActivo, isLoading } = useApp();
  const [scannerVisible, setScannerVisible] = useState(false);

  const miHojaDeRuta = useMemo(() => {
    if (!conductorActivo) return [];
    return pedidos
      .filter(p => p.conductor_id === conductorActivo.id && (p.estado === 'en_ruta' || p.estado === 'entregado' || p.estado === 'no_entregado'))
      .sort((a, b) => (a.orden_entrega || 0) - (b.orden_entrega || 0));
  }, [pedidos, conductorActivo]);

  const handleQRScan = (data: string) => {
    setScannerVisible(false);
    // Buscar pedido por ID o por Numero de Orden en MI hoja de ruta
    const pedido = miHojaDeRuta.find(p => p.id === data || p.numero_orden === data);
    
    if (pedido) {
      router.push(`/(conductor)/entrega/${pedido.id}` as any);
    } else {
      Alert.alert('No encontrado', `No se encontró ningún pedido asignado a tu ruta con el código: ${data}`);
    }
  };

  const renderItem = ({ item }: { item: Pedido }) => {
    const isEntregado = item.estado === 'entregado';
    const isFalla = item.estado === 'no_entregado';
    
    return (
      <TouchableOpacity 
        style={[styles.card, isEntregado && styles.cardDisabled]}
        onPress={() => router.push(`/(conductor)/entrega/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>{item.orden_entrega}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.clienteName}>{item.cliente}</Text>
          <Text style={styles.direccion}>{item.direccion_entrega}</Text>
          <View style={styles.detailsRow}>
            <View style={styles.tag}>
              <MaterialCommunityIcons name="package-variant" size={14} color="#64748B" />
              <Text style={styles.tagText}>{item.total_bultos} bultos</Text>
            </View>
            {item.ventana_horaria && (
              <View style={[styles.tag, styles.tagOrange]}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#C2410C" />
                <Text style={[styles.tagText, styles.tagTextOrange]}>
                  {item.ventana_horaria.inicio} - {item.ventana_horaria.fin}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statusIcon}>
          {isEntregado ? (
            <MaterialCommunityIcons name="check-circle" size={32} color="#10B981" />
          ) : isFalla ? (
            <MaterialCommunityIcons name="close-circle" size={32} color="#EF4444" />
          ) : (
            <MaterialCommunityIcons name="chevron-right" size={32} color="#CBD5E1" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.conductorName}>Hola, {conductorActivo?.nombre}</Text>
          <Text style={styles.turnoStatus}>
            Estado del Turno: <Text style={styles.statusValue}>{turnoActivo?.estado || '---'}</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.scanBtn} onPress={() => setScannerVisible(true)}>
          <MaterialCommunityIcons name="qrcode-scan" size={28} color="#FFF" />
          <Text style={styles.scanBtnText}>Escanear</Text>
        </TouchableOpacity>
      </View>

      <QRScanner 
        visible={scannerVisible} 
        onClose={() => setScannerVisible(false)} 
        onScan={handleQRScan}
        title="Validar Entrega"
      />

      <FlatList
        data={miHojaDeRuta}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="truck-remove" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No tienes entregas asignadas para hoy</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center' },
  conductorName: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  turnoStatus: { fontSize: 14, color: '#64748B', marginTop: 4 },
  statusValue: { fontWeight: 'bold', color: '#1E3A8A' },
  scanBtn: { backgroundColor: '#1E3A8A', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 64 },
  scanBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  list: { padding: 15 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 15, 
    minHeight: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center'
  },
  cardDisabled: { opacity: 0.8, backgroundColor: '#F1F5F9' },
  orderBadge: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#1E3A8A', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15
  },
  orderText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1 },
  clienteName: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  direccion: { fontSize: 15, color: '#64748B', marginTop: 4 },
  detailsRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagOrange: { backgroundColor: '#FFEDD5' },
  tagText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  tagTextOrange: { color: '#C2410C' },
  statusIcon: { marginLeft: 10 },
  empty: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#94A3B8', marginTop: 15 }
});
