/**
 * Status API Service
 * Handles all status-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const statusApi = createApi({
    reducerPath: "statusApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["StatusList", "Status"],

    endpoints: (builder) => ({
        // Status List
        getStatusList: builder.query({
            query: (params) => ({
                url: "accounts/statuses/",
                method: "GET",
                params: {
                    search: params.search,
                    is_active: params.is_active,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["StatusList"],
        }),

        // Status Detail
        getStatusDetail: builder.query({
            query: (userstatus_id) => ({
                url: `accounts/statuses/${userstatus_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, userstatus_id) => [
                { type: "Status", id: userstatus_id },
            ],
        }),

        // Create Status
        createStatus: builder.mutation({
            query: (data) => ({
                url: "accounts/statuses/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["StatusList"],
        }),

        // Edit Status
        editStatus: builder.mutation({
            query: ({ userstatus_id, data }) => ({
                url: `accounts/statuses/${userstatus_id}/edit/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { userstatus_id }) => [
                "StatusList",
                { type: "Status", id: userstatus_id },
            ],
        }),

        // Delete Status
        deleteStatus: builder.mutation({
            query: ({ userstatus_id }) => ({
                url: `accounts/statuses/${userstatus_id}/delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["StatusList"],
        }),
    }),
});

export const {
    useGetStatusListQuery,
    useGetStatusDetailQuery,
    useCreateStatusMutation,
    useEditStatusMutation,
    useDeleteStatusMutation,
} = statusApi;
