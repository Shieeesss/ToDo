import { fetchTodos, deleteTodo, updateTodo } from "../lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTodos = (filter: string, sortBy: string, searchQuery: string) => {
  const queryClient = useQueryClient();

  const { data: todos, isPending } = useQuery({
    queryKey: ["todos", filter, sortBy, searchQuery],
    queryFn: async () => {
      const fetchedTodos = await fetchTodos();
      return fetchedTodos.map((todo: any) => ({
        ...todo,
        deadline: isNaN(new Date(todo.deadline).getTime()) ? new Date().toISOString().split('T')[0] : new Date(todo.deadline).toISOString().split('T')[0],
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: { title?: string; description?: string; is_completed?: boolean; deadline: string, date: string } }) =>
      updateTodo(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return { todos, isPending, deleteMutation, updateMutation };
};


