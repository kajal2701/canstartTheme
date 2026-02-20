import { apiSlice } from "../apiSlice";

export const todoApi = apiSlice.injectEndpoints({
  tagTypes: ["todos"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      queryFn: async (params = {}) => {
        const sample = [
          { id: "1", title: "Sample task", completed: false, favorite: false },
          { id: "2", title: "Design review", completed: true, favorite: true },
        ];
        return { data: sample };
      },
      providesTags: ["todos"],
    }),
    addTodo: builder.mutation({
      queryFn: async (todo) => {
        return {
          data: { success: true, todo: { id: Date.now().toString(), ...todo } },
        };
      },
      invalidatesTags: ["todos"],
    }),
    editTodo: builder.mutation({
      queryFn: async ({ id, todo }) => {
        return { data: { success: true, id, todo } };
      },
      invalidatesTags: ["todos"],
    }),
    deleteTodo: builder.mutation({
      queryFn: async (id) => {
        return { data: { success: true, id } };
      },
      invalidatesTags: ["todos"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useEditTodoMutation,
  useDeleteTodoMutation,
} = todoApi;
