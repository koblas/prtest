import React from "react";
import { useForm } from "@mantine/form";
import { Card, TextInput, Textarea, Button, Group, Stack, Title } from "@mantine/core";
import { Todo } from "../types/todo";
import { useCreateTodo, useUpdateTodo } from "../hooks/useTodos";

interface TodoFormProps {
  todo?: Todo;
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  description: string;
}

export const TodoForm: React.FC<TodoFormProps> = ({ todo, onCancel, onSuccess }) => {
  const isEditing = !!todo;
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const form = useForm({
    initialValues: {
      title: todo?.title || "",
      description: todo?.description || "",
    },
    validate: {
      title: (value) => {
        if (!value) return "Title is required";
        if (value.length < 1) return "Title must be at least 1 character";
        if (value.length > 255) return "Title must be less than 255 characters";
        return null;
      },
      description: (value) => {
        if (value && value.length > 1000) return "Description must be less than 1000 characters";
        return null;
      },
    },
  });

  const handleSubmit = async (values: FormData) => {
    try {
      if (isEditing && todo) {
        await updateTodo.mutateAsync({
          id: todo.id,
          todo: values,
        });
      } else {
        await createTodo.mutateAsync(values);
      }
      form.reset();
      onSuccess();
    } catch {
      // Error handling is done in the hooks
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2} mb="md">
        {isEditing ? "Edit Todo" : "Add New Todo"}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput label="Title" placeholder="Enter todo title..." required {...form.getInputProps("title")} />

          <Textarea
            label="Description"
            placeholder="Enter todo description (optional)..."
            rows={3}
            {...form.getInputProps("description")}
          />

          <Group gap="sm" mt="md">
            <Button type="submit" loading={createTodo.isPending || updateTodo.isPending} variant="filled">
              {isEditing ? "Update Todo" : "Add Todo"}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={createTodo.isPending || updateTodo.isPending}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};
