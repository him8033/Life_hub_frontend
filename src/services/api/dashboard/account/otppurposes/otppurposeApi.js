/**
 * OTP Purpose API Service
 * Handles all OTP purpose-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const otppurposeApi = createApi({
    reducerPath: "otppurposeApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["OTPPurposeList", "OTPPurpose"],

    endpoints: (builder) => ({
        // OTP Purpose List
        getOTPPurposeList: builder.query({
            query: (params) => ({
                url: "accounts/otppurposes/",
                method: "GET",
                params: {
                    search: params.search,
                    is_active: params.is_active,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["OTPPurposeList"],
        }),

        // OTP Purpose Detail
        getOTPPurposeDetail: builder.query({
            query: (otppurpose_id) => ({
                url: `accounts/otppurposes/${otppurpose_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, otppurpose_id) => [
                { type: "OTPPurpose", id: otppurpose_id },
            ],
        }),

        // Create OTP Purpose
        createOTPPurpose: builder.mutation({
            query: (data) => ({
                url: "accounts/otppurposes/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["OTPPurposeList"],
        }),

        // Edit OTP Purpose
        editOTPPurpose: builder.mutation({
            query: ({ otppurpose_id, data }) => ({
                url: `accounts/otppurposes/${otppurpose_id}/edit/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { otppurpose_id }) => [
                "OTPPurposeList",
                { type: "OTPPurpose", id: otppurpose_id },
            ],
        }),

        // Delete OTP Purpose
        deleteOTPPurpose: builder.mutation({
            query: ({ otppurpose_id }) => ({
                url: `accounts/otppurposes/${otppurpose_id}/delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["OTPPurposeList"],
        }),
    }),
});

export const {
    useGetOTPPurposeListQuery,
    useGetOTPPurposeDetailQuery,
    useCreateOTPPurposeMutation,
    useEditOTPPurposeMutation,
    useDeleteOTPPurposeMutation,
} = otppurposeApi;
