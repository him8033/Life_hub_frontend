import { portfolioApi } from './index';

export const portfolioProjectEndpoints = (builder) => ({

    getPortfolioProjects: builder.query({
        query: () => ({
            url: "portfoliohub/portfolio-projects/",
            method: "GET",
        }),
        providesTags: ["PortfolioProject"],
    }),

    createPortfolioProject: builder.mutation({
        query: (payload) => ({
            url: "portfoliohub/portfolio-projects/",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["PortfolioProject"],
    }),

    getPortfolioProject: builder.query({
        query: (portfolioId) => ({
            url: `portfoliohub/portfolio-projects/${portfolioId}/`,
            method: "GET",
        }),
        providesTags: (result, error, portfolioId) => [
            { type: "PortfolioProject", id: portfolioId },
        ],
    }),

    updatePortfolioProject: builder.mutation({
        query: ({ portfolioId, data }) => ({
            url: `portfoliohub/portfolio-projects/${portfolioId}/`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: (result, error, { portfolioId }) => [
            { type: "PortfolioProject", id: portfolioId },
            "PortfolioProject",
        ],
    }),

    deletePortfolioProject: builder.mutation({
        query: (portfolioId) => ({
            url: `portfoliohub/portfolio-projects/${portfolioId}/`,
            method: "DELETE",
        }),
        invalidatesTags: ["PortfolioProject"],
    }),

    duplicatePortfolioProject: builder.mutation({
        query: (portfolioId) => ({
            url: `portfoliohub/portfolio-projects/${portfolioId}/duplicate/`,
            method: "POST",
            body: {},
        }),
        invalidatesTags: ["PortfolioProject"],
    }),

    // ============================================
    // PORTFOLIO VIEWS / ANALYTICS
    // ============================================

    getPortfolioAnalytics: builder.query({
        query: (portfolioId) => ({
            url: `portfoliohub/portfolio-projects/${portfolioId}/analytics/`,
            method: "GET",
        }),
        providesTags: (result, error, portfolioId) => [
            { type: "PortfolioView", id: portfolioId },
        ],
    }),
});