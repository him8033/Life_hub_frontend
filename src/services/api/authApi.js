import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["User", "Profile", "SocialLinks"],

    endpoints: (builder) => ({
        // ========================= AUTH =========================
        registerUser: builder.mutation({
            query: (payload) => ({ url: "auth/register/", method: "POST", body: payload }),
        }),

        loginUser: builder.mutation({
            query: (payload) => ({ url: "auth/login/", method: "POST", body: payload }),
        }),

        verifyOTP: builder.mutation({
            query: (payload) => ({ url: "auth/verify-otp/", method: "POST", body: payload }),
        }),

        resendOTP: builder.mutation({
            query: (payload) => ({ url: "auth/resend-otp/", method: "POST", body: payload }),
        }),

        changeUserPassword: builder.mutation({
            query: (payload) => ({ url: "auth/change-password/", method: "POST", body: payload }),
        }),

        forgotPassword: builder.mutation({
            query: (payload) => ({ url: "auth/forgot-password/", method: "POST", body: payload }),
        }),

        resetPassword: builder.mutation({
            query: (payload) => ({ url: "auth/reset-password/", method: "POST", body: payload }),
        }),

        logout: builder.mutation({
            query: () => ({ url: "auth/logout/", method: "POST" }),
        }),

        logoutAll: builder.mutation({
            query: () => ({ url: "auth/logout-all/", method: "POST" }),
        }),

        refreshToken: builder.mutation({
            query: (payload) => ({ url: "auth/token/refresh/", method: "POST", body: payload }),
        }),

        // ========================= CURRENT USER (MAIN SOURCE) =========================

        getMe: builder.query({
            query: () => ({
                url: "me/",
                method: "GET",
            }),
            providesTags: ["User", "Profile", "SocialLinks"],
            refetchOnMountOrArgChange: true,
        }),

        getAuthMe: builder.query({
            query: () => ({
                url: "auth/me/",
                method: "GET",
            }),
            providesTags: ["User"],
            refetchOnMountOrArgChange: true,
        }),

        // ========================= PROFILE UPDATE =========================

        updateProfile: builder.mutation({
            query: (data) => ({
                url: "profile/",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User", "Profile"],
        }),

        // ========================= PROFILE IMAGE =========================

        uploadProfileImage: builder.mutation({
            query: (formData) => ({
                url: "profile/image/",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Profile"],
        }),

        deleteProfileImage: builder.mutation({
            query: () => ({
                url: "profile/image/delete/",
                method: "DELETE",
            }),
            invalidatesTags: ["Profile"],
        }),

        // ========================= SOCIAL LINKS =========================

        getSocialLinks: builder.query({
            query: () => ({
                url: "profile/social-links/",
                method: "GET",
            }),
            providesTags: ["SocialLinks"],
        }),

        createSocialLink: builder.mutation({
            query: (data) => ({
                url: "profile/social-links/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["SocialLinks"],
        }),

        updateSocialLink: builder.mutation({
            query: ({ usersociallink_id, data }) => ({
                url: `profile/social-links/${usersociallink_id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["SocialLinks"],
        }),

        setPrimarySocialLink: builder.mutation({
            query: (usersociallink_id) => ({
                url: `profile/social-links/${usersociallink_id}/set-primary/`,
                method: "PATCH",
            }),
            invalidatesTags: ["SocialLinks"],
        }),

        reorderSocialLinks: builder.mutation({
            query: (data) => ({
                url: "profile/social-links/reorder/",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["SocialLinks"],
        }),

        deleteSocialLink: builder.mutation({
            query: (usersociallink_id) => ({
                url: `profile/social-links/${usersociallink_id}/delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["SocialLinks"],
        }),
    }),
});

export const {
    // Auth
    useRegisterUserMutation,
    useLoginUserMutation,
    useVerifyOTPMutation,
    useResendOTPMutation,
    useChangeUserPasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useLogoutAllMutation,
    useRefreshTokenMutation,

    // Me
    useGetMeQuery,
    useGetAuthMeQuery,

    // Profile
    useUpdateProfileMutation,
    useUploadProfileImageMutation,
    useDeleteProfileImageMutation,

    // Social
    useGetSocialLinksQuery,
    useCreateSocialLinkMutation,
    useUpdateSocialLinkMutation,
    useSetPrimarySocialLinkMutation,
    useReorderSocialLinksMutation,
    useDeleteSocialLinkMutation,

} = authApi;
