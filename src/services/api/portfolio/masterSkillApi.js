import { portfolioApi } from './index';

export const masterSkillEndpoints = (builder) => ({
    // Public - Active skills only (for dropdowns)
    getPublicMasterSkills: builder.query({
        query: () => ({
            url: "portfoliohub/public/master-skills/",
            method: "GET",
        }),
        providesTags: ["MasterSkill"],
    }),

    // Admin - List with pagination, search, filter
    getAdminMasterSkills: builder.query({
        query: (params) => ({
            url: "portfoliohub/master-skills/",
            method: "GET",
            params: {
                page: params?.page || 1,
                page_size: params?.page_size || 10,
                search: params?.search || undefined,
                is_active: params?.is_active || undefined,
                category_id: params?.category_id || undefined,
                ordering: params?.ordering || 'priority',
            },
        }),
        providesTags: ["MasterSkill"],
    }),

    // Admin - Create
    createMasterSkill: builder.mutation({
        query: (payload) => ({
            url: "portfoliohub/master-skills/",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["MasterSkill"],
    }),

    // Admin - Get single (for edit)
    getMasterSkill: builder.query({
        query: (skillId) => ({
            url: `portfoliohub/master-skills/${skillId}/`,
            method: "GET",
        }),
        providesTags: (result, error, skillId) => [
            { type: "MasterSkill", id: skillId },
        ],
    }),

    // Admin - Update
    updateMasterSkill: builder.mutation({
        query: ({ skillId, data }) => ({
            url: `portfoliohub/master-skills/${skillId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: (result, error, { skillId }) => [
            { type: "MasterSkill", id: skillId },
            "MasterSkill",
        ],
    }),

    // Admin - Delete
    deleteMasterSkill: builder.mutation({
        query: (skillId) => ({
            url: `portfoliohub/master-skills/${skillId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["MasterSkill"],
    }),
});