import { portfolioApi } from './index';

export const experienceEndpoints = (builder) => ({
    getProfileExperience: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/experiences/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "ProfileExperience", id: snapshotId },
        ],
    }),

    createProfileExperience: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/experiences/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileExperience", id: snapshotId },
        ],
    }),

    updateProfileExperience: builder.mutation({
        query: ({ expId, data }) => ({
            url: `portfoliohub/experiences/${expId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["ProfileExperience"],
    }),

    deleteProfileExperience: builder.mutation({
        query: (expId) => ({
            url: `portfoliohub/experiences/${expId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["ProfileExperience"],
    }),

    reorderProfileExperience: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/experiences/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileExperience", id: snapshotId },
        ],
    }),
});