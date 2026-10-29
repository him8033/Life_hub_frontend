'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import {
    FiActivity,
    FiPlus,
    FiEdit,
} from 'react-icons/fi';
import StatusTable from '@/components/dashboard/account/status/StatusTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetStatusListQuery,
    useCreateStatusMutation,
    useEditStatusMutation,
    useDeleteStatusMutation,
} from '@/services/api/dashboard/account/status/statusApi';
import { useModal } from '@/context/ModalContext';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';
import {
    createStatusSchema,
    editStatusSchema,
} from '@/lib/validations/dashboard/account/status/statusValidation';

export default function StatusesPage() {
    const showModal = useModal();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    // ---------- Mutations ----------
    const [createStatus] = useCreateStatusMutation();
    const [editStatus] = useEditStatusMutation();
    const [deleteStatus] = useDeleteStatusMutation();

    // Form ref for backend error handling
    let formRef = null;

    // ---------- Search / sort / filters ----------
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        is_active: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // ---------- Operation states ----------
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    // ---------- API ----------
    const { data, error, isLoading, isFetching, refetch } = useGetStatusListQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    // ---------- Debounce search ----------
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // ---------- Filter handlers ----------
    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const handleClearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setFilters({ is_active: '' });
        setOrdering('-created_at');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    /* ============================================================
       1. CREATE STATUS
    ============================================================ */
    const handleCreateStatus = () => {
        showModal({
            title: 'Create New Status',
            subtitle: 'Add a new user status to the system',
            subtitleLabel: 'Status Management',
            icon: <FiPlus />,
            submitText: 'Create Status',
            size: 'md',
            defaultValues: {
                name: '',
                slug: '',
                description: '',
                is_active: true,
            },
            fields: [
                {
                    name: 'name',
                    label: 'Status Name',
                    placeholder: 'Enter status name (e.g., Active)',
                    required: true,
                },
                {
                    name: 'slug',
                    label: 'Slug',
                    placeholder: 'Enter slug (e.g., active)',
                    required: true,
                    description: 'URL-friendly identifier (lowercase, hyphens only)',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Describe when this status should be used',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
            ],
            schema: createStatusSchema,
            onSubmit: async (data) => {
                try {
                    const res = await createStatus(data).unwrap();
                    showSnackbar(res.message || 'Status created successfully', 'success', 5000);
                    refetch();
                } catch (error) {
                    const backendErrors = error?.data?.errors;
                    if (backendErrors?.field_errors && formRef) {
                        Object.entries(backendErrors.field_errors).forEach(([field, messages]) => {
                            formRef.setError(field, { type: 'server', message: messages[0] });
                        });
                    }
                    // Handle nested non_field_errors structure
                    const nonFieldErrors = backendErrors?.non_field_errors?.length
                        ? backendErrors.non_field_errors
                        : backendErrors?.field_errors?.errors?.non_field_errors;
                    if (nonFieldErrors?.length) {
                        showSnackbar(nonFieldErrors[0], 'error', 5000);
                    } else if (!backendErrors?.field_errors) {
                        throw error;
                    }
                }
            },
            onBackendError: (form) => {
                formRef = form;
            },
        });
    };

    /* ============================================================
       2. EDIT STATUS DETAILS
    ============================================================ */
    const handleEditStatusDetails = (status) => {
        showModal({
            title: 'Edit Status',
            subtitle: status.name,
            subtitleLabel: 'Status Name',
            icon: <FiEdit />,
            submitText: 'Save Changes',
            size: 'md',
            defaultValues: {
                name: status.name || '',
                slug: status.slug || '',
                description: status.description || '',
                is_active: status.is_active,
            },
            fields: [
                {
                    name: 'name',
                    label: 'Status Name',
                    placeholder: 'Enter status name',
                    required: true,
                },
                {
                    name: 'slug',
                    label: 'Slug',
                    placeholder: 'Enter slug',
                    required: true,
                    description: 'URL-friendly identifier (lowercase, hyphens only)',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Describe when this status should be used',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
            ],
            schema: editStatusSchema,
            onSubmit: async (data) => {
                try {
                    const res = await editStatus({
                        userstatus_id: status.userstatus_id,
                        data: data,
                    }).unwrap();
                    showSnackbar(res.message || 'Status updated successfully', 'success', 5000);
                    refetch();
                } catch (error) {
                    const backendErrors = error?.data?.errors;
                    if (backendErrors?.field_errors && formRef) {
                        Object.entries(backendErrors.field_errors).forEach(([field, messages]) => {
                            formRef.setError(field, { type: 'server', message: messages[0] });
                        });
                    }
                    // Handle nested non_field_errors structure
                    const nonFieldErrors = backendErrors?.non_field_errors?.length
                        ? backendErrors.non_field_errors
                        : backendErrors?.field_errors?.errors?.non_field_errors;
                    if (nonFieldErrors?.length) {
                        showSnackbar(nonFieldErrors[0], 'error', 5000);
                    } else if (!backendErrors?.field_errors) {
                        throw error;
                    }
                }
            },
            onBackendError: (form) => {
                formRef = form;
            },
        });
    };

    /* ============================================================
       3. DELETE STATUS
    ============================================================ */
    const handleDeleteStatus = async (userstatus_id, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Status',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            const res = await deleteStatus({
                userstatus_id,
            }).unwrap();
            showSnackbar(res.message || 'Status deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(extractErrorMessage(error, 'Failed to delete status'), 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    /* ============================================================
       4. TOGGLE STATUS
    ============================================================ */
    const handleToggleStatus = async (userstatus_id, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Deactivate Status' : 'Activate Status',
                message: currentStatus
                    ? `"${name}" will be deactivated.`
                    : `"${name}" will be activated.`,
                confirmText: currentStatus ? 'Deactivate' : 'Activate',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });

            if (!ok) return;

            const res = await editStatus({
                userstatus_id,
                data: {
                    is_active: !currentStatus,
                },
            }).unwrap();

            showSnackbar(
                res.message || (currentStatus
                    ? `"${name}" is now deactivated`
                    : `"${name}" is now activated`),
                'success',
                3000
            );
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(extractErrorMessage(error, `Failed to ${currentStatus ? 'deactivate' : 'activate'} status`), 'error', 5000);
            }
        } finally {
            setIsToggling(false);
        }
    };

    /* ============================================================
       Listing helpers
    ============================================================ */
    const statuses = data?.data?.results || data?.results || [];
    const pagination = data?.data?.pagination || {};
    const totalCount = pagination.total ?? data?.data?.count ?? data?.count ?? 0;
    const totalPages =
        pagination.total_pages ?? Math.max(1, Math.ceil(totalCount / pageSize));

    const handlePageChange = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };
    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    // ---------- Header filters ----------
    const headerFilters = [
        {
            value: filters.is_active,
            onChange: (v) => handleFilterChange('is_active', v),
            options: [
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
        },
        {
            value: ordering,
            onChange: (v) => setOrdering(v),
            options: [
                { value: '-created_at', label: 'Newest First' },
                { value: 'created_at', label: 'Oldest First' },
                { value: 'name', label: 'Name A-Z' },
                { value: '-name', label: 'Name Z-A' },
            ],
        },
    ];

    // ---------- Loading / error ----------
    if (isLoading) return <Loader text="Loading statuses..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load statuses. Please try again.')}
                errorType="error"
                onRetry={() => refetch()}
                retryMsg="Refresh"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiActivity className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Status Management</h1>
                </div>
                <button
                    onClick={handleCreateStatus}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Status
                </button>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: 'Search by name or slug...',
                    size: 'md',
                    showFilterButton: false,
                }}
                paginationProps={{
                    dataLength: statuses.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <StatusTable
                    statuses={statuses}
                    onEdit={handleEditStatusDetails}
                    onDelete={handleDeleteStatus}
                    onToggleStatus={handleToggleStatus}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {/* Loading Overlay */}
            {isFetching && statuses.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
