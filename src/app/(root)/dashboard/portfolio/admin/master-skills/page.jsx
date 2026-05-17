'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MasterSkillTable from '@/components/portfolio/admin/MasterSkillTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetAdminMasterSkillsQuery,
    useDeleteMasterSkillMutation,
    useUpdateMasterSkillMutation,
} from '@/services/api/portfolioApi';
import { useGetPublicSkillCategoriesQuery } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { FiCode } from 'react-icons/fi';
import { FiPlus } from 'react-icons/fi';
import styles from '@/styles/common/CommonListing.module.css';

export default function MasterSkillsPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('priority');
    const [filters, setFilters] = useState({
        is_active: '',
        category_id: '',
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
    } = useGetAdminMasterSkillsQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    const { data: categoriesData } = useGetPublicSkillCategoriesQuery();
    const categories = categoriesData?.data || [];

    const [deleteMasterSkill] = useDeleteMasterSkillMutation();
    const [updateMasterSkill] = useUpdateMasterSkillMutation();

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
        setFilters({ is_active: '', category_id: '' });
        setOrdering('priority');
        setCurrentPage(1);
    };

    const handleDelete = async (skillId, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Master Skill',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });
            if (!ok) return;
            await deleteMasterSkill(skillId).unwrap();
            showSnackbar('Master skill deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete master skill'), 'error', 5000);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (skillId, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Deactivate Skill' : 'Activate Skill',
                message: currentStatus
                    ? `"${name}" will be hidden from selection lists.`
                    : `"${name}" will be visible in selection lists.`,
                confirmText: currentStatus ? 'Deactivate' : 'Activate',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });
            if (!ok) return;
            await updateMasterSkill({
                skillId,
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

    const skills = data?.data?.results || data?.data || [];
    const totalCount = data?.data?.count || skills.length;
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
            value: ordering,
            onChange: (value) => setOrdering(value),
            options: [
                { value: 'priority', label: 'Priority Order ASC' },
                { value: '-priority', label: 'Priority Order DESC' },
                { value: 'name', label: 'Name A-Z' },
                { value: '-name', label: 'Name Z-A' },
                { value: '-created_at', label: 'Newest First' },
                { value: 'created_at', label: 'Oldest First' },
            ],
        },
        {
            value: filters.category_id,
            onChange: (value) => handleFilterChange('category_id', value),
            options: [
                { value: '', label: 'All Categories' },
                ...categories.map(cat => ({
                    value: cat.skillcategory_id,
                    label: cat.name,
                })),
            ],
        },
        {
            value: filters.is_active,
            onChange: (value) => handleFilterChange('is_active', value),
            options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
        },
    ];

    if (isLoading) return <Loader text="Loading master skills..." />;

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load master skills"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiCode className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Master Skills</h1>
                </div>
                <Link
                    href={ROUTES.DASHBOARD.PORTFOLIO.MASTERSKILL.CREATE}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Skill
                </Link>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: "Search by name, slug, or category...",
                    size: "md",
                }}
                paginationProps={{
                    dataLength: skills.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <MasterSkillTable
                    skills={skills}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(skillId) => router.push(ROUTES.DASHBOARD.PORTFOLIO.MASTERSKILL.EDIT(skillId))}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {isFetching && skills.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}