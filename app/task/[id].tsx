import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTodo } from '../../src/context/TodoContext';

export default function TaskDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { todos } = useTodo();
  const task = todos.find(item => item.id === id);

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se encontró la tarea.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtnIcon}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de tarea</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.meta}>{task.responsible} · {task.priority} · {task.status}</Text>
          <Text style={styles.description}>{task.description || 'Sin descripción'}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha límite</Text>
            <Text style={styles.infoValue}>{task.deadline || 'No definida'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoría</Text>
            <Text style={styles.infoValue}>{task.category}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Creada</Text>
            <Text style={styles.infoValue}>{new Date(task.createdAt).toLocaleString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Última actualización</Text>
            <Text style={styles.infoValue}>{new Date(task.updatedAt).toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20, gap: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtnIcon: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 10 },
  meta: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  description: { fontSize: 16, color: '#374151', lineHeight: 24, marginBottom: 18 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: '#EF4444', marginBottom: 20 },
  backBtn: { backgroundColor: '#6366F1', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  backBtnText: { color: '#FFF', fontWeight: '700' },
});
