'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/common/buttons/Button';
import PortfolioCard from '@/components/portfolio/PortfolioCard';
import {
    useGetPortfolioProjectsQuery,
    useDeletePortfolioProjectMutation,
    useDuplicatePortfolioProjectMutation
} from '@/services/api/portfolioApi';
import { FiGlobe, FiPlus, FiSearch } from 'react-icons/fi';
import styles from '@/styles/common/CommonListing.module.css';

export default function PortfoliosPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, isLoading, error, refetch } = useGetPortfolioProjectsQuery();
    const [deletePortfolio] = useDeletePortfolioProjectMutation();
    const [duplicatePortfolio] = useDuplicatePortfolioProjectMutation();

    const portfolios = data?.data || [];

    const filteredPortfolios = portfolios.filter(r =>
        r.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (portfolioId, title) => {
        const ok = await confirm({
            title: 'Delete Portfolio',
            message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
        });
        if (!ok) return;
        try {
            setIsDeleting(true);
            await deletePortfolio(portfolioId).unwrap();
            showSnackbar('Portfolio deleted successfully', 'success', 3000);
            refetch();
        }
        catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete portfolio'), 'error', 5000);
        }
        finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async (portfolioId, title) => {
        try {
            await duplicatePortfolio(portfolioId).unwrap();
            showSnackbar(`"${title}" duplicated successfully`, 'success', 3000);
            refetch();
        }
        catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000);
        }
    };

    const handlePreview = (slug) => {
        window.open(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.PREVIEW(slug), '_blank');
    };

    const handleEdit = (portfolioId) => {
        router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.VIEW(portfolioId));
    };

    const handleEditSettings = (portfolioId) => {
        router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.EDIT(portfolioId));
    };

    if (isLoading) return <Loader text="Loading portfolios..." />;
    if (error) return <ErrorState message={error?.data?.message || "Failed to load portfolios"} onRetry={refetch} retryMsg="Retry" />;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiGlobe className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>My Portfolios</h1>
                </div>
                <Button
                    variant="primary"
                    onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.CREATE)}
                    icon={<FiPlus />}
                >
                    Create Portfolio
                </Button>
            </div>

            {/* Search Bar */}
            {portfolios.length > 0 && (
                <div className={styles.searchWrapper}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search portfolios by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
                            ✕
                        </button>
                    )}
                </div>
            )}

            {/* Resume Cards Grid */}
            {filteredPortfolios.length > 0 ? (
                <div className={styles.cardGrid}>
                    {filteredPortfolios.map((portfolio) => (
                        <PortfolioCard
                            key={portfolio.portfolio_id}
                            portfolio={portfolio}
                            onEdit={() => handleEdit(portfolio.portfolio_id)}
                            onEditSettings={() => handleEditSettings(portfolio.portfolio_id)}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                            onPreview={handlePreview}
                            isLoading={isDeleting}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FiGlobe size={48} />
                    <h3>{searchTerm ? 'No portfolios match your search' : 'No portfolios yet'}</h3>
                    <p>
                        {searchTerm
                            ? 'Try a different search term or clear the search.'
                            : 'Create your first portfolio from scratch or use existing profile data.'}
                    </p>
                    {!searchTerm && (
                        <Button
                            variant="primary"
                            onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.CREATE)}
                            icon={<FiPlus />}
                        >
                            Create Portfolio
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}