import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenService } from "../auth/token.service";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/`,
    prepareHeaders: (headers) => {
        const { access } = tokenService.get();
        if (access) {
            headers.set("authorization", `Bearer ${access}`);
        }
        headers.set("Content-Type", "application/json");
        return headers;
    },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Access token expired
    if (result?.error?.status === 401) {
        const { refresh } = tokenService.get();

        if (!refresh) {
            tokenService.remove();
            return result;
        }

        // Refresh token request
        const refreshResult = await baseQuery(
            {
                url: "auth/token/refresh/",
                method: "POST",
                body: { refresh },
            },
            api,
            extraOptions
        );

        const newAccess = refreshResult?.data?.data?.access;

        if (newAccess) {
            tokenService.store({ access: newAccess });

            // retry original request with NEW token
            result = await baseQuery(args, api, extraOptions);
        } else {
            tokenService.remove();
        }
    }

    return result;
};
