'use client';

import { useParams } from 'next/navigation';
import { useGetPublicPortfolioQuery, useGetPublicPortfolioThemesQuery } from '@/services/api/portfolioApi';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import { getPortfolioTheme } from '@/components/portfolio/theme/ThemeRegistry';
import styles from '@/styles/portfolio/portfolio/PublicPortfolio.module.css';
import { extractErrorMessage } from '@/utils/errorHandler';

export default function PublicPortfolioPage() {
    const params = useParams();
    const slug = params.slug;

    const { data, isLoading, error, refetch } = useGetPublicPortfolioQuery(slug, { skip: !slug });
    const { data: themesData } = useGetPublicPortfolioThemesQuery();

    const portfolioData = data?.data;
    const themes = themesData?.data || [];

    if (isLoading) {
        return <Loader text="Loading portfolio..." />;
    }

    if (error?.status === 404) {
        return <NotFoundState
            title="Portfolio Not Found"
            message="This portfolio doesn't exist or is private."
            fullPage
        />;
    }

    if (error) {
        return <ErrorState
            message={extractErrorMessage(error, 'Failed to load portfolio')}
            onRetry={refetch}
            retryMsg="Retry"
        />;
    }

    if (!portfolioData) {
        return <NotFoundState
            title="Portfolio Not Found"
            fullPage
        />;
    }

    // Get theme key from theme ID
    const themeId = portfolioData.portfolio?.portfolio_theme_id || portfolioData.theme?.theme_id;
    const theme = themes.find(t => t.theme_id === themeId);
    const themeKey = theme?.key || 'portfolio_theme'; // Default to portfolio_theme

    // Get the theme component
    const ThemeComponent = getPortfolioTheme(themeKey);

    return (
        <div className={styles.publicPage}>
            <ThemeComponent data={portfolioData} />
        </div>
    );
}