/**
 * User Session API Service
 * Handles all user session-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const usersessionApi = createApi({
    reducerPath: "usersessionApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["UserSessionList", "UserSession"],

    endpoints: (builder) => ({
        // User Session List
        getUserSessionList: builder.query({
            query: (params) => ({
                url: "accounts/usersessions/",
                method: "GET",
                params: {
                    search: params.search,
                    is_active: params.is_active,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["UserSessionList"],
        }),

        // User Session Detail
        getUserSessionDetail: builder.query({
            query: (usersession_id) => ({
                url: `accounts/usersessions/${usersession_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, usersession_id) => [
                { type: "UserSession", id: usersession_id },
            ],
        }),

        // Revoke User Session
        revokeUserSession: builder.mutation({
            query: ({ usersession_id, reason }) => ({
                url: `accounts/usersessions/${usersession_id}/revoke/`,
                method: "POST",
                body: reason ? { reason } : undefined,
            }),
            invalidatesTags: (result, error, { usersession_id }) => [
                "UserSessionList",
                { type: "UserSession", id: usersession_id },
            ],
        }),
    }),
});

export const {
    useGetUserSessionListQuery,
    useGetUserSessionDetailQuery,
    useRevokeUserSessionMutation,
} = usersessionApi;
