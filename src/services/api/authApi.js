import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (payload) => ({ url: "register/", method: "POST", body: payload }),
        }),
        loginUser: builder.mutation({
            query: (payload) => ({ url: "login/", method: "POST", body: payload }),
        }),
        getLoggedUser: builder.query({
            query: () => ({ url: "profile/" }),
        }),
        changeUserPassword: builder.mutation({
            query: (payload) => ({ url: "changepassword/", method: "POST", body: payload }),
        }),
        sendPasswordResetEmail: builder.mutation({
            query: (payload) => ({ url: "send-reset-password-email/", method: "POST", body: payload }),
        }),
        resetPassword: builder.mutation({
            query: ({ data, id, token }) => ({ url: `reset-password/${id}/${token}/`, method: "POST", body: data }),
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetLoggedUserQuery,
    useChangeUserPasswordMutation,
    useSendPasswordResetEmailMutation,
    useResetPasswordMutation,
} = authApi;
