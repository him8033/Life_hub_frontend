export const ROUTES = {
    HOME: "/",
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        FORGOT_PASSWORD: "/auth/forgot_password",
        RESET_PASSWORD: "/auth/reset_password",
        CHANGE_PASSWORD: "/auth/change_password",
        // DASHBOARD: "/auth/dashboard",
    },

    DASHBOARD: {
        DASHBOARD: "/dashboard",
        PROFILE: "/dashboard/profile",
    },

    TRAVELSPOT: {
        PUBLICLISTING: "/travelspots",
        LISTING: "/dashboard/travelspots",
        CREATE: "/dashboard/travelspots/create",
        EDIT: (slug) => `/dashboard/travelspots/edit/${slug}`,
        VIEW: (slug) => `/travelspots/${slug}`,
        // PUBLICVIEW: (slug) => `/travelspots/${slug}`,
    },

    LEGAL: {
        TERMS: "/auth/login",
        PRIVACY: "/auth/login",
    },
};
