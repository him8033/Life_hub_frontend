// src/routes/routes.constants.js

/**
 * ============================================================================
 * SINGLE SOURCE OF TRUTH: Centralized Routes & Permissions Definition
 * ============================================================================
 *
 * To set or change a route's accessibility, simply use defineRoute(path, access):
 * - 'admin' : Accessible only by admin and superuser accounts
 * - 'user'  : Accessible only by regular (non-admin) accounts
 * - 'all'   : Accessible by any authenticated user (default)
 *
 * Example: To allow regular users to access Users page, change:
 *   USERS: defineRoute("/dashboard/account/users", "admin"),
 * to:
 *   USERS: defineRoute("/dashboard/account/users", "all"),
 */

// Internal registry mapping routes to access levels
const routeAccessRegistry = {
    // Default fallback rules for entire sections
    '/dashboard/account': 'admin',
    '/dashboard/portfolio/admin': 'admin',
};

/**
 * Define a route path with its access permission.
 * Returns the exact string path to maintain 100% backward compatibility everywhere.
 *
 * @param {string} path - URL path string
 * @param {'admin' | 'user' | 'all'} access - Access rule
 * @returns {string} - The path string
 */
export const defineRoute = (path, access = 'all') => {
    routeAccessRegistry[path] = access;
    return path;
};

/**
 * Resolves the configured access level for a given pathname.
 *
 * @param {string} pathname
 * @returns {'admin' | 'user' | 'all'}
 */
export const getRouteAccess = (pathname) => {
    if (!pathname) return 'all';

    // 1. Exact match in registry
    if (routeAccessRegistry[pathname]) {
        return routeAccessRegistry[pathname];
    }

    // 2. Longest prefix match in registry
    const matchedPrefixes = Object.keys(routeAccessRegistry)
        .filter(prefix => pathname === prefix || pathname.startsWith(prefix + '/'))
        .sort((a, b) => b.length - a.length);

    if (matchedPrefixes.length > 0) {
        return routeAccessRegistry[matchedPrefixes[0]];
    }

    return 'all';
};

/**
 * Checks if a user role has permission to access a specific route.
 *
 * @param {string} pathname - Route URL (e.g. '/dashboard/account/users')
 * @param {string} role - Current user role ('admin' | 'user')
 * @returns {boolean}
 */
export const canAccessRoute = (pathname, role = 'user') => {
    const access = getRouteAccess(pathname);
    const isAdmin = role === 'admin';

    if (access === 'admin') {
        return isAdmin;
    }

    if (access === 'user') {
        return !isAdmin;
    }

    return true; // 'all'
};

// Export access registry reference for inspection/debugging
export const ROUTE_ACCESS = routeAccessRegistry;

