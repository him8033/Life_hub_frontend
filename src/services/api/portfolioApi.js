import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const portfolioApi = createApi({
    reducerPath: "portfolioApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Snapshot", "SkillCategory"],

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
} = portfolioApi;