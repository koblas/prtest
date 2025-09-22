import axios from "axios";
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoListResponse } from "../types/todo";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const todoApi = {
  // Get all todos with optional filtering and pagination
  getTodos: async (params?: { completed?: boolean; limit?: number; offset?: number }): Promise<TodoListResponse> => {
    const response = await api.get("/todos", { params });
    return response.data;
  },

  // Get a single todo by ID
  getTodo: async (id: string): Promise<Todo> => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },

  // Create a new todo
  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post("/todos", todo);
    return response.data;
  },

  // Update a todo
  updateTodo: async (id: string, todo: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  // Toggle todo completion status
  toggleCompletion: async (id: string, completed: boolean): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}/complete`, { completed });
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default todoApi;


