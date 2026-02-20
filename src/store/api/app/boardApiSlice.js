import { apiSlice } from "../apiSlice";

export const boardApi = apiSlice.injectEndpoints({
  tagTypes: ["boards"],
  endpoints: (builder) => ({
    getBoards: builder.query({
      queryFn: async () => {
        const boards = [
          { id: "b1", title: "Backlog", tasks: [{ id: "t1", title: "Sample task" }] },
          { id: "b2", title: "In Progress", tasks: [{ id: "t2", title: "Implement UI" }] },
          { id: "b3", title: "Done", tasks: [{ id: "t3", title: "Set up project" }] },
        ];
        return { data: boards };
      },
      providesTags: ["boards"],
    }),
    createBoard: builder.mutation({
      queryFn: async (board) => {
        return { data: { success: true, board: { id: Date.now().toString(), ...board } } };
      },
      invalidatesTags: ["boards"],
    }),
    editBoard: builder.mutation({
      queryFn: async ({ boardId, board }) => {
        return { data: { success: true, boardId, board } };
      },
      invalidatesTags: ["boards"],
    }),
    createTask: builder.mutation({
      queryFn: async ({ boardId, ...task }) => {
        return { data: { success: true, boardId, task: { id: Date.now().toString(), ...task } } };
      },
      invalidatesTags: ["boards"],
    }),
    editTask: builder.mutation({
      queryFn: async ({ boardId, taskId, task }) => {
        return { data: { success: true, boardId, taskId, task } };
      },
      invalidatesTags: ["boards"],
    }),
    deleteBoard: builder.mutation({
      queryFn: async (id) => {
        return { data: { success: true, id } };
      },
      invalidatesTags: ["boards"],
    }),
    deleteTask: builder.mutation({
      queryFn: async ({ boardId, taskId }) => {
        return { data: { success: true, boardId, taskId } };
      },
      invalidatesTags: ["boards"],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useCreateBoardMutation,
  useCreateTaskMutation,
  useDeleteBoardMutation,
  useDeleteTaskMutation,
  useEditBoardMutation,
  useEditTaskMutation,
} = boardApi;
