import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQueryWithReauth";

export const travelspotApi = createApi({
    reducerPath: "travelspotApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: [
        "TravelSpotList",
        "TravelSpotDetail",
    ],

    endpoints: (builder) => ({

        // =========================
        // PUBLIC APIs
        // =========================

        getPublicTravelSpots: builder.query({
            query: () => ({
                url: "travel-spots/",
                method: "GET",
            }),
            providesTags: ["TravelSpotList"],
        }),

        getTravelSpotBySlug: builder.query({
            query: (slug) => ({
                url: `travel-spots/${slug}/`,
                method: "GET",
            }),
            providesTags: (result) =>
                result?.travelspot_id
                    ? [{ type: "TravelSpotDetail", id: result.travelspot_id }]
                    : [],
        }),

        // =========================
        // ADMIN LEGACY CRUD
        // =========================

        getAdminTravelSpots: builder.query({
            query: () => ({
                url: "admin/travel-spots/",
                method: "GET",
            }),
            providesTags: ["TravelSpotList"],
        }),

        createTravelSpot: builder.mutation({
            query: (payload) => ({
                url: "admin/travel-spots/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["TravelSpotList"],
        }),

        updateTravelSpot: builder.mutation({
            query: ({ travelspot_id, data }) => ({
                url: `admin/travel-spots/${travelspot_id}/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (res, err, { travelspot_id }) => [
                "TravelSpotList",
                { type: "TravelSpotDetail", id: travelspot_id },
            ],
        }),

        deleteTravelSpot: builder.mutation({
            query: (travelspot_id) => ({
                url: `admin/travel-spots/${travelspot_id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["TravelSpotList"],
        }),

        // =========================
        // STEP-BASED CREATION APIs
        // =========================

        createBasicInfo: builder.mutation({
            query: (payload) => ({
                url: "admin/travel-spots/steps/basic-info/",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["TravelSpotList"],
        }),

        updateBasicInfo: builder.mutation({
            query: ({ travelspot_id, data }) => ({
                url: `admin/travel-spots/${travelspot_id}/steps/basic-info/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (res, err, { travelspot_id }) => [
                { type: "TravelSpotDetail", id: travelspot_id },
            ],
        }),

        updateLocationStep: builder.mutation({
            query: ({ travelspot_id, data }) => ({
                url: `admin/travel-spots/${travelspot_id}/steps/location/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (res, err, { travelspot_id }) => [
                { type: "TravelSpotDetail", id: travelspot_id },
            ],
        }),

        updateDetailsStep: builder.mutation({
            query: ({ travelspot_id, data }) => ({
                url: `admin/travel-spots/${travelspot_id}/steps/details/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (res, err, { travelspot_id }) => [
                { type: "TravelSpotDetail", id: travelspot_id },
            ],
        }),

        submitTravelSpot: builder.mutation({
            query: (travelspot_id) => ({
                url: `admin/travel-spots/${travelspot_id}/steps/submit/`,
                method: "POST",
            }),
            invalidatesTags: (res, err, travelspot_id) => [
                "TravelSpotList",
                { type: "TravelSpotDetail", id: travelspot_id },
            ],
        }),

    }),
});


export const {
    // Public
    useGetPublicTravelSpotsQuery,
    useGetTravelSpotBySlugQuery,

    // Admin legacy
    useGetAdminTravelSpotsQuery,
    useCreateTravelSpotMutation,
    useUpdateTravelSpotMutation,
    useDeleteTravelSpotMutation,

    // Step-based
    useCreateBasicInfoMutation,
    useUpdateBasicInfoMutation,
    useUpdateLocationStepMutation,
    useUpdateDetailsStepMutation,
    useSubmitTravelSpotMutation,
} = travelspotApi;
