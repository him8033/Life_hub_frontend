import { portfolioApi } from './index';

export const portfolioThemeEndpoints = (builder) => ({
    // Public - Active themes only (for dropdowns)
    getPublicPortfolioThemes: builder.query({
        query: () => ({
            url: "portfoliohub/public/portfolio-themes/",
            method: "GET",
        }),
        providesTags: ["PortfolioTheme"],
    }),

    // Admin - List with pagination, search, filter
    getAdminPortfolioThemes: builder.query({
        query: (params) => ({
            url: "portfoliohub/portfolio-themes/",
            method: "GET",
            params: {
                page: params?.page || 1,
                page_size: params?.page_size || 10,
                search: params?.search || undefined,
                is_active: params?.is_active || undefined,
                is_premium: params?.is_premium || undefined,
                ordering: params?.ordering || 'name',
            },
        }),
        providesTags: ["PortfolioTheme"],
    }),

    // Admin - Create
    createPortfolioTheme: builder.mutation({
        query: (payload) => ({
            url: "portfoliohub/portfolio-themes/",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["PortfolioTheme"],
    }),

    // Admin - Get single (for edit)
    getPortfolioTheme: builder.query({
        query: (themeId) => ({
            url: `portfoliohub/portfolio-themes/${themeId}/`,
            method: "GET",
        }),
        providesTags: (result, error, themeId) => [
            { type: "PortfolioTheme", id: themeId },
        ],
    }),

    // Admin - Update
    updatePortfolioTheme: builder.mutation({
        query: ({ themeId, data }) => ({
            url: `portfoliohub/portfolio-themes/${themeId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: (result, error, { themeId }) => [
            { type: "PortfolioTheme", id: themeId },
            "PortfolioTheme",
        ],
    }),

    // Admin - Delete
    deletePortfolioTheme: builder.mutation({
        query: (themeId) => ({
            url: `portfoliohub/portfolio-themes/${themeId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["PortfolioTheme"],
    }),

    // Portfolio Theme Sections
    getThemeSections: builder.query({
        query: (themeId) => ({
            url: `portfoliohub/portfolio-themes/${themeId}/sections/`,
            method: "GET",
        }),
        providesTags: (result, error, themeId) => [
            { type: "ThemeSection", id: themeId },
        ],
    }),

    updateThemeSection: builder.mutation({
        query: ({ themeId, sectionId, data }) => ({
            url: `portfoliohub/portfolio-themes/${themeId}/sections/${sectionId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: (result, error, { themeId }) => [
            { type: "ThemeSection", id: themeId },
        ],
    }),
});