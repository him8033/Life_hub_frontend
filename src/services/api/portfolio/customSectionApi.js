import { portfolioApi } from './index';

export const customSectionEndpoints = (builder) => ({
    getProfileCustomSections: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/custom-sections/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "ProfileCustomSection", id: snapshotId },
        ],
    }),

    createProfileCustomSection: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/custom-sections/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileCustomSection", id: snapshotId },
        ],
    }),

    updateProfileCustomSection: builder.mutation({
        query: ({ sectionId, data }) => ({
            url: `portfoliohub/custom-sections/${sectionId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["ProfileCustomSection"],
    }),

    deleteProfileCustomSection: builder.mutation({
        query: (sectionId) => ({
            url: `portfoliohub/custom-sections/${sectionId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["ProfileCustomSection"],
    }),

    reorderProfileCustomSections: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/custom-sections/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileCustomSection", id: snapshotId },
        ],
    }),
});