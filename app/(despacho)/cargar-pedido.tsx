import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { clasificarZona } from '../../src/utils/clasificarZona';
import { ZonaLima, ItemPedido } from '../../src/types';

const DISTRITOS = [
  'Ancón', 'Ate', 'Barranco', 'Bellavista', 'Breña', 'Callao', 'Carabayllo', 'Carmen de la Legua', 
  'Chaclacayo', 'Chorrillos', 'Cieneguilla', 'Comas', 'El Agustino', 'Independencia', 'Jesús María', 
  'La Molina', 'La Perla', 'La Punta', 'La Victoria', 'Lince', 'Los Olivos', 'Lurigancho-Chosica', 
  'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacamac', 'Pueblo Libre', 'Puente Piedra', 
  'Rímac', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 
  'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santiago de Surco', 
  'Surquillo', 'Ventanilla', 'Villa El Salvador', 'Villa María del Triunfo'
];

export default function CargarPedido() {
  const router = useRouter();
  const { crearPedido, pedidos } = useApp();

  const [form, setForm] = useState({
    numero_orden: '',
    cliente: '',
    direccion_entrega: '',
    distrito: '',
    ventana_horaria: { inicio: '08:00', fin: '18:00' },
    requiere_conformidad: false,
  });

  const [items, setItems] = useState<ItemPedido[]>([]);
  const [zonaCalculada, setZonaCalculada] = useState<ZonaLima>('Sin clasificar');

  useEffect(() => {
    setZonaCalculada(clasificarZona(form.distrito));
  }, [form.distrito]);

  const totalPeso = items.reduce((acc, item) => acc + item.peso_total_kg, 0);
  const totalBultos = items.reduce((acc, item) => acc + item.cantidad, 0);

  const addItem = () => {
    const newItem: ItemPedido = {
      id: Math.random().toString(36).substr(2, 9),
      sku: '',
      descripcion: '',
      cantidad: 1,
      peso_unitario_kg: 0,
      peso_total_kg: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof ItemPedido, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'cantidad' || field === 'peso_unitario_kg') {
          updated.peso_total_kg = Number(updated.cantidad) * Number(updated.peso_unitario_kg);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleSave = async () => {
    if (!form.numero_orden || !form.cliente || !form.distrito || items.length === 0) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios y agregue al menos un ítem.');
      return;
    }

    if (pedidos.some(p => p.numero_orden === form.numero_orden)) {
      Alert.alert('Error', 'El número de orden ya existe.');
      return;
    }

    try {
      await crearPedido({
        ...form,
        items,
        total_bultos: totalBultos,
        peso_total_kg: totalPeso,
        fecha_despacho: new Date().toISOString().slice(0, 10),
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el pedido.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Pedido</Text>
        <TextInput 
          style={styles.input} 
          placeholder="N° Orden (Ej: ORD-123)" 
          value={form.numero_orden}
          onChangeText={text => setForm({...form, numero_orden: text})}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Cliente / Razón Social" 
          value={form.cliente}
          onChangeText={text => setForm({...form, cliente: text})}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Dirección de Entrega" 
          value={form.direccion_entrega}
          onChangeText={text => setForm({...form, direccion_entrega: text})}
        />
        
        <Text style={styles.label}>Distrito</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.distritosScroll}>
          {DISTRITOS.map(d => (
            <TouchableOpacity 
              key={d} 
              style={[styles.distritoChip, form.distrito === d && styles.distritoChipActive]}
              onPress={() => setForm({...form, distrito: d})}
            >
              <Text style={[styles.distritoText, form.distrito === d && styles.distritoTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.zonaFeedback}>
          <Text style={styles.zonaLabel}>Zona Detectada:</Text>
          <View style={styles.zonaChip}>
            <Text style={styles.zonaText}>{zonaCalculada}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ítems del Pedido</Text>
          <TouchableOpacity style={styles.addBtn} onPress={addItem}>
            <MaterialCommunityIcons name="plus-circle" size={24} color="#1E3A8A" />
            <Text style={styles.addBtnText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <TextInput 
              style={[styles.input, { flex: 2, marginBottom: 5 }]} 
              placeholder="SKU" 
              value={item.sku}
              onChangeText={val => updateItem(item.id, 'sku', val)}
            />
            <View style={styles.itemInputs}>
              <TextInput 
                style={[styles.input, { flex: 1 }]} 
                placeholder="Cant" 
                keyboardType="numeric"
                value={item.cantidad.toString()}
                onChangeText={val => updateItem(item.id, 'cantidad', val)}
              />
              <TextInput 
                style={[styles.input, { flex: 1, marginHorizontal: 5 }]} 
                placeholder="Peso U. (kg)" 
                keyboardType="numeric"
                value={item.peso_unitario_kg.toString()}
                onChangeText={val => updateItem(item.id, 'peso_unitario_kg', val)}
              />
              <View style={styles.pesoTotalBox}>
                <Text style={styles.pesoTotalText}>{item.peso_total_kg.toFixed(1)} kg</Text>
              </View>
              <TouchableOpacity onPress={() => setItems(items.filter(i => i.id !== item.id))}>
                <MaterialCommunityIcons name="delete" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.totalsBox}>
          <Text style={styles.totalText}>Total Bultos: {totalBultos}</Text>
          <Text style={styles.totalText}>Total Peso: {totalPeso.toFixed(1)} kg</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Guardar Pedido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20 },
  section: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  label: { fontSize: 14, color: '#64748B', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, color: '#1E293B' },
  distritosScroll: { marginBottom: 15 },
  distritoChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8 },
  distritoChipActive: { backgroundColor: '#1E3A8A' },
  distritoText: { color: '#64748B' },
  distritoTextActive: { color: '#FFF', fontWeight: 'bold' },
  zonaFeedback: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  zonaLabel: { fontSize: 14, color: '#64748B' },
  zonaChip: { backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  zonaText: { color: '#1E3A8A', fontWeight: 'bold' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  addBtnText: { color: '#1E3A8A', fontWeight: 'bold' },
  itemRow: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10, marginBottom: 10 },
  itemInputs: { flexDirection: 'row', alignItems: 'center' },
  pesoTotalBox: { width: 80, alignItems: 'center' },
  pesoTotalText: { fontWeight: 'bold', color: '#1E3A8A' },
  totalsBox: { marginTop: 15, paddingTop: 15, borderTopWidth: 2, borderTopColor: '#F1F5F9', alignItems: 'flex-end' },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  saveBtn: { backgroundColor: '#1E3A8A', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
