import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQueryWithReauth";

export const travelspotApi = createApi({
    reducerPath: "travelspotApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: [
        "TravelSpotList",
        "TravelSpotDetail",
        "TravelSpotVisitors",
    ],

    endpoints: (builder) => ({

        // =========================
        // PUBLIC APIs
        // =========================

        getPublicTravelSpots: builder.query({
            query: (params = {}) => ({
                url: '/travel-spots/',
                params,
                method: "GET",
            }),
            transformResponse: (response) => {
                return {
                    results: response.data.results,
                    next: response.data.next,
                    previous: response.data.previous,
                    count: response.data.results.length,
                };
            },
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

        getNearbyTravelSpots: builder.query({
            query: ({ slug, radius = 50, sort = 'distance', cursor = null }) => {
                const params = { radius, sort };

                if (cursor) {
                    params.cursor = cursor;
                }

                return {
                    url: `/travel-spots/${slug}/nearby/`,
                    params
                };
            },
        }),

        // =========================
        // ADMIN LEGACY CRUD
        // =========================

        getAdminTravelSpots: builder.query({
            query: (params = {}) => ({
                url: "admin/travel-spots/",
                params: {
                    page: params.page || 1,
                    page_size: params.page_size || 10,
                    ordering: params.ordering || '-created_at',
                    search: params.search || '',
                    state: params.state || '',
                    district: params.district || '',
                    sub_district: params.sub_district || '',
                    village: params.village || '',
                    category: params.category || '',
                    min_views: params.min_views || '',
                    is_active: params.is_active || '',
                    ...params,
                },
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

        // =========================
        // Duplicate Name Check APIs
        // =========================

        checkTravelSpotName: builder.query({
            query: ({ name, exclude_id }) => {
                let url = `admin/travel-spots/check-name/?name=${encodeURIComponent(name)}`;
                if (exclude_id) {
                    url += `&exclude_id=${exclude_id}`;
                }
                return {
                    url,
                    method: "GET",
                };
            },
        }),

        // ==============================
        // GET VISITORS OF A TRAVEL SPOT
        // ==============================
        getTravelSpotVisitors: builder.query({
            query: (travelspotId) => ({
                url: `/admin/travel-spots/${travelspotId}/visitors/`,
                method: "GET",
            }),
            providesTags: (res, error, travelspotId) => [
                { type: "TravelSpotVisitors", id: travelspotId },
            ],
        }),

    }),
});


export const {
    // Public
    useLazyGetPublicTravelSpotsQuery,
    useGetPublicTravelSpotsQuery,
    useGetTravelSpotBySlugQuery,
    useGetNearbyTravelSpotsQuery,

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

    // Duplicate Title check
    useCheckTravelSpotNameQuery,

    // Get Visitors List
    useGetTravelSpotVisitorsQuery,
} = travelspotApi;
