/**
 * Social Provider API Service
 * Handles all social provider-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const socialproviderApi = createApi({
    reducerPath: "socialproviderApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["SocialProviderList", "SocialProvider"],

    endpoints: (builder) => ({
        // Social Provider List
        getSocialProviderList: builder.query({
            query: (params) => ({
                url: "accounts/socialproviders/",
                method: "GET",
                params: {
                    search: params.search,
                    is_active: params.is_active,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["SocialProviderList"],
        }),

        // Social Provider Detail
        getSocialProviderDetail: builder.query({
            query: (socialprovider_id) => ({
                url: `accounts/socialproviders/${socialprovider_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, socialprovider_id) => [
                { type: "SocialProvider", id: socialprovider_id },
            ],
        }),

        // Create Social Provider
        createSocialProvider: builder.mutation({
            query: (data) => ({
                url: "accounts/socialproviders/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SocialProviderList"],
        }),

        // Edit Social Provider
        editSocialProvider: builder.mutation({
            query: ({ socialprovider_id, data }) => ({
                url: `accounts/socialproviders/${socialprovider_id}/edit/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { socialprovider_id }) => [
                "SocialProviderList",
                { type: "SocialProvider", id: socialprovider_id },
            ],
        }),

        // Delete Social Provider
        deleteSocialProvider: builder.mutation({
            query: ({ socialprovider_id }) => ({
                url: `accounts/socialproviders/${socialprovider_id}/delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["SocialProviderList"],
        }),
    }),
});

export const {
    useGetSocialProviderListQuery,
    useGetSocialProviderDetailQuery,
    useCreateSocialProviderMutation,
    useEditSocialProviderMutation,
    useDeleteSocialProviderMutation,
} = socialproviderApi;
