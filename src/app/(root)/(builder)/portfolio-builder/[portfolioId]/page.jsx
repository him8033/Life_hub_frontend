'use client';

import { useParams, useRouter } from 'next/navigation';
import PortfolioBuilder from '@/components/portfolio/PortfolioBuilder';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';

export default function PortfolioBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const portfolioId = params.portfolioId;

    const handlePreview = (slug) => {
        window.open(`/portfolio/${slug}`, '_blank');
    };

    const handleBack = () => {
        router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST);
    };

    return (
        <PortfolioBuilder
            portfolioId={portfolioId}
            onBack={handleBack}
            onPreview={handlePreview}
        />
    );
}