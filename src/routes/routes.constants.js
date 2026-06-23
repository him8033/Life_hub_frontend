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
        // PORTFOLIO: {
        //     LIST: '/dashboard/portfolio',
        //     CREATE: '/dashboard/portfolio/create',
        //     VIEW: (snapshotId) => `/dashboard/portfolio/${snapshotId}`,
        //     EDIT: (snapshotId) => `/dashboard/portfolio/${snapshotId}/edit`,
        // },

        PORTFOLIO: {
            // Snapshots
            SNAPSHOT: {
                LIST: '/dashboard/portfolio/snapshots',
                CREATE: '/dashboard/portfolio/snapshots/create',
                EDIT: (snapshotId) => `/dashboard/portfolio/snapshots/edit/${snapshotId}`,
                VIEW: (snapshotId) => `/dashboard/portfolio/snapshots/view/${snapshotId}`,
            },

            // Resumes (User-facing)
            RESUME: {
                LIST: '/dashboard/portfolio/resumes',
                CREATE: '/dashboard/portfolio/resumes/create',
                EDIT: (resumeId) => `/dashboard/portfolio/resumes/edit/${resumeId}`,
                VIEW: (resumeId) => `/resume-builder/${resumeId}`,
                PREVIEW: (slug) => `/resume-preview/${slug}`,
                PREVIEW_EMBED: (slug) => `/resume-preview/${slug}?embed=true`,
                PUBLIC: (slug) => `/resume/${slug}`, // Future public page
            },

            // Portfolios (User-facing)
            PORTFOLIO: {
                LIST: '/dashboard/portfolio/portfolios',
                CREATE: '/dashboard/portfolio/portfolios/create',
                EDIT: (portfolioId) => `/dashboard/portfolio/portfolios/edit/${portfolioId}`,
                VIEW: (portfolioId) => `/dashboard/portfolio/portfolios/${portfolioId}`,
                PREVIEW: (slug) => `/portfolio/${slug}`,
            },

            // Admin - Skill Categories
            SKILLCATEGORY: {
                LIST: '/dashboard/portfolio/admin/skill-categories',
                CREATE: '/dashboard/portfolio/admin/skill-categories/create',
                EDIT: (categoryId) => `/dashboard/portfolio/admin/skill-categories/edit/${categoryId}`,
            },

            // Admin - Master Skills
            MASTERSKILL: {
                LIST: '/dashboard/portfolio/admin/master-skills',
                CREATE: '/dashboard/portfolio/admin/master-skills/create',
                EDIT: (skillId) => `/dashboard/portfolio/admin/master-skills/edit/${skillId}`,
            },

            // Admin - Master Languages
            MASTERLANGUAGE: {
                LIST: '/dashboard/portfolio/admin/master-languages',
                CREATE: '/dashboard/portfolio/admin/master-languages/create',
                EDIT: (languageId) => `/dashboard/portfolio/admin/master-languages/edit/${languageId}`,
            },

            // Admin - Resume Templates
            RESUMETEMPLATE: {
                LIST: '/dashboard/portfolio/admin/resume-templates',
                CREATE: '/dashboard/portfolio/admin/resume-templates/create',
                EDIT: (templateId) => `/dashboard/portfolio/admin/resume-templates/edit/${templateId}`,
                SECTIONS: (templateId) => `/dashboard/portfolio/admin/resume-templates/edit/${templateId}/sections`,
            },

            // Admin - Portfolio Themes
            PORTFOLIOTHEME: {
                LIST: '/dashboard/portfolio/admin/portfolio-themes',
                CREATE: '/dashboard/portfolio/admin/portfolio-themes/create',
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
