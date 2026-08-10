import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTodo } from '../../src/context/TodoContext';
import { Todo } from '../../src/types';

export default function TodoListScreen() {
  const router = useRouter();
  const { todos, isLoading, deleteTodo, toggleTodo } = useTodo();

  const renderTodo = ({ item }: { item: Todo }) => (
    <TouchableOpacity style={styles.todoCard} onPress={() => toggleTodo(item.id)}>
      <View style={styles.checkboxContainer}>
        <MaterialCommunityIcons
          name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={28}
          color={item.completed ? '#6366F1' : '#9CA3AF'}
        />
      </View>
      <View style={styles.todoContent}>
        <Text
          style={[
            styles.todoTitle,
            { color: item.completed ? '#9CA3AF' : '#1F2937' },
            item.completed && styles.todoTitleCompleted,
          ]}
        >
          {item.title}
        </Text>
        <Text style={styles.todoMeta}>{item.responsible} · {item.priority} · {item.status}</Text>
        <Text style={styles.todoDescription}>{item.description}</Text>
        <Text style={styles.todoDeadline}>Vence: {item.deadline || 'Sin fecha'}</Text>
      </View>
      <View style={styles.todoActions}>
        <TouchableOpacity onPress={() => router.push(`/edit-todo/${item.id}`)} style={styles.actionBtn}>
          <MaterialCommunityIcons name="pencil" size={20} color="#6366F1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.actionBtn}>
          <MaterialCommunityIcons name="trash-can" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Tareas</Text>
          <Text style={styles.subtitle}>{todos.length} tareas</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/create-todo')}>
          <MaterialCommunityIcons name="plus" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={renderTodo}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay tareas todavía</Text>
            <Text style={styles.emptySub}>¡Agrega una nueva tarea!</Text>
          </View>
        }
      />
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
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: { fontSize: 32, fontWeight: '800', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  addBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  list: { padding: 20, gap: 15 },
  todoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  todoContent: { flex: 1 },
  todoTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  todoTitleCompleted: { textDecorationLine: 'line-through' },
  todoMeta: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  todoDescription: { fontSize: 14, lineHeight: 20, color: '#4B5563' },
  todoDeadline: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
  todoActions: { flexDirection: 'row', gap: 15 },
  actionBtn: { padding: 5 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#6B7280' },
  emptySub: { fontSize: 14, marginTop: 5, color: '#9CA3AF' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#6366F1', fontSize: 16, fontWeight: '600' },
});
