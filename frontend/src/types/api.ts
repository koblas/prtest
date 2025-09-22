// API types based on OpenAPI specification

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodosResponse {
  todos: Todo[];
  total: number;
  limit: number;
  offset: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

export interface ListTodosParams {
  completed?: boolean;
  limit?: number;
  offset?: number;
}