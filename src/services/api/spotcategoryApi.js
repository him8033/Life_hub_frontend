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
            query: () => ({
                url: "admin/spot-categories/",
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
} = spotcategoryApi;
