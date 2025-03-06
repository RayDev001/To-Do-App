// src/screens/TaskFormScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type TaskFormScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskForm'>;

type Props = {
  navigation: TaskFormScreenNavigationProp;
  route: { params: { token: string; task?: any; refresh: () => void } };
};

const TaskFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { token, task, refresh } = route.params;
  const [title, setTitle] = useState<string>(task ? task.title : '');
  const [description, setDescription] = useState<string>(task ? task.description : '');
  const [dueDate, setDueDate] = useState<string>(task ? task.dueDate : '');
  const [tags, setTags] = useState<string>(task ? task.tags.join(',') : '');
  const [completed, setCompleted] = useState<boolean>(task ? task.completed : false);

  const handleSave = async () => {
    const taskData = {
      title,
      description,
      dueDate: dueDate || undefined,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
      completed,
    };

    try {
      if (task) {
        await api.put(`/tasks/${task._id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      refresh();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la tarea.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task ? 'Editar Tarea' : 'Crear Tarea'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de vencimiento (Formato ISO)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Etiquetas (separadas por coma)"
        value={tags}
        onChangeText={setTags}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  saveButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TaskFormScreen;
