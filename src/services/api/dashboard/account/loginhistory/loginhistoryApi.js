/**
 * Login History API Service
 * Handles all login history-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const loginhistoryApi = createApi({
    reducerPath: "loginhistoryApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["LoginHistoryList", "LoginHistory"],

    endpoints: (builder) => ({
        // Login History List
        getLoginHistoryList: builder.query({
            query: (params) => ({
                url: "accounts/loginhistory/",
                method: "GET",
                params: {
                    search: params.search,
                    success: params.success,
                    login_method: params.login_method,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["LoginHistoryList"],
        }),

        // Login History Detail
        getLoginHistoryDetail: builder.query({
            query: (loginhistory_id) => ({
                url: `accounts/loginhistory/${loginhistory_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, loginhistory_id) => [
                { type: "LoginHistory", id: loginhistory_id },
            ],
        }),
    }),
});

export const {
    useGetLoginHistoryListQuery,
    useGetLoginHistoryDetailQuery,
} = loginhistoryApi;
