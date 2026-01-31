export const ROUTES = {
    PUBLIC: {
        HOME: '/',
        TRAVELSPOTS: '/travelspots',
        TRAVELSPOT: {
            VIEW: (slug) => `/travelspots/${slug}`,
        },
        LOCATIONFINDER: '/locations',
        ABOUT: '/about',
        SERVICES: '/services',
        CONTACT: '/contact',
    },

    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        FORGOT_PASSWORD: "/auth/forgot_password",
        RESET_PASSWORD: "/auth/reset_password",
        CHANGE_PASSWORD: "/auth/change_password",
        // DASHBOARD: "/auth/dashboard",
    },

    DASHBOARD: {
        HOME: "/dashboard",
        PROFILE: "/dashboard/profile",
        TRAVELSPOT: {
            LIST: '/dashboard/travelspots',
            CREATE: '/dashboard/travelspots/create',
            EDIT: (slug) => `/dashboard/travelspots/edit/${slug}`,
            VIEW: (slug) => `/dashboard/travelspots/view/${slug}`,
            SPOTCATEGORY: {
                LIST: '/dashboard/travelspots/spotcategory',
                CREATE: '/dashboard/travelspots/spotcategory/create',
                EDIT: (travelspot_id) => `/dashboard/travelspots/spotcategory/edit/${travelspot_id}`,
                VIEW: (travelspot_id) => `/dashboard/travelspots/spotcategory/view/${travelspot_id}`,
            },
        },
    },

    LEGAL: {
        TERMS: "/auth/login",
        PRIVACY: "/auth/login",
    },
};
