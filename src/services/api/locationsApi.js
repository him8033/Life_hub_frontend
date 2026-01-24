import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../api/baseQueryWithReauth";

export const locationsApi = createApi({
    reducerPath: "locationsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "Country",
        "State",
        "District",
        "SubDistrict",
        "Village",
        "Pincode",
    ],

    endpoints: (builder) => ({

        /* =======================
           COUNTRIES
        ======================== */

        getCountries: builder.query({
            query: () => ({
                url: "locations/countries/",
                method: "GET",
            }),
            providesTags: ["Country"],
        }),

        /* =======================
           STATES (by Country)
        ======================== */

        getStatesByCountry: builder.query({
            query: (country_id) => ({
                url: "locations/states/",
                method: "GET",
                params: { country_id },
            }),
            providesTags: ["State"],
        }),

        /* =======================
           DISTRICTS (by State)
        ======================== */

        getDistrictsByState: builder.query({
            query: (state_id) => ({
                url: "locations/districts/",
                method: "GET",
                params: { state_id },
            }),
            providesTags: ["District"],
        }),

        /* =======================
           SUB-DISTRICTS (by District)
        ======================== */

        getSubDistrictsByDistrict: builder.query({
            query: (district_id) => ({
                url: "locations/sub-districts/",
                method: "GET",
                params: { district_id },
            }),
            providesTags: ["SubDistrict"],
        }),

        /* =======================
           VILLAGES (PAGINATED)
        ======================== */

        getVillagesBySubDistrict: builder.query({
            query: ({ sub_district_id, limit = 20, offset = 0 }) => ({
                url: "locations/villages/",
                method: "GET",
                params: {
                    sub_district_id,
                    limit,
                    offset,
                },
            }),
            providesTags: ["Village"],
        }),

        /* =======================
           PINCODES
        ======================== */

        searchPincodes: builder.query({
            query: ({ search, village_id }) => ({
                url: "locations/pincodes/",
                method: "GET",
                params: {
                    ...(search && { search }),
                    ...(village_id && { village_id }),
                },
            }),
            providesTags: ["Pincode"],
        }),

    }),
});

export const {
    useGetCountriesQuery,
    useGetStatesByCountryQuery,
    useGetDistrictsByStateQuery,
    useGetSubDistrictsByDistrictQuery,
    useGetVillagesBySubDistrictQuery,
    useSearchPincodesQuery,
} = locationsApi;
