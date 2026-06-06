import { portfolioApi } from './index';

export const socialLinkEndpoints = (builder) => ({
    // List social links for a snapshot
    getProfileSocialLinks: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/social-links/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "ProfileSocialLink", id: snapshotId },
        ],
    }),

    // Create social link for snapshot
    createProfileSocialLink: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/social-links/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileSocialLink", id: snapshotId },
        ],
    }),

    // Update social link
    updateProfileSocialLink: builder.mutation({
        query: ({ linkId, data }) => ({
            url: `portfoliohub/social-links/${linkId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["ProfileSocialLink"],
    }),

    // Delete social link
    deleteProfileSocialLink: builder.mutation({
        query: (linkId) => ({
            url: `portfoliohub/social-links/${linkId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["ProfileSocialLink"],
    }),

    // Reorder social links
    reorderProfileSocialLinks: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/social-links/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileSocialLink", id: snapshotId },
        ],
    }),
});