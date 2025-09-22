import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Todo } from '../types/api';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        opacity: todo.completed ? 0.7 : 1,
        backgroundColor: todo.completed ? '#f5f5f5' : 'white'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggle(todo)}
            sx={{ mt: -1 }}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {todo.title}
            </Typography>
            
            {todo.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.description}
              </Typography>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={todo.completed ? 'Completed' : 'Pending'}
                color={todo.completed ? 'success' : 'default'}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                Created: {formatDate(todo.created_at)}
              </Typography>
              {todo.updated_at !== todo.created_at && (
                <Typography variant="caption" color="text.secondary">
                  • Updated: {formatDate(todo.updated_at)}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {onEdit && (
              <IconButton 
                onClick={() => onEdit(todo)} 
                size="small"
                aria-label="Edit todo"
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton
              onClick={() => onDelete(todo.id)}
              size="small"
              color="error"
              aria-label="Delete todo"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodoItem;