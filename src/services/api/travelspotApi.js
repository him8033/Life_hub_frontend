import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQueryWithReauth";

export const travelspotApi = createApi({
    reducerPath: "travelspotApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["TravelSpotList", "TravelSpotDetail"],

    endpoints: (builder) => ({

        // PUBLIC LISTING (ANYONE)
        getPublicTravelSpots: builder.query({
            query: () => ({
                url: "travel-spots/",
                method: "GET",
            }),
            providesTags: ["TravelSpotList"],
        }),

        // FULL VIEW (PUBLIC + ADMIN, SAME ROUTE)
        getTravelSpotBySlug: builder.query({
            query: (slug) => ({
                url: `travel-spots/${slug}/`,
                method: "GET",
            }),
            providesTags: (res) =>
                res?.data?.travelspot_id
                    ? [{ type: "TravelSpotDetail", id: res.data.travelspot_id }]
                    : [],
        }),

        // ADMIN LIST (FULL DATA)
        getAdminTravelSpots: builder.query({
            query: () => ({
                url: "admin/travel-spots/",
                method: "GET",
            }),
            providesTags: ["TravelSpotList"],
        }),

        // ADMIN CREATE
        createTravelSpot: builder.mutation({
            query: (payload) => ({
                url: "admin/travel-spots/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["TravelSpotList"],
        }),

        // ADMIN UPDATE
        updateTravelSpot: builder.mutation({
            query: ({ slug, data }) => ({
                url: `admin/travel-spots/${slug}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["TravelSpotList", "TravelSpotDetail"],
        }),

        // ADMIN DELETE
        deleteTravelSpot: builder.mutation({
            query: (slug) => ({
                url: `admin/travel-spots/${slug}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["TravelSpotList", "TravelSpotDetail"],
        }),
    }),
});

export const {
    // Public
    useGetPublicTravelSpotsQuery,
    useGetTravelSpotBySlugQuery,

    // Admin
    useGetAdminTravelSpotsQuery,
    useCreateTravelSpotMutation,
    useUpdateTravelSpotMutation,
    useDeleteTravelSpotMutation,
} = travelspotApi;
