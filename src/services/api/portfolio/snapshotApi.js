import { portfolioApi } from './index';

export const snapshotEndpoints = (builder) => ({
    createSnapshot: builder.mutation({
        query: (payload) => ({
            url: "portfoliohub/",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["Snapshot"],
    }),

    getSnapshots: builder.query({
        query: (params) => ({
            url: "portfoliohub/",
            method: "GET",
            params: {
                page: params?.page || 1,
                page_size: params?.page_size || 10,
                visibility: params?.visibility || undefined,
                is_template: params?.is_template || undefined,
                is_public: params?.is_public || undefined,
                search: params?.search || undefined,
                ordering: params?.ordering || '-created_at',
            },
        }),
        providesTags: ["Snapshot"],
    }),

    getSnapshot: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "Snapshot", id: snapshotId },
        ],
    }),

    updateSnapshot: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "Snapshot", id: snapshotId },
            "Snapshot",
        ],
    }),

    deleteSnapshot: builder.mutation({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["Snapshot"],
    }),

    duplicateSnapshot: builder.mutation({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/duplicate/`,
            method: "POST",
            body: {},
        }),
        invalidatesTags: ["Snapshot"],
    }),
});