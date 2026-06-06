import { portfolioApi } from './index';

export const hobbyEndpoints = (builder) => ({
    getHobbies: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/hobbies/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "Hobby", id: snapshotId },
        ],
    }),

    createHobby: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/hobbies/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "Hobby", id: snapshotId },
        ],
    }),

    updateHobby: builder.mutation({
        query: ({ hobbyId, data }) => ({
            url: `portfoliohub/hobbies/${hobbyId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["Hobby"],
    }),

    deleteHobby: builder.mutation({
        query: (hobbyId) => ({
            url: `portfoliohub/hobbies/${hobbyId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["Hobby"],
    }),

    reorderHobbies: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/hobbies/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "Hobby", id: snapshotId },
        ],
    }),
});