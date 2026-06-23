'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ResumeTemplateCard from '@/components/portfolio/admin/ResumeTemplateCard';
import {
    useGetAdminResumeTemplatesQuery,
    useDeleteResumeTemplateMutation,
    useUpdateResumeTemplateMutation,
} from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { FiLayout } from 'react-icons/fi';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import styles from '@/styles/portfolio/admin/ResumeTemplateList.module.css';

export default function ResumeTemplatesPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        is_active: '',
        is_premium: '',
        is_ats_friendly: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const {
        data,
        error,
        isLoading,
        isFetching,
        refetch
    } = useGetAdminResumeTemplatesQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    const [deleteResumeTemplate] = useDeleteResumeTemplateMutation();
    const [updateResumeTemplate] = useUpdateResumeTemplateMutation();

    const activeFilterCount = Object.values(filters).filter(value => value).length + (debouncedSearch ? 1 : 0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const handleClearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setFilters({ is_active: '', is_premium: '', is_ats_friendly: '' });
        setOrdering('-created_at');
        setCurrentPage(1);
    };

    const handleDelete = async (templateId, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Template',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });
            if (!ok) return;
            await deleteResumeTemplate(templateId).unwrap();
            showSnackbar('Template deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete template'), 'error', 5000);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (templateId, currentStatus, name) => {
        try {
            setIsToggling(true);
            await updateResumeTemplate({
                templateId,
                data: { is_active: !currentStatus },
            }).unwrap();
            showSnackbar(
                currentStatus ? `"${name}" deactivated` : `"${name}" activated`,
                'success',
                3000
            );
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to update status'), 'error', 5000);
        } finally {
            setIsToggling(false);
        }
    };

    const handleSections = (templateId) => {
        router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUMETEMPLATE.SECTIONS(templateId));
    };

    const templates = data?.data?.results || data?.data || [];
    const totalCount = data?.data?.count || templates.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    // Filter chips for card view
    const filterChips = [
        {
            value: filters.is_active,
            onChange: (value) => handleFilterChange('is_active', value),
            options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
        },
        {
            value: filters.is_premium,
            onChange: (value) => handleFilterChange('is_premium', value),
            options: [
                { value: '', label: 'All Types' },
                { value: 'true', label: 'Premium' },
                { value: 'false', label: 'Free' },
            ],
        },
        {
            value: filters.is_ats_friendly,
            onChange: (value) => handleFilterChange('is_ats_friendly', value),
            options: [
                { value: '', label: 'All Formats' },
                { value: 'true', label: 'ATS Friendly' },
                { value: 'false', label: 'Standard' },
            ],
        },
    ];

    if (isLoading) return <Loader text="Loading templates..." />;

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load templates"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiLayout className={styles.pageIcon} />
                    <div>
                        <h1 className={styles.pageTitle}>Resume Templates</h1>
                        <p className={styles.pageSubtitle}>Manage resume templates with preview images</p>
                    </div>
                </div>
                <Link
                    href={ROUTES.DASHBOARD.PORTFOLIO.RESUMETEMPLATE.CREATE}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Template
                </Link>
            </div>

            {/* Search and Filters */}
            <div className={styles.controlsBar}>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.filterChips}>
                    {filterChips.map((chip, index) => (
                        <select
                            key={index}
                            value={chip.value}
                            onChange={(e) => chip.onChange(e.target.value)}
                            className={styles.filterSelect}
                        >
                            {chip.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ))}
                    <select
                        value={ordering}
                        onChange={(e) => setOrdering(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="-created_at">Newest First</option>
                        <option value="created_at">Oldest First</option>
                        <option value="name">Name A-Z</option>
                        <option value="-name">Name Z-A</option>
                    </select>
                    {activeFilterCount > 0 && (
                        <button onClick={handleClearFilters} className={styles.clearButton}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Card Grid */}
            {templates.length > 0 ? (
                <>
                    <div className={styles.cardGrid}>
                        {templates.map((template) => (
                            <ResumeTemplateCard
                                key={template.template_id}
                                template={template}
                                onEdit={(templateId) => router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUMETEMPLATE.EDIT(templateId))}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                                onSections={handleSections}
                                isLoading={isDeleting || isToggling || isFetching}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={styles.pageButton}
                            >
                                Previous
                            </button>
                            <span className={styles.pageInfo}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={styles.pageButton}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.emptyState}>
                    <FiLayout size={48} />
                    <h3>No templates found</h3>
                    <p>Create your first resume template</p>
                </div>
            )}

            {isFetching && templates.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}