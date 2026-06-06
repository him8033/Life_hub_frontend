import { portfolioApi } from './index';

export const languageEndpoints = (builder) => ({
    getProfileLanguages: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/languages/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "ProfileLanguage", id: snapshotId },
        ],
    }),

    createProfileLanguage: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/languages/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileLanguage", id: snapshotId },
        ],
    }),

    updateProfileLanguage: builder.mutation({
        query: ({ mappingId, data }) => ({
            url: `portfoliohub/languages/${mappingId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["ProfileLanguage"],
    }),

    deleteProfileLanguage: builder.mutation({
        query: (mappingId) => ({
            url: `portfoliohub/languages/${mappingId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["ProfileLanguage"],
    }),

    reorderProfileLanguages: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/languages/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileLanguage", id: snapshotId },
        ],
    }),
});