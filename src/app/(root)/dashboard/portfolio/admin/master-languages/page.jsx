'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MasterLanguageTable from '@/components/portfolio/admin/MasterLanguageTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetAdminMasterLanguagesQuery,
    useDeleteMasterLanguageMutation,
    useUpdateMasterLanguageMutation,
} from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { FiFlag } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import styles from '@/styles/common/CommonListing.module.css';

export default function MasterLanguagesPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('position');
    const [filters, setFilters] = useState({
        is_active: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const {
        data,
        error,
        isLoading,
        isFetching,
        refetch
    } = useGetAdminMasterLanguagesQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    const [deleteMasterLanguage] = useDeleteMasterLanguageMutation();
    const [updateMasterLanguage] = useUpdateMasterLanguageMutation();

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
        setFilters({ is_active: '' });
        setOrdering('position');
        setCurrentPage(1);
    };

    const handleDelete = async (languageId, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Language',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });
            if (!ok) return;
            await deleteMasterLanguage(languageId).unwrap();
            showSnackbar('Language deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete language'), 'error', 5000);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (languageId, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Deactivate Language' : 'Activate Language',
                message: currentStatus
                    ? `"${name}" will be hidden from selection lists.`
                    : `"${name}" will be visible in selection lists.`,
                confirmText: currentStatus ? 'Deactivate' : 'Activate',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });
            if (!ok) return;
            await updateMasterLanguage({
                languageId,
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

    const languages = data?.data?.results || data?.data || [];
    const totalCount = data?.data?.count || languages.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const headerFilters = [
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
            value: ordering,
            onChange: (value) => setOrdering(value),
            options: [
                { value: 'position', label: 'Position Order' },
                { value: 'name', label: 'Name A-Z' },
                { value: '-name', label: 'Name Z-A' },
                { value: '-created_at', label: 'Newest First' },
                { value: 'created_at', label: 'Oldest First' },
            ],
        },
    ];

    if (isLoading) return <Loader text="Loading languages..." />;

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load languages"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiFlag className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Master Languages</h1>
                </div>
                <Link
                    href={ROUTES.DASHBOARD.PORTFOLIO.MASTERLANGUAGE.CREATE}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Language
                </Link>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: "Search by name, code, or slug...",
                    size: "md",
                }}
                paginationProps={{
                    dataLength: languages.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <MasterLanguageTable
                    languages={languages}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(languageId) => router.push(ROUTES.DASHBOARD.PORTFOLIO.MASTERLANGUAGE.EDIT(languageId))}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {isFetching && languages.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}