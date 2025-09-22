import React, { useState } from "react";
import { Card, Group, Text, Checkbox, ActionIcon, Stack, Badge } from "@mantine/core";
import { IconTrash, IconEdit, IconCheck } from "@tabler/icons-react";
import { Todo } from "../types/todo";
import { useDeleteTodo, useToggleCompletion } from "../hooks/useTodos";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteTodo = useDeleteTodo();
  const toggleCompletion = useToggleCompletion();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      setIsDeleting(true);
      try {
        await deleteTodo.mutateAsync(todo.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleCompletion = async () => {
    await toggleCompletion.mutateAsync({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder opacity={isDeleting ? 0.5 : 1}>
      <Group align="flex-start" gap="md">
        <Checkbox checked={todo.completed} onChange={(event) => handleToggleCompletion()} size="md" color="green" />

        <Stack gap="xs" style={{ flex: 1 }}>
          <Text size="lg" fw={500} td={todo.completed ? "line-through" : "none"} c={todo.completed ? "dimmed" : "dark"}>
            {todo.title}
          </Text>

          {todo.description && (
            <Text size="sm" c={todo.completed ? "dimmed" : "gray"} td={todo.completed ? "line-through" : "none"}>
              {todo.description}
            </Text>
          )}

          <Group gap="xs" mt="xs">
            <Badge variant="light" size="xs" color="blue">
              Created: {new Date(todo.created_at).toLocaleDateString()}
            </Badge>
            {todo.updated_at !== todo.created_at && (
              <Badge variant="light" size="xs" color="orange">
                Updated: {new Date(todo.updated_at).toLocaleDateString()}
              </Badge>
            )}
          </Group>
        </Stack>

        <Group gap="xs">
          <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(todo)} title="Edit todo">
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={handleDelete} title="Delete todo" disabled={isDeleting}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
};
