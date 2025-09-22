import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Todo, CreateTodoRequest } from '../types/api';
import TodoService from '../services/TodoService';
import TodoItem from './TodoItem';
import AddTodoDialog from './AddTodoDialog';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        offset: (page - 1) * limit,
        limit,
        ...(filter !== 'all' && { completed: filter === 'completed' }),
      };
      
      const response = await TodoService.listTodos(params);
      setTodos(response.todos);
      setTotal(response.total);
    } catch (err) {
      setError('Failed to load todos. Please try again.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filter, limit]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (todoData: CreateTodoRequest) => {
    try {
      await TodoService.createTodo(todoData);
      // Reset to first page and refresh
      setPage(1);
      fetchTodos();
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', err);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      await TodoService.toggleTodo(todo);
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await TodoService.deleteTodo(id);
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Todo App
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            label="Filter"
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1); // Reset to first page when filter changes
            }}
          >
            <MenuItem value="all">All Todos</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body1" color="text.secondary">
          {total} total todos
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {todos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                {filter === 'all' ? 'No todos yet!' : `No ${filter} todos found.`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {filter === 'all' && 'Click the + button to add your first todo.'}
              </Typography>
            </Box>
          ) : (
            <>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, newPage) => setPage(newPage)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}

      <Fab
        color="primary"
        aria-label="add todo"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <AddTodoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddTodo}
      />
    </Container>
  );
};

export default TodoList;