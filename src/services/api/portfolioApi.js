import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const portfolioApi = createApi({
    reducerPath: "portfolioApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Snapshot", "SkillCategory", "MasterSkill", "MasterLanguage", "ResumeTemplate", "PortfolioTheme", "BasicInfo", "ProfileSocialLink"],

    endpoints: (builder) => ({
        // Create Snapshot
        createSnapshot: builder.mutation({
            query: (payload) => ({
                url: "portfoliohub/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Snapshot"],
        }),

        // List Snapshots
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

        // Get Single Snapshot
        getSnapshot: builder.query({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/`,
                method: "GET",
            }),
            providesTags: (result, error, snapshotId) => [
                { type: "Snapshot", id: snapshotId },
            ],
        }),

        // Update Snapshot
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

        // Delete Snapshot
        deleteSnapshot: builder.mutation({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Snapshot"],
        }),

        // Duplicate Snapshot
        duplicateSnapshot: builder.mutation({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/duplicate/`,
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["Snapshot"],
        }),

        // ============================================
        // SKILL CATEGORIES
        // ============================================

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


        // ============================================
        // MASTER SKILLS
        // ============================================

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

        // ============================================
        // MASTER LANGUAGES
        // ============================================

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

        // ============================================
        // RESUME TEMPLATES
        // ============================================

        // Public - Active templates only (for dropdowns)
        getPublicResumeTemplates: builder.query({
            query: () => ({
                url: "portfoliohub/public/resume-templates/",
                method: "GET",
            }),
            providesTags: ["ResumeTemplate"],
        }),

        // Admin - List with pagination, search, filter
        getAdminResumeTemplates: builder.query({
            query: (params) => ({
                url: "portfoliohub/resume-templates/",
                method: "GET",
                params: {
                    page: params?.page || 1,
                    page_size: params?.page_size || 10,
                    search: params?.search || undefined,
                    is_active: params?.is_active || undefined,
                    is_premium: params?.is_premium || undefined,
                    is_ats_friendly: params?.is_ats_friendly || undefined,
                    ordering: params?.ordering || '-created_at',
                },
            }),
            providesTags: ["ResumeTemplate"],
        }),

        // Admin - Create
        createResumeTemplate: builder.mutation({
            query: (payload) => ({
                url: "portfoliohub/resume-templates/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["ResumeTemplate"],
        }),

        // Admin - Get single (for edit)
        getResumeTemplate: builder.query({
            query: (templateId) => ({
                url: `portfoliohub/resume-templates/${templateId}/`,
                method: "GET",
            }),
            providesTags: (result, error, templateId) => [
                { type: "ResumeTemplate", id: templateId },
            ],
        }),

        // Admin - Update
        updateResumeTemplate: builder.mutation({
            query: ({ templateId, data }) => ({
                url: `portfoliohub/resume-templates/${templateId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { templateId }) => [
                { type: "ResumeTemplate", id: templateId },
                "ResumeTemplate",
            ],
        }),

        // Admin - Delete
        deleteResumeTemplate: builder.mutation({
            query: (templateId) => ({
                url: `portfoliohub/resume-templates/${templateId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ResumeTemplate"],
        }),

        // ============================================
        // PORTFOLIO THEMES
        // ============================================

        // Public - Active themes only (for dropdowns)
        getPublicPortfolioThemes: builder.query({
            query: () => ({
                url: "portfoliohub/public/portfolio-themes/",
                method: "GET",
            }),
            providesTags: ["PortfolioTheme"],
        }),

        // Admin - List with pagination, search, filter
        getAdminPortfolioThemes: builder.query({
            query: (params) => ({
                url: "portfoliohub/portfolio-themes/",
                method: "GET",
                params: {
                    page: params?.page || 1,
                    page_size: params?.page_size || 10,
                    search: params?.search || undefined,
                    is_active: params?.is_active || undefined,
                    is_premium: params?.is_premium || undefined,
                    ordering: params?.ordering || 'name',
                },
            }),
            providesTags: ["PortfolioTheme"],
        }),

        // Admin - Create
        createPortfolioTheme: builder.mutation({
            query: (payload) => ({
                url: "portfoliohub/portfolio-themes/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["PortfolioTheme"],
        }),

        // Admin - Get single (for edit)
        getPortfolioTheme: builder.query({
            query: (themeId) => ({
                url: `portfoliohub/portfolio-themes/${themeId}/`,
                method: "GET",
            }),
            providesTags: (result, error, themeId) => [
                { type: "PortfolioTheme", id: themeId },
            ],
        }),

        // Admin - Update
        updatePortfolioTheme: builder.mutation({
            query: ({ themeId, data }) => ({
                url: `portfoliohub/portfolio-themes/${themeId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { themeId }) => [
                { type: "PortfolioTheme", id: themeId },
                "PortfolioTheme",
            ],
        }),

        // Admin - Delete
        deletePortfolioTheme: builder.mutation({
            query: (themeId) => ({
                url: `portfoliohub/portfolio-themes/${themeId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["PortfolioTheme"],
        }),

        // ============================================
        // PROFILE BASIC INFO
        // ============================================

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
        // Add to tagTypes: "ProfileSocialLink"

        // ============================================
        // PROFILE SOCIAL LINKS (for snapshot)
        // ============================================

        // List social links for a snapshot
        getProfileSocialLinks: builder.query({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/social-links/`,
                method: "GET",
            }),
            providesTags: (result, error, snapshotId) => [
                { type: "ProfileSocialLink", id: snapshotId },
            ],
        }),

        // Create social link for snapshot
        createProfileSocialLink: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/social-links/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileSocialLink", id: snapshotId },
            ],
        }),

        // Update social link
        updateProfileSocialLink: builder.mutation({
            query: ({ linkId, data }) => ({
                url: `portfoliohub/social-links/${linkId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ProfileSocialLink"],
        }),

        // Delete social link
        deleteProfileSocialLink: builder.mutation({
            query: (linkId) => ({
                url: `portfoliohub/social-links/${linkId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProfileSocialLink"],
        }),

        // Reorder social links
        reorderProfileSocialLinks: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/social-links/reorder/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileSocialLink", id: snapshotId },
            ],
        }),
    }),
});

export const {
    // Snapshots
    useCreateSnapshotMutation,
    useGetSnapshotsQuery,
    useGetSnapshotQuery,
    useUpdateSnapshotMutation,
    useDeleteSnapshotMutation,
    useDuplicateSnapshotMutation,
    // Skill Categories
    useGetPublicSkillCategoriesQuery,
    useGetAdminSkillCategoriesQuery,
    useCreateSkillCategoryMutation,
    useGetSkillCategoryQuery,
    useUpdateSkillCategoryMutation,
    useDeleteSkillCategoryMutation,
    // Master Skills
    useGetPublicMasterSkillsQuery,
    useGetAdminMasterSkillsQuery,
    useCreateMasterSkillMutation,
    useGetMasterSkillQuery,
    useUpdateMasterSkillMutation,
    useDeleteMasterSkillMutation,
    // Master Languages
    useGetPublicMasterLanguagesQuery,
    useGetAdminMasterLanguagesQuery,
    useCreateMasterLanguageMutation,
    useGetMasterLanguageQuery,
    useUpdateMasterLanguageMutation,
    useDeleteMasterLanguageMutation,
    // Resume Templates
    useGetPublicResumeTemplatesQuery,
    useGetAdminResumeTemplatesQuery,
    useCreateResumeTemplateMutation,
    useGetResumeTemplateQuery,
    useUpdateResumeTemplateMutation,
    useDeleteResumeTemplateMutation,
    // Portfolio Themes
    useGetPublicPortfolioThemesQuery,
    useGetAdminPortfolioThemesQuery,
    useCreatePortfolioThemeMutation,
    useGetPortfolioThemeQuery,
    useUpdatePortfolioThemeMutation,
    useDeletePortfolioThemeMutation,
    // Basic Info
    useGetBasicInfoQuery,
    useSaveBasicInfoMutation,
    // Profile Social Links (snapshot)
    useGetProfileSocialLinksQuery,
    useCreateProfileSocialLinkMutation,
    useUpdateProfileSocialLinkMutation,
    useDeleteProfileSocialLinkMutation,
    useReorderProfileSocialLinksMutation,
} = portfolioApi;