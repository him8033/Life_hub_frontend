/**
 * Permission API Service
 * Handles all permission-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const permissionApi = createApi({
    reducerPath: "permissionApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["PermissionList", "Permission"],

    endpoints: (builder) => ({
        // Permission List
        getPermissionList: builder.query({
            query: (params) => ({
                url: "accounts/permissions/",
                method: "GET",
                params: {
                    search: params.search,
                    is_active: params.is_active,
                    module: params.module,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["PermissionList"],
        }),

        // Permission Detail
        getPermissionDetail: builder.query({
            query: (permission_id) => ({
                url: `accounts/permissions/${permission_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, permission_id) => [
                { type: "Permission", id: permission_id },
            ],
        }),

        // Create Permission
        createPermission: builder.mutation({
            query: (data) => ({
                url: "accounts/permissions/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PermissionList"],
        }),

        // Edit Permission
        editPermission: builder.mutation({
            query: ({ permission_id, data }) => ({
                url: `accounts/permissions/${permission_id}/edit/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { permission_id }) => [
                "PermissionList",
                { type: "Permission", id: permission_id },
            ],
        }),

        // Delete Permission
        deletePermission: builder.mutation({
            query: ({ permission_id }) => ({
                url: `accounts/permissions/${permission_id}/delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["PermissionList"],
        }),
    }),
});

export const {
    useGetPermissionListQuery,
    useGetPermissionDetailQuery,
    useCreatePermissionMutation,
    useEditPermissionMutation,
    useDeletePermissionMutation,
} = permissionApi;
