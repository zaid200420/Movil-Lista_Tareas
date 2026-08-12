import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodo } from '../../src/context/TodoContext';

interface Collaborator {
  id: string;
  name: string;
  email?: string;
}

const PRIORITIES = ['Alta', 'Media', 'Baja'] as const;

export default function EditTodo() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const todoContext = useTodo();

  // Mapeos con fallbacks seguros para evitar "Cannot read property 'length' of undefined"
  const todos = Array.isArray(todoContext?.todos) ? todoContext.todos : [];
  const categories = Array.isArray((todoContext as any)?.categories) && (todoContext as any).categories.length > 0
    ? (todoContext as any).categories
    : ['General', 'Urgente', 'Soporte'];
  const collaborators = Array.isArray((todoContext as any)?.collaborators)
    ? (todoContext as any).collaborators
    : [];
  const updateTodo = todoContext?.updateTodo;
  const isLoading = todoContext?.isLoading || false;

  const currentTodo = todos.find(t => t.id === id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('Media');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('General');

  // Cargar datos de la tarea a editar
  useEffect(() => {
    if (currentTodo) {
      setTitle(currentTodo.title || '');
      setDescription(currentTodo.description || '');
      setResponsible(currentTodo.responsible || '');
      
      // Formatear prioridad
      const p = currentTodo.priority ? currentTodo.priority.toString().toLowerCase() : '';
      if (p === 'alta') setPriority('Alta');
      else if (p === 'baja') setPriority('Baja');
      else setPriority('Media');

      setDeadline(currentTodo.deadline || '');
      setCategory(currentTodo.category || categories[0] || 'General');
    }
  }, [currentTodo]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Campo requerido', 'Por favor escribe un título para la tarea');
      return;
    }

    if (!id || !updateTodo) {
      Alert.alert('Error', 'No se pudo identificar la tarea o la función de actualización.');
      return;
    }

    try {
      await updateTodo(id, {
        title: title.trim(),
        description: description.trim(),
        responsible: responsible.trim() || 'Sin responsable',
        priority: priority.toLowerCase() as any,
        deadline: deadline.trim(),
        category,
        synced: false,
      });
      router.back();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      Alert.alert('Error', 'Ocurrió un problema al guardar los cambios.');
    }
  };

  if (!currentTodo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>No se encontró la tarea seleccionada.</Text>
          <TouchableOpacity style={styles.backBtnError} onPress={() => router.back()}>
            <Text style={styles.backBtnErrorText}>Volver</Text>
          </TouchableOpacity>
        </View>
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
            placeholder="Título de la tarea"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción (opcional)"
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
              {(collaborators as Collaborator[]).slice(0, 3).map((collaborator: Collaborator) => (
                <TouchableOpacity
                  key={collaborator.id}
                  style={[styles.chip, responsible === collaborator.name && styles.chipSelected]}
                  onPress={() => setResponsible(collaborator.name)}
                >
                  <Text style={[styles.chipText, responsible === collaborator.name && styles.chipTextSelected]}>
                    {collaborator.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.chipRow}>
            {PRIORITIES.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, priority === option && styles.chipSelected]}
                onPress={() => setPriority(option)}
              >
                <Text style={[styles.chipText, priority === option && styles.chipTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.chipRowLarge}>
            {categories.map((option: string) => (
              <TouchableOpacity
                key={option}
                style={[styles.categoryChip, category === option && styles.categoryChipSelected]}
                onPress={() => setCategory(option)}
              >
                <Text style={[styles.categoryText, category === option && styles.categoryTextSelected]}>
                  {option}
                </Text>
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

        <TouchableOpacity 
          style={[styles.createBtn, isLoading && { opacity: 0.7 }]} 
          onPress={handleUpdate} 
          disabled={isLoading}
        >
          <Text style={styles.createBtnText}>{isLoading ? 'Guardando...' : 'Guardar cambios'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
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
  createBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  backBtnError: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnErrorText: {
    color: '#FFF',
    fontWeight: '600',
  },
});