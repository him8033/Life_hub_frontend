import { portfolioApi } from './index';

export const resumeTemplateEndpoints = (builder) => ({
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

    // Template Sections
    getTemplateSections: builder.query({
        query: (templateId) => ({
            url: `portfoliohub/resume-templates/${templateId}/sections/`,
            method: "GET",
        }),
        providesTags: (result, error, templateId) => [
            { type: "TemplateSection", id: templateId },
        ],
    }),

    updateTemplateSection: builder.mutation({
        query: ({ templateId, sectionId, data }) => ({
            url: `portfoliohub/resume-templates/${templateId}/sections/${sectionId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: (result, error, { templateId }) => [
            { type: "TemplateSection", id: templateId },
        ],
    }),
});