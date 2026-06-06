import { portfolioApi } from './index';

export const skillEndpoints = (builder) => ({
    getProfileSkills: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/skills/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "ProfileSkill", id: snapshotId },
        ],
    }),

    createProfileSkill: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/skills/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileSkill", id: snapshotId },
        ],
    }),

    updateProfileSkill: builder.mutation({
        query: ({ skillId, data }) => ({
            url: `portfoliohub/skills/${skillId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["ProfileSkill"],
    }),

    deleteProfileSkill: builder.mutation({
        query: (skillId) => ({
            url: `portfoliohub/skills/${skillId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["ProfileSkill"],
    }),

    reorderProfileSkills: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/skills/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileSkill", id: snapshotId },
        ],
    }),
});