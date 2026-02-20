import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      queryFn: async (user) => {
        const token = "local-token";
        const safeUser = {
          email: user?.email || "",
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
        };
        return { data: { token, user: safeUser } };
      },
    }),
    login: builder.mutation({
      queryFn: async (data) => {
        const { email, password } = data || {};
        if (!email || !password) {
          return { error: { status: 400, message: "Invalid credentials" } };
        }
        const token = "local-token";
        const user = { email };
        return { data: { token, user } };
      },
    }),
  }),
});
export const { useRegisterUserMutation, useLoginMutation } = authApi;
