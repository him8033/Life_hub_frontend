import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tokenService } from "../auth/token.service";
import { getSessionId, handleAutoLogout } from "@/utils/sessionHandler";

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
    const sessionId = getSessionId();

    // Public endpoints that should skip session validation
    const publicEndpoints = [
        'auth/login/',
        'auth/register/',
        'auth/token/refresh/',
        'auth/forgot-password/',
        'auth/reset-password/',
        'auth/verify-otp/',
        'auth/resend-otp/',
        'auth/social/login/',
    ];
    const isPublic = publicEndpoints.some(endpoint => args.url.includes(endpoint));

    // Validate session if session_id exists and not a public endpoint
    if (sessionId && !isPublic) {
        try {
            const validateResponse = await fetch(`${BASE_URL}/api/v1/accounts/sessions/validate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenService.get().access}`,
                },
                body: JSON.stringify({ session_id: sessionId }),
            });

            const validateData = await validateResponse.json();

            // If session is invalid, trigger auto-logout
            if (!validateData.success || !validateData.data?.is_valid) {
                handleAutoLogout(validateData.message || 'Session has been revoked');
                return { error: { status: 401, data: validateData } };
            }
        } catch (error) {
            // Fail-safe: if validation fails, proceed with original request
            console.error('Session validation failed:', error);
        }
    }

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
