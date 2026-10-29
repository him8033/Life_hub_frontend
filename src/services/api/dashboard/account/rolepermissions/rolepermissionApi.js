/**
 * Role Permission API Service
 * Handles all role permission-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const rolepermissionApi = createApi({
    reducerPath: "rolepermissionApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["RolePermissionList", "RolePermission"],

    endpoints: (builder) => ({
        // Role Permission List
        getRolePermissionList: builder.query({
            query: (params) => ({
                url: "accounts/rolepermissions/",
                method: "GET",
                params: {
                    search: params.search,
                    role: params.role,
                    permission: params.permission,
                    module: params.module,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["RolePermissionList"],
        }),

        // Role Permission Detail
        getRolePermissionDetail: builder.query({
            query: (rolepermission_id) => ({
                url: `accounts/rolepermissions/${rolepermission_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, rolepermission_id) => [
                { type: "RolePermission", id: rolepermission_id },
            ],
        }),

        // Create Role Permission
        createRolePermission: builder.mutation({
            query: (data) => ({
                url: "accounts/rolepermissions/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RolePermissionList"],
        }),

        // Delete Role Permission
        deleteRolePermission: builder.mutation({
            query: ({ rolepermission_id, reason }) => ({
                url: `accounts/rolepermissions/${rolepermission_id}/delete/`,
                method: "DELETE",
                body: reason ? { reason } : undefined,
            }),
            invalidatesTags: ["RolePermissionList"],
        }),
    }),
});

export const {
    useGetRolePermissionListQuery,
    useGetRolePermissionDetailQuery,
    useCreateRolePermissionMutation,
    useDeleteRolePermissionMutation,
} = rolepermissionApi;
