import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTodo } from '../../src/context/TodoContext';

export default function EditTodo() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { todos, updateTodo, categories, collaborators, isLoading } = useTodo();
  const todo = todos.find(t => t.id === id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('General');
  const [status, setStatus] = useState<'pendiente' | 'en_progreso' | 'completada'>('pendiente');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setResponsible(todo.responsible);
      setPriority(todo.priority);
      setDeadline(todo.deadline);
      setCategory(todo.category);
      setStatus(todo.status);
    }
  }, [todo]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor escribe un título para la tarea');
      return;
    }

    await updateTodo(id as string, {
      title: title.trim(),
      description: description.trim(),
      responsible: responsible.trim(),
      priority,
      deadline: deadline.trim(),
      category,
      status,
    });
    router.back();
  };

  if (!todo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Tarea no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnInline}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar tarea</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Escribe el título de la tarea"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Escribe una descripción (opcional)"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Responsable</Text>
          <TextInput
            style={styles.input}
            value={responsible}
            onChangeText={setResponsible}
            placeholder="Nombre del responsable"
            placeholderTextColor="#9CA3AF"
          />
          {collaborators.length > 0 && (
            <View style={styles.chipRow}>
              {collaborators.slice(0, 3).map(collaborator => (
                <TouchableOpacity
                  key={collaborator.id}
                  style={[styles.chip, responsible === collaborator.name && styles.chipSelected]}
                  onPress={() => setResponsible(collaborator.name)}
                >
                  <Text style={[styles.chipText, responsible === collaborator.name && styles.chipTextSelected]}>{collaborator.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.chipRow}>
            {['Alta', 'Media', 'Baja'].map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, priority === option && styles.chipSelected]}
                onPress={() => setPriority(option as 'Alta' | 'Media' | 'Baja')}
              >
                <Text style={[styles.chipText, priority === option && styles.chipTextSelected]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.chipRowLarge}>
            {categories.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.categoryChip, category === option && styles.categoryChipSelected]}
                onPress={() => setCategory(option)}
              >
                <Text style={[styles.categoryText, category === option && styles.categoryTextSelected]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Estado</Text>
          <View style={styles.chipRow}>
            {['pendiente', 'en_progreso', 'completada'].map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, status === option && styles.chipSelected]}
                onPress={() => setStatus(option as 'pendiente' | 'en_progreso' | 'completada')}
              >
                <Text style={[styles.chipText, status === option && styles.chipTextSelected]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Fecha límite</Text>
          <TextInput
            style={styles.input}
            value={deadline}
            onChangeText={setDeadline}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={isLoading}>
          <Text style={styles.saveBtnText}>{isLoading ? 'Cargando...' : 'Guardar cambios'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  errorText: { fontSize: 18, color: '#EF4444', textAlign: 'center', marginTop: 50 },
  backBtnInline: { alignItems: 'center', marginTop: 20 },
  backBtnText: { fontSize: 16, fontWeight: '600', color: '#6366F1' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  content: { padding: 20, gap: 25 },
  field: { gap: 8 },
  label: { fontSize: 16, fontWeight: '500', color: '#4B5563' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  textArea: { minHeight: 140, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chipRowLarge: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  chipSelected: {
    backgroundColor: '#6366F1',
  },
  chipText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#FFF',
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  categoryChipSelected: {
    backgroundColor: '#E0E7FF',
    borderColor: '#6366F1',
  },
  categoryText: {
    color: '#374151',
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#1D4ED8',
  },
  saveBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
