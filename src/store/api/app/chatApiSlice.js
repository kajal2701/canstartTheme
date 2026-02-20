import { apiSlice } from "../apiSlice";

export const chatApi = apiSlice.injectEndpoints({
  tagTypes: ["chats", "contacts"],
  endpoints: (builder) => ({
    getContacts: builder.query({
      queryFn: async (params = {}) => {
        const contacts = [
          { id: 1, fullName: "John Doe", role: "Designer", status: "online", avatar: "" },
          { id: 2, fullName: "Jane Smith", role: "Developer", status: "offline", avatar: "" },
        ].map((c) => ({
          ...c,
          chat: { id: c.id, unseenMsgs: 0, lastMessage: "Hello", lastMessageTime: new Date().toISOString() },
        }));
        return { data: { contacts } };
      },
      providesTags: ["contacts"],
    }),

    getChat: builder.query({
      queryFn: async (chatId) => {
        const contact = { id: chatId, fullName: "John Doe" };
        const chat = { id: chatId, userId: chatId, unseenMsgs: 0, chat: [] };
        return { data: { chat, contact } };
      },
      providesTags: ["chats"],
    }),
    getProfileUser: builder.query({
      queryFn: async () => {
        return { data: { id: 0, fullName: "Profile User", about: "Local profile" } };
      },
    }),
    sendMessage: builder.mutation({
      queryFn: async (message) => {
        const newMessageData = {
          message: message?.message || "",
          time: new Date(),
          senderId: 11,
        };
        return { data: { newMessageData, id: message?.contact?.id || 0 } };
      },
      invalidatesTags: ["chats", "contacts"],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useGetChatQuery,
  useSendMessageMutation,
  useGetProfileUserQuery,
} = chatApi;
