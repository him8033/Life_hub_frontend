import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const portfolioApi = createApi({
    reducerPath: "portfolioApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "Snapshot",
        "SkillCategory",
        "MasterSkill",
        "MasterLanguage",
        "ResumeTemplate",
        "PortfolioTheme",
        "BasicInfo",
        "ProfileSocialLink",
        "Achievement",
        "Hobby",
        "Strength",
        "ProfileLanguage",
        "ProfileEducation",
        "ProfileExperience",
        "ProfileCertificate",
        "ProfileSkill",
        "ProfileProject",
        "ProjectSkill",
        "ProjectImage",
        "ProfileCustomSection",
        "ResumeProject",
        "ResumeExport",
        "PortfolioProject",
        "PortfolioView",
    ],

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

        // ============================================
        // PROFILE ACHIEVEMENTS
        // ============================================

        getAchievements: builder.query({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/achievements/`,
                method: "GET",
            }),
            providesTags: (result, error, snapshotId) => [
                { type: "Achievement", id: snapshotId },
            ],
        }),

        createAchievement: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/achievements/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "Achievement", id: snapshotId },
            ],
        }),

        updateAchievement: builder.mutation({
            query: ({ achievementId, data }) => ({
                url: `portfoliohub/achievements/${achievementId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Achievement"],
        }),

        deleteAchievement: builder.mutation({
            query: (achievementId) => ({
                url: `portfoliohub/achievements/${achievementId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Achievement"],
        }),

        reorderAchievements: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/achievements/reorder/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "Achievement", id: snapshotId },
            ],
        }),

        // ============================================
        // PROFILE HOBBIES
        // ============================================

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

        // ============================================
        // PROFILE STRENGTHS
        // ============================================

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

        // ============================================
        // PROFILE LANGUAGES
        // ============================================

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

        // ============================================
        // PROFILE EDUCATION
        // ============================================

        // List education for a snapshot
        getProfileEducation: builder.query({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/educations/`,
                method: "GET",
            }),
            providesTags: (result, error, snapshotId) => [
                { type: "ProfileEducation", id: snapshotId },
            ],
        }),

        // Create education
        createProfileEducation: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/educations/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileEducation", id: snapshotId },
            ],
        }),

        // Update education
        updateProfileEducation: builder.mutation({
            query: ({ eduId, data }) => ({
                url: `portfoliohub/educations/${eduId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ProfileEducation"],
        }),

        // Delete education
        deleteProfileEducation: builder.mutation({
            query: (eduId) => ({
                url: `portfoliohub/educations/${eduId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProfileEducation"],
        }),

        // Reorder education
        reorderProfileEducation: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/educations/reorder/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileEducation", id: snapshotId },
            ],
        }),

        // ============================================
        // PROFILE EXPERIENCE
        // ============================================

        getProfileExperience: builder.query({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/experiences/`,
                method: "GET",
            }),
            providesTags: (result, error, snapshotId) => [
                { type: "ProfileExperience", id: snapshotId },
            ],
        }),

        createProfileExperience: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/experiences/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileExperience", id: snapshotId },
            ],
        }),

        updateProfileExperience: builder.mutation({
            query: ({ expId, data }) => ({
                url: `portfoliohub/experiences/${expId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ProfileExperience"],
        }),

        deleteProfileExperience: builder.mutation({
            query: (expId) => ({
                url: `portfoliohub/experiences/${expId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProfileExperience"],
        }),

        reorderProfileExperience: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/experiences/reorder/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileExperience", id: snapshotId },
            ],
        }),

        // ============================================
        // PROFILE CERTIFICATES
        // ============================================

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

        // ============================================
        // PROFILE SKILLS
        // ============================================

        getProfileSkills: builder.query({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/skills/`,
                method: "GET",
            }),
            providesTags: (result, error, snapshotId) => [
                { type: "ProfileSkill", id: snapshotId },
            ],
        }),

        createProfileSkill: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/skills/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileSkill", id: snapshotId },
            ],
        }),

        updateProfileSkill: builder.mutation({
            query: ({ skillId, data }) => ({
                url: `portfoliohub/skills/${skillId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ProfileSkill"],
        }),

        deleteProfileSkill: builder.mutation({
            query: (skillId) => ({
                url: `portfoliohub/skills/${skillId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProfileSkill"],
        }),

        reorderProfileSkills: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/skills/reorder/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileSkill", id: snapshotId },
            ],
        }),

        // ============================================
        // PROFILE PROJECT
        // ============================================

        getProfileProjects: builder.query({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/projects/`,
                method: "GET",
            }),
            providesTags: (result, error, snapshotId) => [
                { type: "ProfileProject", id: snapshotId },
            ],
        }),

        createProfileProject: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/projects/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileProject", id: snapshotId },
            ],
        }),

        getProfileProject: builder.query({
            query: (projectId) => ({
                url: `portfoliohub/projects/${projectId}/`,
                method: "GET",
            }),
            providesTags: (result, error, projectId) => [
                { type: "ProfileProject", id: projectId },
            ],
        }),

        updateProfileProject: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `portfoliohub/projects/${projectId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "ProfileProject", id: projectId },
                "ProfileProject",
            ],
        }),

        deleteProfileProject: builder.mutation({
            query: (projectId) => ({
                url: `portfoliohub/projects/${projectId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProfileProject"],
        }),

        reorderProfileProjects: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/projects/reorder/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileProject", id: snapshotId },
            ],
        }),

        // ============================================
        // PROJECT SKILLS
        // ============================================

        getProjectSkills: builder.query({
            query: (projectId) => ({
                url: `portfoliohub/projects/${projectId}/skills/`,
                method: "GET",
            }),
            providesTags: (result, error, projectId) => [
                { type: "ProjectSkill", id: projectId },
            ],
        }),

        addProjectSkill: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `portfoliohub/projects/${projectId}/skills/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "ProjectSkill", id: projectId },
            ],
        }),

        removeProjectSkill: builder.mutation({
            query: ({ projectId, skillId }) => ({
                url: `portfoliohub/projects/${projectId}/skills/${skillId}/`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "ProjectSkill", id: projectId },
            ],
        }),

        // ============================================
        // PROJECT IMAGES
        // ============================================

        getProjectImages: builder.query({
            query: (projectId) => ({
                url: `portfoliohub/projects/${projectId}/images/`,
                method: "GET",
            }),
            providesTags: (result, error, projectId) => [
                { type: "ProjectImage", id: projectId },
            ],
        }),

        uploadProjectImage: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `portfoliohub/projects/${projectId}/images/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "ProjectImage", id: projectId },
            ],
        }),

        updateProjectImage: builder.mutation({
            query: ({ imageId, data }) => ({
                url: `portfoliohub/projects/images/${imageId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ProjectImage"],
        }),

        deleteProjectImage: builder.mutation({
            query: (imageId) => ({
                url: `portfoliohub/projects/images/${imageId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProjectImage"],
        }),

        reorderProjectImages: builder.mutation({
            query: ({ projectId, data }) => ({
                url: `portfoliohub/projects/${projectId}/images/reorder/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { projectId }) => [
                { type: "ProjectImage", id: projectId },
            ],
        }),

        // ============================================
        // PROJECT CUSTOM SECTIONS
        // ============================================

        getProfileCustomSections: builder.query({
            query: (snapshotId) => ({
                url: `portfoliohub/${snapshotId}/custom-sections/`,
                method: "GET",
            }),
            providesTags: (result, error, snapshotId) => [
                { type: "ProfileCustomSection", id: snapshotId },
            ],
        }),

        createProfileCustomSection: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/custom-sections/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileCustomSection", id: snapshotId },
            ],
        }),

        updateProfileCustomSection: builder.mutation({
            query: ({ sectionId, data }) => ({
                url: `portfoliohub/custom-sections/${sectionId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ProfileCustomSection"],
        }),

        deleteProfileCustomSection: builder.mutation({
            query: (sectionId) => ({
                url: `portfoliohub/custom-sections/${sectionId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProfileCustomSection"],
        }),

        reorderProfileCustomSections: builder.mutation({
            query: ({ snapshotId, data }) => ({
                url: `portfoliohub/${snapshotId}/custom-sections/reorder/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { snapshotId }) => [
                { type: "ProfileCustomSection", id: snapshotId },
            ],
        }),

        // ============================================
        // RESUME PROJECTS
        // ============================================

        getResumeProjects: builder.query({
            query: () => ({
                url: "portfoliohub/resume-projects/",
                method: "GET",
            }),
            providesTags: ["ResumeProject"],
        }),

        createResumeProject: builder.mutation({
            query: (payload) => ({
                url: "portfoliohub/resume-projects/",
                method: "POST",
                body: payload,  // Contains: title, snapshot_id, template_key, font_family, etc.
            }),
            invalidatesTags: ["ResumeProject"],
        }),

        getResumeProject: builder.query({
            query: (resumeId) => ({
                url: `portfoliohub/resume-projects/${resumeId}/`,
                method: "GET",
            }),
            providesTags: (result, error, resumeId) => [
                { type: "ResumeProject", id: resumeId },
            ],
        }),

        updateResumeProject: builder.mutation({
            query: ({ resumeId, data }) => ({
                url: `portfoliohub/resume-projects/${resumeId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { resumeId }) => [
                { type: "ResumeProject", id: resumeId },
                "ResumeProject",
            ],
        }),

        deleteResumeProject: builder.mutation({
            query: (resumeId) => ({
                url: `portfoliohub/resume-projects/${resumeId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ResumeProject"],
        }),

        duplicateResumeProject: builder.mutation({
            query: (resumeId) => ({
                url: `portfoliohub/resume-projects/${resumeId}/duplicate/`,
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["ResumeProject"],
        }),

        generateResumePDF: builder.mutation({
            query: (resumeId) => ({
                url: `portfoliohub/resume-projects/${resumeId}/generate-pdf/`,
                method: "POST",
            }),
            invalidatesTags: (result, error, resumeId) => [
                { type: "ResumeProject", id: resumeId },
            ],
        }),

        // ============================================
        // RESUME EXPORTS
        // ============================================

        getResumeExports: builder.query({
            query: (resumeId) => ({
                url: `portfoliohub/resume-projects/${resumeId}/exports/`,
                method: "GET",
            }),
            providesTags: (result, error, resumeId) => [
                { type: "ResumeExport", id: resumeId },
            ],
        }),

        deleteResumeExport: builder.mutation({
            query: (exportId) => ({
                url: `portfoliohub/resume-exports/${exportId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["ResumeExport"],
        }),

        // ============================================
        // PORTFOLIO PROJECTS
        // ============================================

        getPortfolioProjects: builder.query({
            query: () => ({
                url: "portfoliohub/portfolio-projects/",
                method: "GET",
            }),
            providesTags: ["PortfolioProject"],
        }),

        createPortfolioProject: builder.mutation({
            query: (payload) => ({
                url: "portfoliohub/portfolio-projects/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["PortfolioProject"],
        }),

        getPortfolioProject: builder.query({
            query: (portfolioId) => ({
                url: `portfoliohub/portfolio-projects/${portfolioId}/`,
                method: "GET",
            }),
            providesTags: (result, error, portfolioId) => [
                { type: "PortfolioProject", id: portfolioId },
            ],
        }),

        updatePortfolioProject: builder.mutation({
            query: ({ portfolioId, data }) => ({
                url: `portfoliohub/portfolio-projects/${portfolioId}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { portfolioId }) => [
                { type: "PortfolioProject", id: portfolioId },
                "PortfolioProject",
            ],
        }),

        deletePortfolioProject: builder.mutation({
            query: (portfolioId) => ({
                url: `portfoliohub/portfolio-projects/${portfolioId}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["PortfolioProject"],
        }),

        duplicatePortfolioProject: builder.mutation({
            query: (portfolioId) => ({
                url: `portfoliohub/portfolio-projects/${portfolioId}/duplicate/`,
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["PortfolioProject"],
        }),

        // ============================================
        // PORTFOLIO VIEWS / ANALYTICS
        // ============================================

        getPortfolioAnalytics: builder.query({
            query: (portfolioId) => ({
                url: `portfoliohub/portfolio-projects/${portfolioId}/analytics/`,
                method: "GET",
            }),
            providesTags: (result, error, portfolioId) => [
                { type: "PortfolioView", id: portfolioId },
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
    // Achievements
    useGetAchievementsQuery,
    useCreateAchievementMutation,
    useUpdateAchievementMutation,
    useDeleteAchievementMutation,
    useReorderAchievementsMutation,
    // Hobbies
    useGetHobbiesQuery,
    useCreateHobbyMutation,
    useUpdateHobbyMutation,
    useDeleteHobbyMutation,
    useReorderHobbiesMutation,
    // Strengths
    useGetStrengthsQuery,
    useCreateStrengthMutation,
    useUpdateStrengthMutation,
    useDeleteStrengthMutation,
    useReorderStrengthsMutation,
    // Profile Languages
    useGetProfileLanguagesQuery,
    useCreateProfileLanguageMutation,
    useUpdateProfileLanguageMutation,
    useDeleteProfileLanguageMutation,
    useReorderProfileLanguagesMutation,
    // Profile Education
    useGetProfileEducationQuery,
    useCreateProfileEducationMutation,
    useUpdateProfileEducationMutation,
    useDeleteProfileEducationMutation,
    useReorderProfileEducationMutation,
    // Profile Experiance
    useGetProfileExperienceQuery,
    useCreateProfileExperienceMutation,
    useUpdateProfileExperienceMutation,
    useDeleteProfileExperienceMutation,
    useReorderProfileExperienceMutation,
    // Profile Certificate
    useGetProfileCertificatesQuery,
    useCreateProfileCertificateMutation,
    useUpdateProfileCertificateMutation,
    useDeleteProfileCertificateMutation,
    useReorderProfileCertificatesMutation,
    // Profile Skill
    useGetProfileSkillsQuery,
    useCreateProfileSkillMutation,
    useUpdateProfileSkillMutation,
    useDeleteProfileSkillMutation,
    useReorderProfileSkillsMutation,
    // Profile Project
    useGetProfileProjectsQuery,
    useCreateProfileProjectMutation,
    useGetProfileProjectQuery,
    useUpdateProfileProjectMutation,
    useDeleteProfileProjectMutation,
    useReorderProfileProjectsMutation,
    // Project Skills
    useGetProjectSkillsQuery,
    useAddProjectSkillMutation,
    useRemoveProjectSkillMutation,
    // Project Images
    useGetProjectImagesQuery,
    useUploadProjectImageMutation,
    useUpdateProjectImageMutation,
    useDeleteProjectImageMutation,
    useReorderProjectImagesMutation,
    // Profile Custom Sections
    useGetProfileCustomSectionsQuery,
    useCreateProfileCustomSectionMutation,
    useUpdateProfileCustomSectionMutation,
    useDeleteProfileCustomSectionMutation,
    useReorderProfileCustomSectionsMutation,
    // Resume Projects
    useGetResumeProjectsQuery,
    useCreateResumeProjectMutation,
    useGetResumeProjectQuery,
    useUpdateResumeProjectMutation,
    useDeleteResumeProjectMutation,
    useDuplicateResumeProjectMutation,
    // Export Resume
    useGenerateResumePDFMutation,
    useGetResumeExportsQuery,
    useDeleteResumeExportMutation,
    // Portfolio Projects
    useGetPortfolioProjectsQuery, 
    useCreatePortfolioProjectMutation, 
    useGetPortfolioProjectQuery,
    useUpdatePortfolioProjectMutation, 
    useDeletePortfolioProjectMutation,
    useDuplicatePortfolioProjectMutation,
    // Portfolio Views / Analytics
    useGetPortfolioAnalyticsQuery,
} = portfolioApi;