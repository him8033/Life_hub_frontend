/**
 * User API Service
 * Handles all user-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["UserList", "User"],

    endpoints: (builder) => ({
        // User List
        getUserList: builder.query({
            query: (params) => ({
                url: "accounts/users/",
                method: "GET",
                params: {
                    search: params.search,
                    status: params.status,
                    role: params.role,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["UserList"],
        }),

        // User Detail
        getUserDetail: builder.query({
            query: (user_id) => ({
                url: `accounts/users/${user_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, user_id) => [
                { type: "User", id: user_id },
            ],
        }),

        // Create User
        createUser: builder.mutation({
            query: (data) => ({
                url: "accounts/users/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["UserList"],
        }),

        // Edit User
        editUser: builder.mutation({
            query: ({ user_id, data }) => ({
                url: `accounts/users/${user_id}/edit/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { user_id }) => [
                "UserList",
                { type: "User", id: user_id },
            ],
        }),

        // Update User Status
        updateUserStatus: builder.mutation({
            query: ({ user_id, data }) => ({
                url: `accounts/users/${user_id}/status/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { user_id }) => [
                "UserList",
                { type: "User", id: user_id },
            ],
        }),

        // Delete User
        deleteUser: builder.mutation({
            query: ({ user_id, data }) => ({
                url: `accounts/users/${user_id}/delete/`,
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: ["UserList"],
        }),
    }),
});

export const {
    useGetUserListQuery,
    useGetUserDetailQuery,
    useCreateUserMutation,
    useEditUserMutation,
    useUpdateUserStatusMutation,
    useDeleteUserMutation,
} = userApi;
