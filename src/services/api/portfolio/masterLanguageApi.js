import { portfolioApi } from './index';

export const masterLanguageEndpoints = (builder) => ({
    // Public - Active languages only (for dropdowns)
    getPublicMasterLanguages: builder.query({
        query: () => ({
            url: "portfoliohub/public/master-languages/",
            method: "GET",
        }),
        providesTags: ["MasterLanguage"],
    }),

    // Admin - List with pagination, search, filter
    getAdminMasterLanguages: builder.query({
        query: (params) => ({
            url: "portfoliohub/master-languages/",
            method: "GET",
            params: {
                page: params?.page || 1,
                page_size: params?.page_size || 10,
                search: params?.search || undefined,
                is_active: params?.is_active || undefined,
                ordering: params?.ordering || 'position',
            },
        }),
        providesTags: ["MasterLanguage"],
    }),

    // Admin - Create
    createMasterLanguage: builder.mutation({
        query: (payload) => ({
            url: "portfoliohub/master-languages/",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["MasterLanguage"],
    }),

    // Admin - Get single (for edit)
    getMasterLanguage: builder.query({
        query: (languageId) => ({
            url: `portfoliohub/master-languages/${languageId}/`,
            method: "GET",
        }),
        providesTags: (result, error, languageId) => [
            { type: "MasterLanguage", id: languageId },
        ],
    }),

    // Admin - Update
    updateMasterLanguage: builder.mutation({
        query: ({ languageId, data }) => ({
            url: `portfoliohub/master-languages/${languageId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: (result, error, { languageId }) => [
            { type: "MasterLanguage", id: languageId },
            "MasterLanguage",
        ],
    }),

    // Admin - Delete
    deleteMasterLanguage: builder.mutation({
        query: (languageId) => ({
            url: `portfoliohub/master-languages/${languageId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["MasterLanguage"],
    }),
});