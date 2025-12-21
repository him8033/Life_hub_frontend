import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenService } from "../auth/token.service";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/user/`,
        prepareHeaders: (headers) => {
            const { access } = tokenService.get();
            if (access) headers.set("authorization", `Bearer ${access}`);
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
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
