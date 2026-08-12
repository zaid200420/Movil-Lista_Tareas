import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, TextInput, Modal, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth, UserRole, User } from '../../src/context/AuthContext';

export default function AdminPanel() {
  const router = useRouter();
  const { getAllUsers, deleteUser, updateUserRole, registerUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', name: '', email: '', password: '', role: 'user' as UserRole });

  const refreshUsers = async () => {
    setUsers(await getAllUsers());
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleDeleteUser = (userId: string, username: string) => {
    Alert.alert(
      'Eliminar Usuario',
      `¿Estás seguro de que quieres eliminar a ${username}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await deleteUser(userId);
            await refreshUsers();
          }
        }
      ]
    );
  };

  const handleChangeRole = (userId: string, currentRole: UserRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    Alert.alert(
      'Cambiar Rol',
      `¿Cambiar el rol a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aceptar', 
          onPress: async () => {
            await updateUserRole(userId, newRole);
            await refreshUsers();
          }
        }
      ]
    );
  };

  const handleAddUser = async () => {
    if (!newUser.username.trim() || !newUser.name.trim() || !newUser.password.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    const success = await registerUser(newUser);
    if (success) {
      setIsAddModalVisible(false);
      setNewUser({ username: '', name: '', email: '', password: '', role: 'user' });
      await refreshUsers();
      Alert.alert('Éxito', 'Usuario creado correctamente');
    } else {
      Alert.alert('Error', 'El nombre de usuario ya existe');
    }
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userUsername}>@{item.username}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.roleBadge, item.role === 'admin' ? styles.adminBadge : styles.userBadge]}
          onPress={() => handleChangeRole(item.id, item.role)}
        >
          <Text style={styles.roleText}>{item.role === 'admin' ? 'Admin' : 'User'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => handleDeleteUser(item.id, item.username)}
        >
          <MaterialCommunityIcons name="trash-can" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panel de Admin</Text>
        <TouchableOpacity onPress={() => setIsAddModalVisible(true)} style={styles.addBtn}>
          <MaterialCommunityIcons name="plus" size={28} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Usuarios registrados: {users.length}</Text>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.list}
        />
      </View>

      {/* Modal para agregar usuario */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddModalVisible(false)} style={styles.modalBackBtn}>
              <MaterialCommunityIcons name="close" size={28} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nuevo Usuario</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.field}>
              <Text style={styles.label}>Usuario *</Text>
              <TextInput
                style={styles.input}
                value={newUser.username}
                onChangeText={(text) => setNewUser({ ...newUser, username: text })}
                placeholder="Nombre de usuario"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Nombre *</Text>
              <TextInput
                style={styles.input}
                value={newUser.name}
                onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                placeholder="Nombre completo"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                placeholder="correo@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                value={newUser.password}
                onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                placeholder="Contraseña"
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Rol</Text>
              <View style={styles.roleSelector}>
                <TouchableOpacity
                  style={[styles.roleOption, newUser.role === 'user' && styles.roleOptionSelected]}
                  onPress={() => setNewUser({ ...newUser, role: 'user' })}
                >
                  <Text style={[styles.roleOptionText, newUser.role === 'user' && styles.roleOptionTextSelected]}>Usuario</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleOption, newUser.role === 'admin' && styles.roleOptionSelected]}
                  onPress={() => setNewUser({ ...newUser, role: 'admin' })}
                >
                  <Text style={[styles.roleOptionText, newUser.role === 'admin' && styles.roleOptionTextSelected]}>Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAddUser}>
              <Text style={styles.saveBtnText}>Crear Usuario</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  backBtn: { padding: 5 },
  addBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  content: { padding: 20 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
  list: { gap: 12 },
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  userUsername: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  userEmail: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  userActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  adminBadge: { backgroundColor: '#FEF3C7' },
  userBadge: { backgroundColor: '#DBEAFE' },
  roleText: { fontSize: 12, fontWeight: '700', color: '#92400E' },
  deleteBtn: { padding: 8 },
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  modalBackBtn: { padding: 5 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937' },
  modalContent: { padding: 20, gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 16, fontWeight: '600', color: '#4B5563' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB'
  },
  roleSelector: { flexDirection: 'row', gap: 12 },
  roleOption: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center'
  },
  roleOptionSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF'
  },
  roleOptionText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  roleOptionTextSelected: { color: '#6366F1' },
  saveBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
