import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { ZonaLima, Pedido, Camion } from '../../src/types';

export default function AsignarRutas() {
  const router = useRouter();
  const { pedidos, camiones, conductores, asignarPedidosACamion, generarTurno } = useApp();
  
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [camionSeleccionado, setCamionSeleccionado] = useState<string | null>(null);

  const hoy = new Date().toISOString().slice(0, 10);
  const pedidosPendientes = useMemo(() => 
    pedidos.filter(p => p.fecha_despacho === hoy && p.estado === 'pendiente'),
    [pedidos, hoy]
  );

  const pedidosAgrupados = useMemo(() => {
    const grupos: Record<string, Pedido[]> = {};
    pedidosPendientes.forEach(p => {
      if (!grupos[p.zona]) grupos[p.zona] = [];
      grupos[p.zona].push(p);
    });
    return grupos;
  }, [pedidosPendientes]);

  const togglePedido = (id: string) => {
    setSeleccionados(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleAsignar = async () => {
    if (seleccionados.length === 0 || !camionSeleccionado) {
      Alert.alert('Atención', 'Seleccione pedidos y un camión.');
      return;
    }

    const camion = camiones.find(c => c.id === camionSeleccionado)!;
    const conductor = conductores.find(c => c.camion_id === camion.id);

    if (!conductor) {
      Alert.alert('Error', 'No hay un conductor asignado a este camión.');
      return;
    }

    const result = await asignarPedidosACamion(seleccionados, camion.id, conductor.id);
    if (result.ok) {
      setSeleccionados([]);
      setCamionSeleccionado(null);
    } else {
      Alert.alert('Error', result.error || 'No se pudo asignar.');
    }
  };

  const handleGenerarTurno = async () => {
    if (pedidosPendientes.length > 0) {
      Alert.alert('Confirmación', 'Aún hay pedidos sin asignar. ¿Desea generar el turno de todas formas?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Generar', onPress: async () => {
          await generarTurno();
          router.replace('/(despacho)/' as any);
        }}
      ]);
    } else {
      await generarTurno();
      router.replace('/(despacho)/' as any);
    }
  };

  const renderCamion = (camion: Camion) => {
    const pedidosCamion = pedidos.filter(p => p.camion_id === camion.id && p.fecha_despacho === hoy);
    const peso = pedidosCamion.reduce((acc, p) => acc + p.peso_total_kg, 0);
    const bultos = pedidosCamion.reduce((acc, p) => acc + p.total_bultos, 0);
    
    const pctPeso = (peso / camion.capacidad_maxima_kg) * 100;
    const pctBultos = (bultos / camion.capacidad_maxima_bultos) * 100;
    const maxPct = Math.max(pctPeso, pctBultos);

    const barColor = maxPct > 95 ? '#EF4444' : maxPct > 80 ? '#F59E0B' : '#10B981';

    return (
      <TouchableOpacity 
        key={camion.id}
        style={[styles.camionCard, camionSeleccionado === camion.id && styles.camionCardActive]}
        onPress={() => setCamionSeleccionado(camion.id)}
      >
        <View style={styles.camionHeader}>
          <Text style={styles.placaText}>{camion.placa}</Text>
          <Text style={styles.marcaText}>{camion.marca}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min(maxPct, 100)}%`, backgroundColor: barColor }]} />
        </View>
        <Text style={styles.capacidadText}>{maxPct.toFixed(1)}% de capacidad</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Pedidos por Zona</Text>
        {Object.entries(pedidosAgrupados).map(([zona, lista]) => (
          <View key={zona} style={styles.zonaGroup}>
            <Text style={styles.zonaHeader}>{zona}</Text>
            {lista.map(p => (
              <TouchableOpacity 
                key={p.id} 
                style={[styles.pedidoRow, seleccionados.includes(p.id) && styles.pedidoRowActive]}
                onPress={() => togglePedido(p.id)}
              >
                <MaterialCommunityIcons 
                  name={seleccionados.includes(p.id) ? "checkbox-marked" : "checkbox-blank-outline"} 
                  size={24} 
                  color={seleccionados.includes(p.id) ? "#1E3A8A" : "#64748B"} 
                />
                <View style={styles.pedidoInfo}>
                  <Text style={styles.pedidoCliente}>{p.cliente}</Text>
                  <Text style={styles.pedidoDetalle}>{p.distrito} • {p.total_bultos} bultos • {p.peso_total_kg}kg</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Estado de Camiones</Text>
        <View style={styles.camionesGrid}>
          {camiones.map(renderCamion)}
        </View>
      </ScrollView>

      <View style={styles.actionPanel}>
        {seleccionados.length > 0 && (
          <TouchableOpacity style={styles.asignarBtn} onPress={handleAsignar}>
            <Text style={styles.asignarBtnText}>Asignar {seleccionados.length} pedidos</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.generarBtn, pedidosPendientes.length > 0 && styles.generarBtnOutline]} 
          onPress={handleGenerarTurno}
        >
          <Text style={[styles.generarBtnText, pedidosPendientes.length > 0 && styles.generarBtnTextOutline]}>
            GENERAR TURNO
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  zonaGroup: { backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 15, elevation: 1 },
  zonaHeader: { fontSize: 14, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 10, textTransform: 'uppercase' },
  pedidoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  pedidoRowActive: { backgroundColor: '#EFF6FF' },
  pedidoInfo: { marginLeft: 12, flex: 1 },
  pedidoCliente: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  pedidoDetalle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  camionesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  camionCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 12, padding: 12, elevation: 2, borderWidth: 2, borderColor: 'transparent' },
  camionCardActive: { borderColor: '#1E3A8A' },
  camionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  placaText: { fontWeight: 'bold', color: '#1E293B' },
  marcaText: { fontSize: 11, color: '#64748B' },
  progressBarBg: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 6 },
  progressBarFill: { height: 8, borderRadius: 4 },
  capacidadText: { fontSize: 11, color: '#64748B', textAlign: 'right' },
  actionPanel: { backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderColor: '#E2E8F0' },
  asignarBtn: { backgroundColor: '#1E3A8A', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  asignarBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  generarBtn: { backgroundColor: '#10B981', padding: 15, borderRadius: 12, alignItems: 'center' },
  generarBtnOutline: { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#10B981' },
  generarBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  generarBtnTextOutline: { color: '#10B981' }
});
