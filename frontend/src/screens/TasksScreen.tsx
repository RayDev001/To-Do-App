// src/screens/TasksScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import api from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/Ionicons';

type TasksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tasks'>;

type Task = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  dueDate?: string;
  tags?: string[];
};

type Props = {
  navigation: TasksScreenNavigationProp;
  route: { params: { token: string } };
};

const TasksScreen: React.FC<Props> = ({ navigation, route }) => {
  const { token } = route.params;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Estados para los filtros
  const [searchCreatedAt, setSearchCreatedAt] = useState<string>('');
  const [searchDueDate, setSearchDueDate] = useState<string>('');
  const [searchTags, setSearchTags] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las tareas.');
    }
  };

  const fetchTasksWithFilters = async () => {
    try {
      const queryParams: string[] = [];
      if (searchCreatedAt) queryParams.push(`createdAt=${searchCreatedAt}`);
      if (searchDueDate) queryParams.push(`dueDate=${searchDueDate}`);
      if (searchTags) queryParams.push(`tags=${searchTags}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const response = await api.get(`/tasks${queryString}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron filtrar las tareas.');
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasksWithFilters();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la tarea.');
    }
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDesc}>{item.description}</Text>
      <Text style={styles.taskStatus}>{item.completed ? 'Completada' : 'Pendiente'}</Text>
      {item.createdAt && (
        <Text style={styles.taskInfo}>
          Creada: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      )}
      {item.dueDate && (
        <Text style={styles.taskInfo}>
          Vence: {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      )}
      {item.tags && item.tags.length > 0 && (
        <Text style={styles.taskInfo}>Etiquetas: {item.tags.join(', ')}</Text>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate('TaskForm', { token, task: item, refresh: fetchTasksWithFilters })
          }
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con título y botón de búsqueda */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tareas</Text>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Icon name="search" size={28} color="#6200EE" />
        </TouchableOpacity>
      </View>

      {/* Formulario de búsqueda, visible solo si showSearch es true */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Fecha de creación (YYYY-MM-DD)"
            value={searchCreatedAt}
            onChangeText={setSearchCreatedAt}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Fecha de vencimiento (YYYY-MM-DD)"
            value={searchDueDate}
            onChangeText={setSearchDueDate}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Etiquetas (separadas por coma)"
            value={searchTags}
            onChangeText={setSearchTags}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchTasksWithFilters}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón para crear nueva tarea */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('TaskForm', { token, refresh: fetchTasksWithFilters })}
      >
        <Text style={styles.createButtonText}>Crear Tarea</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  searchContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  searchButton: {
    backgroundColor: '#03DAC5',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  taskDesc: {
    fontSize: 14,
    marginVertical: 5,
  },
  taskStatus: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  taskInfo: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#03DAC5',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#B00020',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
