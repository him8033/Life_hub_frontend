import { portfolioApi } from './index';

export const educationEndpoints = (builder) => ({
    // List education for a snapshot
    getProfileEducation: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/educations/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "ProfileEducation", id: snapshotId },
        ],
    }),

    // Create education
    createProfileEducation: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/educations/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileEducation", id: snapshotId },
        ],
    }),

    // Update education
    updateProfileEducation: builder.mutation({
        query: ({ eduId, data }) => ({
            url: `portfoliohub/educations/${eduId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["ProfileEducation"],
    }),

    // Delete education
    deleteProfileEducation: builder.mutation({
        query: (eduId) => ({
            url: `portfoliohub/educations/${eduId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["ProfileEducation"],
    }),

    // Reorder education
    reorderProfileEducation: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/educations/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileEducation", id: snapshotId },
        ],
    }),
});