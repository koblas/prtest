import axios, { AxiosResponse } from 'axios';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodosResponse, ListTodosParams } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class TodoService {
  // List todos with optional filtering and pagination
  static async listTodos(params?: ListTodosParams): Promise<TodosResponse> {
    const response: AxiosResponse<TodosResponse> = await apiClient.get('/api/todos', {
      params,
    });
    return response.data;
  }

  // Create a new todo
  static async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    const response: AxiosResponse<Todo> = await apiClient.post('/api/todos', todo);
    return response.data;
  }

  // Get a specific todo by ID
  static async getTodo(id: string): Promise<Todo> {
    const response: AxiosResponse<Todo> = await apiClient.get(`/api/todos/${id}`);
    return response.data;
  }

  // Update a todo
  static async updateTodo(id: string, updates: UpdateTodoRequest): Promise<Todo> {
    const response: AxiosResponse<Todo> = await apiClient.put(`/api/todos/${id}`, updates);
    return response.data;
  }

  // Delete a todo
  static async deleteTodo(id: string): Promise<void> {
    await apiClient.delete(`/api/todos/${id}`);
  }

  // Toggle todo completion status
  static async toggleTodo(todo: Todo): Promise<Todo> {
    return this.updateTodo(todo.id, { completed: !todo.completed });
  }
}

export default TodoService;