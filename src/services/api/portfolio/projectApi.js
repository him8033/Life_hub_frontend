import { portfolioApi } from './index';

export const projectEndpoints = (builder) => ({
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
});