// ============================================================================
// ROUTES DEFINITION
// ============================================================================
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
        VERIFY_OTP: "/auth/verify_otp",
        FORGOT_PASSWORD: "/auth/forgot_password",
        RESET_PASSWORD: "/auth/reset_password",
        CHANGE_PASSWORD: "/auth/change_password",
    },

    DASHBOARD: {
        HOME: defineRoute("/dashboard", "all"),
        PROFILE: defineRoute("/dashboard/profile", "all"),

        // Account Management (Default: admin only)
        ACCOUNT: {
            USERS: defineRoute("/dashboard/account/users", "admin"),
            ROLES: defineRoute("/dashboard/account/roles", "admin"),
            STATUS: defineRoute("/dashboard/account/status", "admin"),
            OTPPURPOSES: defineRoute("/dashboard/account/otppurposes", "admin"),
            PERMISSIONS: defineRoute("/dashboard/account/permissions", "admin"),
            SOCIALPROVIDERS: defineRoute("/dashboard/account/socialproviders", "admin"),
            SOCIALACCOUNTS: defineRoute("/dashboard/account/socialaccounts", "admin"),
            LOGINHISTORY: defineRoute("/dashboard/account/loginhistory", "admin"),
            OTPS: defineRoute("/dashboard/account/otps", "admin"),
            USERSESSIONS: defineRoute("/dashboard/account/usersessions", "admin"),
            ROLEPERMISSIONS: defineRoute("/dashboard/account/rolepermissions", "admin"),
        },

        TRAVELSPOT: {
            LIST: defineRoute('/dashboard/travelspots', 'all'),
            CREATE: defineRoute('/dashboard/travelspots/create', 'all'),
            EDIT: (slug) => `/dashboard/travelspots/edit/${slug}`,
            VIEW: (slug) => `/dashboard/travelspots/view/${slug}`,
            SPOTCATEGORY: {
                LIST: defineRoute('/dashboard/travelspots/spotcategory', 'all'),
                CREATE: defineRoute('/dashboard/travelspots/spotcategory/create', 'all'),
                EDIT: (travelspot_id) => `/dashboard/travelspots/spotcategory/edit/${travelspot_id}`,
                VIEW: (travelspot_id) => `/dashboard/travelspots/spotcategory/view/${travelspot_id}`,
            },
        },

        PORTFOLIO: {
            // Snapshots
            SNAPSHOT: {
                LIST: defineRoute('/dashboard/portfolio/snapshots', 'all'),
                CREATE: defineRoute('/dashboard/portfolio/snapshots/create', 'all'),
                EDIT: (snapshotId) => `/dashboard/portfolio/snapshots/edit/${snapshotId}`,
                VIEW: (snapshotId) => `/dashboard/portfolio/snapshots/view/${snapshotId}`,
            },

            // Resumes (User-facing)
            RESUME: {
                LIST: defineRoute('/dashboard/portfolio/resumes', 'all'),
                CREATE: defineRoute('/dashboard/portfolio/resumes/create', 'all'),
                EDIT: (resumeId) => `/dashboard/portfolio/resumes/edit/${resumeId}`,
                VIEW: (resumeId) => `/resume-builder/${resumeId}`,
                PREVIEW: (slug) => `/resume-preview/${slug}`,
                PREVIEW_EMBED: (slug) => `/resume-preview/${slug}?embed=true`,
                PUBLIC: (slug) => `/resume/${slug}`,
            },

            // Portfolios (User-facing)
            PORTFOLIO: {
                LIST: defineRoute('/dashboard/portfolio/portfolios', 'all'),
                CREATE: defineRoute('/dashboard/portfolio/portfolios/create', 'all'),
                EDIT: (portfolioId) => `/dashboard/portfolio/portfolios/edit/${portfolioId}`,
                VIEW: (portfolioId) => `/portfolio-builder/${portfolioId}`,
                PREVIEW: (slug) => `/portfolio-preview/${slug}`,
                PREVIEW_EMBED: (slug) => `/portfolio-preview/${slug}?embed=true`,
                PUBLIC: (slug) => `/portfolio/${slug}`,
            },

            // Admin - Skill Categories
            SKILLCATEGORY: {
                LIST: defineRoute('/dashboard/portfolio/admin/skill-categories', 'admin'),
                CREATE: defineRoute('/dashboard/portfolio/admin/skill-categories/create', 'admin'),
                EDIT: (categoryId) => `/dashboard/portfolio/admin/skill-categories/edit/${categoryId}`,
            },

            // Admin - Master Skills
            MASTERSKILL: {
                LIST: defineRoute('/dashboard/portfolio/admin/master-skills', 'admin'),
                CREATE: defineRoute('/dashboard/portfolio/admin/master-skills/create', 'admin'),
                EDIT: (skillId) => `/dashboard/portfolio/admin/master-skills/edit/${skillId}`,
            },

            // Admin - Master Languages
            MASTERLANGUAGE: {
                LIST: defineRoute('/dashboard/portfolio/admin/master-languages', 'admin'),
                CREATE: defineRoute('/dashboard/portfolio/admin/master-languages/create', 'admin'),
                EDIT: (languageId) => `/dashboard/portfolio/admin/master-languages/edit/${languageId}`,
            },

            // Admin - Resume Templates
            RESUMETEMPLATE: {
                LIST: defineRoute('/dashboard/portfolio/admin/resume-templates', 'admin'),
                CREATE: defineRoute('/dashboard/portfolio/admin/resume-templates/create', 'admin'),
                EDIT: (templateId) => `/dashboard/portfolio/admin/resume-templates/edit/${templateId}`,
                SECTIONS: (templateId) => `/dashboard/portfolio/admin/resume-templates/edit/${templateId}/sections`,
            },

            // Admin - Portfolio Themes
            PORTFOLIOTHEME: {
                LIST: defineRoute('/dashboard/portfolio/admin/portfolio-themes', 'admin'),
                CREATE: defineRoute('/dashboard/portfolio/admin/portfolio-themes/create', 'admin'),
                EDIT: (themeId) => `/dashboard/portfolio/admin/portfolio-themes/edit/${themeId}`,
                SECTIONS: (themeId) => `/dashboard/portfolio/admin/portfolio-themes/edit/${themeId}/sections`,
            },
        },
    },

    LEGAL: {
        TERMS: "/auth/login",
        PRIVACY: "/auth/login",
    },
};
