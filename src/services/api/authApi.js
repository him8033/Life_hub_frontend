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

        changeUserPassword: builder.mutation({
            query: (payload) => ({ url: "auth/change-password/", method: "POST", body: payload }),
        }),

        sendPasswordResetEmail: builder.mutation({
            query: (payload) => ({ url: "auth/send-reset-password-email/", method: "POST", body: payload }),
        }),

        resetPassword: builder.mutation({
            query: ({ data, id, token }) => ({ url: `auth/reset-password/${id}/${token}/`, method: "POST", body: data }),
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
    useChangeUserPasswordMutation,
    useSendPasswordResetEmailMutation,
    useResetPasswordMutation,

    // Me
    useGetMeQuery,

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
