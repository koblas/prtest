export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodoListResponse {
  todos: Todo[];
  total: number;
  limit: number;
  offset: number;
}

export interface ToggleCompletionRequest {
  completed: boolean;
}

export interface ApiError {
  message: string;
  code: string;
}

