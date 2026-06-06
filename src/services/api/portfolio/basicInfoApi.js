import { portfolioApi } from './index';

export const basicInfoEndpoints = (builder) => ({
    // Get basic info for a snapshot
    getBasicInfo: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/basic-info/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "BasicInfo", id: snapshotId },
        ],
    }),

    // Create/Update basic info (UPSERT)
    saveBasicInfo: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/basic-info/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "BasicInfo", id: snapshotId },
        ],
    }),
});