/**
 * Social Account API Service
 * Handles all social account-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const socialaccountApi = createApi({
    reducerPath: "socialaccountApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["SocialAccountList", "SocialAccount"],

    endpoints: (builder) => ({
        // Social Account List
        getSocialAccountList: builder.query({
            query: (params) => ({
                url: "accounts/socialaccounts/",
                method: "GET",
                params: {
                    search: params.search,
                    provider: params.provider,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["SocialAccountList"],
        }),

        // Social Account Detail
        getSocialAccountDetail: builder.query({
            query: (socialaccount_id) => ({
                url: `accounts/socialaccounts/${socialaccount_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, socialaccount_id) => [
                { type: "SocialAccount", id: socialaccount_id },
            ],
        }),

        // Create Social Account
        createSocialAccount: builder.mutation({
            query: (data) => ({
                url: "accounts/socialaccounts/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SocialAccountList"],
        }),

        // Edit Social Account
        editSocialAccount: builder.mutation({
            query: ({ socialaccount_id, data }) => ({
                url: `accounts/socialaccounts/${socialaccount_id}/edit/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { socialaccount_id }) => [
                "SocialAccountList",
                { type: "SocialAccount", id: socialaccount_id },
            ],
        }),

        // Delete Social Account
        deleteSocialAccount: builder.mutation({
            query: ({ socialaccount_id, reason }) => ({
                url: `accounts/socialaccounts/${socialaccount_id}/delete/`,
                method: "DELETE",
                body: reason ? { reason } : undefined,
            }),
            invalidatesTags: ["SocialAccountList"],
        }),
    }),
});

export const {
    useGetSocialAccountListQuery,
    useGetSocialAccountDetailQuery,
    useCreateSocialAccountMutation,
    useEditSocialAccountMutation,
    useDeleteSocialAccountMutation,
} = socialaccountApi;
