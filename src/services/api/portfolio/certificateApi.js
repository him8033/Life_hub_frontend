import { portfolioApi } from './index';

export const certificateEndpoints = (builder) => ({
    getProfileCertificates: builder.query({
        query: (snapshotId) => ({
            url: `portfoliohub/${snapshotId}/certificates/`,
            method: "GET",
        }),
        providesTags: (result, error, snapshotId) => [
            { type: "ProfileCertificate", id: snapshotId },
        ],
    }),

    createProfileCertificate: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/certificates/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileCertificate", id: snapshotId },
        ],
    }),

    updateProfileCertificate: builder.mutation({
        query: ({ certId, data }) => ({
            url: `portfoliohub/certificates/${certId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ["ProfileCertificate"],
    }),

    deleteProfileCertificate: builder.mutation({
        query: (certId) => ({
            url: `portfoliohub/certificates/${certId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["ProfileCertificate"],
    }),

    reorderProfileCertificates: builder.mutation({
        query: ({ snapshotId, data }) => ({
            url: `portfoliohub/${snapshotId}/certificates/reorder/`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: (result, error, { snapshotId }) => [
            { type: "ProfileCertificate", id: snapshotId },
        ],
    }),
});