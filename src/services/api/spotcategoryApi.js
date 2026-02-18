import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQueryWithReauth";

export const spotcategoryApi = createApi({
    reducerPath: "spotcategoryApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["SpotCategoryList", "SpotCategoryDetail"],

    endpoints: (builder) => ({

        // PUBLIC LISTING (ANYONE)
        getPublicSpotCategories: builder.query({
            query: () => ({
                url: "spot-categories/",
                method: "GET",
            }),
            providesTags: ["SpotCategoryList"],
        }),

        // FULL VIEW (PUBLIC + ADMIN, SAME ROUTE)
        getSpotCategoryBySlug: builder.query({
            query: (slug) => ({
                url: `spot-categories/${slug}/`,
                method: "GET",
            }),
            providesTags: (res) =>
                res?.data?.spotcategory_id
                    ? [{ type: "SpotCategoryDetail", id: res.data.spotcategory_id }]
                    : [],
        }),

        // ADMIN LIST (FULL DATA)
        getAdminSpotCategories: builder.query({
            query: (params = {}) => ({
                url: "admin/spot-categories/",
                params: {
                    page: params.page || 1,
                    page_size: params.page_size || 10,
                    ordering: params.ordering || '-created_at',
                    search: params.search || '',
                    is_active: params.is_active || '',
                    ...params,
                },
                method: "GET",
            }),
            providesTags: ["SpotCategoryList"],
        }),

        // ADMIN CREATE
        createSpotCategory: builder.mutation({
            query: (payload) => ({
                url: "admin/spot-categories/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["SpotCategoryList"],
        }),

        // ADMIN UPDATE
        updateSpotCategory: builder.mutation({
            query: ({ slug, data }) => ({
                url: `admin/spot-categories/${slug}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["SpotCategoryList", "SpotCategoryDetail"],
        }),

        // ADMIN DELETE
        deleteSpotCategory: builder.mutation({
            query: (slug) => ({
                url: `admin/spot-categories/${slug}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["SpotCategoryList", "SpotCategoryDetail"],
        }),

        // Duplicate Name Check APIs

        checkSpotCategoryName: builder.query({
            query: ({ name, exclude_id }) => {
                let url = `admin/spot-categories/check-name/?name=${encodeURIComponent(name)}`;
                if (exclude_id) {
                    url += `&exclude_id=${exclude_id}`;
                }
                return {
                    url,
                    method: "GET",
                };
            },
        }),
    }),
});

export const {
    // Public
    useGetPublicSpotCategoriesQuery,
    useGetSpotCategoryBySlugQuery,

    // Admin
    useGetAdminSpotCategoriesQuery,
    useCreateSpotCategoryMutation,
    useUpdateSpotCategoryMutation,
    useDeleteSpotCategoryMutation,

    // Duplicate Title check
    useCheckSpotCategoryNameQuery,
} = spotcategoryApi;
