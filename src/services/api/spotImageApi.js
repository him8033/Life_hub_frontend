import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQueryWithReauth";

export const spotImageApi = createApi({
    reducerPath: "spotImageApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["SpotImages"],

    endpoints: (builder) => ({

        // =========================
        // FETCH IMAGES
        // =========================

        getTravelSpotImages: builder.query({
            query: (travelspot_id) => ({
                url: `admin/travel-spots/${travelspot_id}/images/`,
                method: "GET",
            }),
            providesTags: (result, err, travelspot_id) =>
                result?.data
                    ? [
                        ...result.data.map((img) => ({
                            type: "SpotImages",
                            id: img.spotimage_id,
                        })),
                        { type: "SpotImages", id: travelspot_id },
                    ]
                    : [{ type: "SpotImages", id: travelspot_id }],
        }),

        // =========================
        // UPLOAD IMAGE
        // =========================

        uploadSpotImage: builder.mutation({
            query: ({ travelspot_id, data }) => ({
                url: `admin/travel-spots/${travelspot_id}/images/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (res, err, { travelspot_id }) => [
                { type: "SpotImages", id: travelspot_id },
            ],
        }),

        // =========================
        // REPLACE IMAGE
        // =========================

        replaceSpotImage: builder.mutation({
            query: ({ spotimage_id, data }) => ({
                url: `admin/travel-spots/images/${spotimage_id}/replace/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (res, err, { spotimage_id }) => [
                { type: "SpotImages", id: spotimage_id },
            ],
        }),

        // =========================
        // SET PRIMARY
        // =========================

        setPrimarySpotImage: builder.mutation({
            query: (spotimage_id) => ({
                url: `admin/travel-spots/images/${spotimage_id}/set-primary/`,
                method: "PATCH",
            }),
            invalidatesTags: ["SpotImages"],
        }),

        // =========================
        // REORDER IMAGES
        // =========================

        reorderSpotImages: builder.mutation({
            query: ({ travelspot_id, data }) => ({
                url: `admin/travel-spots/${travelspot_id}/images/reorder/`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (res, err, { travelspot_id }) => [
                { type: "SpotImages", id: travelspot_id },
            ],
        }),

        // =========================
        // DELETE IMAGE
        // =========================

        deleteSpotImage: builder.mutation({
            query: (spotimage_id) => ({
                url: `admin/travel-spots/images/${spotimage_id}/delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["SpotImages"],
        }),
    }),
});

export const {
    useGetTravelSpotImagesQuery,
    useUploadSpotImageMutation,
    useReplaceSpotImageMutation,
    useSetPrimarySpotImageMutation,
    useReorderSpotImagesMutation,
    useDeleteSpotImageMutation,
} = spotImageApi;
