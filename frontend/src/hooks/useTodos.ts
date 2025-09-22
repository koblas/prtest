import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { todoApi } from "../api/todoApi";
import { CreateTodoRequest, UpdateTodoRequest } from "../types/todo";

export const useTodos = (params?: { completed?: boolean; limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ["todos", params],
    queryFn: () => todoApi.getTodos(params),
  });
};

export const useTodo = (id: string) => {
  return useQuery({
    queryKey: ["todo", id],
    queryFn: () => todoApi.getTodo(id),
    enabled: !!id,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (todo: CreateTodoRequest) => todoApi.createTodo(todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      notifications.show({
        title: "Success",
        message: "Todo created successfully!",
        color: "green",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Error",
        message:
          (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to create todo",
        color: "red",
      });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, todo }: { id: string; todo: UpdateTodoRequest }) => todoApi.updateTodo(id, todo),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", data.id] });
      notifications.show({
        title: "Success",
        message: "Todo updated successfully!",
        color: "green",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Error",
        message:
          (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update todo",
        color: "red",
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      notifications.show({
        title: "Success",
        message: "Todo deleted successfully!",
        color: "green",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Error",
        message:
          (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete todo",
        color: "red",
      });
    },
  });
};

export const useToggleCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) => todoApi.toggleCompletion(id, completed),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["todo", data.id] });
      notifications.show({
        title: "Success",
        message: `Todo marked as ${data.completed ? "completed" : "incomplete"}!`,
        color: "green",
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Error",
        message:
          (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update todo",
        color: "red",
      });
    },
  });
};
