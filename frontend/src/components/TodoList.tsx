import React, { useState } from "react";
import { Title, Text, Button, Group, Stack, TextInput, SegmentedControl, Alert, Skeleton, Center } from "@mantine/core";
import { IconPlus, IconAlertCircle, IconSearch } from "@tabler/icons-react";
import { Todo } from "../types/todo";
import { useTodos } from "../hooks/useTodos";
import { TodoItem } from "./TodoItem";
import { TodoForm } from "./TodoForm";

type FilterType = "all" | "completed" | "pending";

export const TodoList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Determine API filter based on UI filter
  const apiFilter = filter === "all" ? undefined : filter === "completed";

  const { data, isLoading, error, refetch } = useTodos({
    completed: apiFilter,
    limit: 50,
  });

  const handleAddTodo = () => {
    setEditingTodo(undefined);
    setShowForm(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTodo(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(undefined);
  };

  // Filter todos by search term on the client side
  const filteredTodos =
    data?.todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase())),
    ) || [];

  if (error) {
    return (
      <Center>
        <Stack align="center" gap="md">
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light">
            Failed to load todos
          </Alert>
          <Button onClick={() => refetch()} variant="filled">
            Try Again
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <Stack gap="xs">
          <Title order={1}>My Todos</Title>
          <Text size="sm" c="dimmed">
            {isLoading ? "Loading..." : `${filteredTodos.length} todo${filteredTodos.length !== 1 ? "s" : ""}`}
          </Text>
        </Stack>
        <Button onClick={handleAddTodo} leftSection={<IconPlus size={16} />}>
          Add Todo
        </Button>
      </Group>

      {/* Filters and Search */}
      <Group gap="md" align="flex-end">
        <SegmentedControl
          value={filter}
          onChange={(value) => setFilter(value as FilterType)}
          data={[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
          ]}
        />
        <TextInput
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          style={{ flex: 1, maxWidth: 400 }}
        />
      </Group>

      {/* Todo Form */}
      {showForm && <TodoForm todo={editingTodo} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />}

      {/* Todo List */}
      {isLoading ? (
        <Stack gap="md">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={120} radius="md" />
          ))}
        </Stack>
      ) : filteredTodos.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">
              {searchTerm
                ? "No todos match your search"
                : filter === "all"
                ? "No todos yet. Create your first one!"
                : `No ${filter} todos`}
            </Text>
            {!searchTerm && filter === "all" && (
              <Button onClick={handleAddTodo} variant="filled">
                Add Your First Todo
              </Button>
            )}
          </Stack>
        </Center>
      ) : (
        <Stack gap="md">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onEdit={handleEditTodo} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
