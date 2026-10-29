/**
 * OTP API Service
 * Handles all OTP-related API calls for account management
 */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const otpApi = createApi({
    reducerPath: "otpApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["OTPList", "OTP"],

    endpoints: (builder) => ({
        // OTP List
        getOTPList: builder.query({
            query: (params) => ({
                url: "accounts/otps/",
                method: "GET",
                params: {
                    search: params.search,
                    is_used: params.is_used,
                    purpose: params.purpose,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["OTPList"],
        }),

        // OTP Detail
        getOTPDetail: builder.query({
            query: (otp_id) => ({
                url: `accounts/otps/${otp_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, otp_id) => [
                { type: "OTP", id: otp_id },
            ],
        }),
    }),
});

export const {
    useGetOTPListQuery,
    useGetOTPDetailQuery,
} = otpApi;
