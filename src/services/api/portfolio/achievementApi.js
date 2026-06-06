import { portfolioApi } from './index';

export const achievementEndpoints = (builder) => ({
    getAchievements: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/achievements/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "Achievement", id: snapshotId },
        ],
    }),

    createAchievement: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/achievements/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "Achievement", id: snapshotId },
        ],
    }),

    updateAchievement: builder.mutation({
        query: ({ achievementId, data }) => ({
            url: `portfoliohub/achievements/${achievementId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["Achievement"],
    }),

    deleteAchievement: builder.mutation({
        query: (achievementId) => ({
            url: `portfoliohub/achievements/${achievementId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["Achievement"],
    }),

    reorderAchievements: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/achievements/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "Achievement", id: snapshotId },
        ],
    }),
});