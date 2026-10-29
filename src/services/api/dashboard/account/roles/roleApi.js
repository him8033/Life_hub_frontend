/**
 * Role API Service
 * Handles all role-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const roleApi = createApi({
    reducerPath: "roleApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["RoleList", "Role"],

    endpoints: (builder) => ({
        // Role List
        getRoleList: builder.query({
            query: (params) => ({
                url: "accounts/roles/",
                method: "GET",
                params: {
                    search: params.search,
                    is_active: params.is_active,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["RoleList"],
        }),

        // Role Detail
        getRoleDetail: builder.query({
            query: (role_id) => ({
                url: `accounts/roles/${role_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, role_id) => [
                { type: "Role", id: role_id },
            ],
        }),

        // Create Role
        createRole: builder.mutation({
            query: (data) => ({
                url: "accounts/roles/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RoleList"],
        }),

        // Edit Role
        editRole: builder.mutation({
            query: ({ role_id, data }) => ({
                url: `accounts/roles/${role_id}/edit/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { role_id }) => [
                "RoleList",
                { type: "Role", id: role_id },
            ],
        }),

        // Delete Role
        deleteRole: builder.mutation({
            query: ({ role_id }) => ({
                url: `accounts/roles/${role_id}/delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["RoleList"],
        }),
    }),
});

export const {
    useGetRoleListQuery,
    useGetRoleDetailQuery,
    useCreateRoleMutation,
    useEditRoleMutation,
    useDeleteRoleMutation,
} = roleApi;
