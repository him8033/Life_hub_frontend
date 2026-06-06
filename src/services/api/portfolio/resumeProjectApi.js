import { portfolioApi } from './index';

export const resumeProjectEndpoints = (builder) => ({
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
});