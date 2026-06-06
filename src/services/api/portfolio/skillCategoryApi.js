import { portfolioApi } from './index';

export const skillCategoryEndpoints = (builder) => ({
    // Public - Active categories only (for dropdowns)
    getPublicSkillCategories: builder.query({
        query: () => ({
            url: "portfoliohub/public/skill-categories/",
            method: "GET",
        }),
        providesTags: ["SkillCategory"],
    }),

    // Admin - List with pagination, search, filter
    getAdminSkillCategories: builder.query({
        query: (params) => ({
            url: "portfoliohub/skill-categories/",
            method: "GET",
            params: {
                page: params?.page || 1,
                page_size: params?.page_size || 10,
                search: params?.search || undefined,
                is_active: params?.is_active || undefined,
                ordering: params?.ordering || 'position',
            },
        }),
        providesTags: ["SkillCategory"],
    }),

    // Admin - Create
    createSkillCategory: builder.mutation({
        query: (payload) => ({
            url: "portfoliohub/skill-categories/create/",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["SkillCategory"],
    }),

    // Admin - Get single (for edit)
    getSkillCategory: builder.query({
        query: (categoryId) => ({
            url: `portfoliohub/skill-categories/${categoryId}/`,
            method: "GET",
        }),
        providesTags: (result, error, categoryId) => [
            { type: "SkillCategory", id: categoryId },
        ],
    }),

    // Admin - Update
    updateSkillCategory: builder.mutation({
        query: ({ categoryId, data }) => ({
            url: `portfoliohub/skill-categories/${categoryId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: (result, error, { categoryId }) => [
            { type: "SkillCategory", id: categoryId },
            "SkillCategory",
        ],
    }),

    // Admin - Delete
    deleteSkillCategory: builder.mutation({
        query: (categoryId) => ({
            url: `portfoliohub/skill-categories/${categoryId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["SkillCategory"],
    }),
});