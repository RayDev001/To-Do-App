// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TasksScreen from './src/screens/TasksScreen';
import TaskFormScreen from './src/screens/TaskFormScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tasks: { token: string };
  TaskForm: { token: string; task?: any; refresh: () => void };
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#6200EE' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        <Stack.Screen name="Tasks" component={TasksScreen} options={{ title: 'Tareas' }} />
        <Stack.Screen name="TaskForm" component={TaskFormScreen} options={{ title: 'Nueva Tarea' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
