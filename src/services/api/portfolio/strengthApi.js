import { portfolioApi } from './index';

export const strengthEndpoints = (builder) => ({
    getStrengths: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/strengths/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "Strength", id: snapshotId },
        ],
    }),

    createStrength: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/strengths/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "Strength", id: snapshotId },
        ],
    }),

    updateStrength: builder.mutation({
        query: ({ strengthId, data }) => ({
            url: `portfoliohub/strengths/${strengthId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["Strength"],
    }),

    deleteStrength: builder.mutation({
        query: (strengthId) => ({
            url: `portfoliohub/strengths/${strengthId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["Strength"],
    }),

    reorderStrengths: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/strengths/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "Strength", id: snapshotId },
        ],
    }),
});