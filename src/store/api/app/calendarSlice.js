import { apiSlice } from "../apiSlice";

export const calendarApi = apiSlice.injectEndpoints({
  tagTypes: ["events"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      queryFn: async () => {
        return {
          data: [
            {
              label: "Business",
              value: "business",
              activeClass: "border-indigo-500 bg-indigo-500",
              className: " group-hover:border-indigo-500",
            },
            {
              label: "Personal",
              value: "personal",
              activeClass: "border-green-500 bg-green-500",
              className: " group-hover:border-green-500",
            },
            {
              label: "Holiday",
              value: "holiday",
              activeClass: "border-red-500 bg-red-500",
              className: " group-hover:border-red-500",
            },
            {
              label: "Family",
              value: "family",
              activeClass: "border-cyan-500 bg-cyan-500",
              className: " group-hover:border-cyan-500",
            },
            {
              label: "Meeting",
              value: "meeting",
              activeClass: "border-yellow-500 bg-yellow-500",
              className: " group-hover:border-yellow-500",
            },
            {
              label: "Etc",
              value: "etc",
              activeClass: "border-cyan-500 bg-cyan-500",
              className: " group-hover:border-cyan-500",
            },
          ],
        };
      },
    }),
    getCalendarEvents: builder.query({
      queryFn: async () => {
        return { data: [] };
      },
      providesTags: ["events"],
    }),
    createCalendarEvent: builder.mutation({
      queryFn: async (event) => {
        return {
          data: {
            success: true,
            event: { id: Date.now().toString(), ...event },
          },
        };
      },
      invalidatesTags: ["events"],
    }),
    editCalendarEvent: builder.mutation({
      queryFn: async ({ id, event }) => {
        return { data: { success: true, id, event } };
      },
      invalidatesTags: ["events"],
    }),
    deleteCalendarEvent: builder.mutation({
      queryFn: async (id) => {
        return { data: { success: true, id } };
      },
      invalidatesTags: ["events"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCalendarEventsQuery,
  useCreateCalendarEventMutation,
  useEditCalendarEventMutation,
  useDeleteCalendarEventMutation,
} = calendarApi;
