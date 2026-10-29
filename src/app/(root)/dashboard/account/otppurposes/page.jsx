'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import {
    FiLock,
    FiPlus,
    FiEdit,
} from 'react-icons/fi';
import OTPPurposeTable from '@/components/dashboard/account/otppurposes/OTPPurposeTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetOTPPurposeListQuery,
    useCreateOTPPurposeMutation,
    useEditOTPPurposeMutation,
    useDeleteOTPPurposeMutation,
} from '@/services/api/dashboard/account/otppurposes/otppurposeApi';
import { useModal } from '@/context/ModalContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useSnackbar } from '@/context/SnackbarContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';
import {
    createOTPPurposeSchema,
    editOTPPurposeSchema,
} from '@/lib/validations/dashboard/account/otppurposes/otppurposeValidation';

export default function OTPPurposesPage() {
    const showModal = useModal();
    const confirm = useConfirm();
    const { showSnackbar } = useSnackbar();

    // ---------- Mutations ----------
    const [createOTPPurpose] = useCreateOTPPurposeMutation();
    const [editOTPPurpose] = useEditOTPPurposeMutation();
    const [deleteOTPPurpose] = useDeleteOTPPurposeMutation();

    // Form ref for backend error handling
    let formRef = null;

    // ---------- Search / sort / filters ----------
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('name');
    const [filters, setFilters] = useState({
        is_active: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // ---------- Operation states ----------
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    // ---------- API ----------
    const { data, error, isLoading, isFetching, refetch } = useGetOTPPurposeListQuery({
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
        setOrdering('name');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    /* ============================================================
       1. CREATE OTP PURPOSE
    ============================================================ */
    const handleCreateOTPPurpose = () => {
        showModal({
            title: 'Create New OTP Purpose',
            subtitle: 'Add a new OTP purpose to the system',
            subtitleLabel: 'OTP Purpose Management',
            icon: <FiPlus />,
            submitText: 'Create OTP Purpose',
            size: 'md',
            defaultValues: {
                name: '',
                slug: '',
                description: '',
                expiry_seconds: 300,
                max_attempts: 3,
                resend_cooldown_seconds: 60,
                is_active: true,
            },
            fields: [
                {
                    name: 'name',
                    label: 'Purpose Name',
                    placeholder: 'Enter purpose name (e.g., Email Verification)',
                    required: true,
                },
                {
                    name: 'slug',
                    label: 'Slug',
                    placeholder: 'Enter slug (e.g., email-verification)',
                    required: true,
                    description: 'URL-friendly identifier (lowercase, hyphens only)',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Describe when this OTP purpose is used',
                },
                {
                    name: 'expiry_seconds',
                    label: 'Expiry Time (seconds)',
                    type: 'number',
                    placeholder: '300',
                    required: true,
                    description: 'How long OTP is valid (default: 300 seconds = 5 minutes)',
                },
                {
                    name: 'max_attempts',
                    label: 'Max Attempts',
                    type: 'number',
                    placeholder: '3',
                    required: true,
                    description: 'Maximum verification attempts (default: 3)',
                },
                {
                    name: 'resend_cooldown_seconds',
                    label: 'Resend Cooldown (seconds)',
                    type: 'number',
                    placeholder: '60',
                    description: 'Cooldown between resend requests (default: 60 seconds)',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
            ],
            schema: createOTPPurposeSchema,
            onSubmit: async (data) => {
                try {
                    const res = await createOTPPurpose(data).unwrap();
                    showSnackbar(res.message || 'OTP purpose created successfully', 'success', 5000);
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
       2. EDIT OTP PURPOSE
    ============================================================ */
    const handleEditOTPPurpose = (otppurpose) => {
        showModal({
            title: 'Edit OTP Purpose',
            subtitle: otppurpose.name,
            subtitleLabel: 'Purpose Name',
            icon: <FiEdit />,
            submitText: 'Save Changes',
            size: 'md',
            defaultValues: {
                name: otppurpose.name || '',
                slug: otppurpose.slug || '',
                description: otppurpose.description || '',
                expiry_seconds: otppurpose.expiry_seconds,
                max_attempts: otppurpose.max_attempts,
                resend_cooldown_seconds: otppurpose.resend_cooldown_seconds,
                is_active: otppurpose.is_active,
            },
            fields: [
                {
                    name: 'name',
                    label: 'Purpose Name',
                    placeholder: 'Enter purpose name',
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
                    placeholder: 'Describe when this OTP purpose is used',
                },
                {
                    name: 'expiry_seconds',
                    label: 'Expiry Time (seconds)',
                    type: 'number',
                    placeholder: '300',
                    required: true,
                    description: 'How long OTP is valid',
                },
                {
                    name: 'max_attempts',
                    label: 'Max Attempts',
                    type: 'number',
                    placeholder: '3',
                    required: true,
                    description: 'Maximum verification attempts',
                },
                {
                    name: 'resend_cooldown_seconds',
                    label: 'Resend Cooldown (seconds)',
                    type: 'number',
                    placeholder: '60',
                    description: 'Cooldown between resend requests',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
            ],
            schema: editOTPPurposeSchema,
            onSubmit: async (data) => {
                try {
                    const res = await editOTPPurpose({
                        otppurpose_id: otppurpose.otppurpose_id,
                        data: data,
                    }).unwrap();
                    showSnackbar(res.message || 'OTP purpose updated successfully', 'success', 5000);
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
       3. DELETE OTP PURPOSE
    ============================================================ */
    const handleDeleteOTPPurpose = async (otppurpose_id, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete OTP Purpose',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            const res = await deleteOTPPurpose({
                otppurpose_id,
            }).unwrap();
            showSnackbar(res.message || 'OTP purpose deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(extractErrorMessage(error, 'Failed to delete OTP purpose'), 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    /* ============================================================
       4. TOGGLE STATUS
    ============================================================ */
    const handleToggleStatus = async (otppurpose_id, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Deactivate OTP Purpose' : 'Activate OTP Purpose',
                message: currentStatus
                    ? `"${name}" will be deactivated.`
                    : `"${name}" will be activated.`,
                confirmText: currentStatus ? 'Deactivate' : 'Activate',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });

            if (!ok) return;

            await editOTPPurpose({
                otppurpose_id,
                data: {
                    is_active: !currentStatus,
                },
            }).unwrap();

            showSnackbar(
                currentStatus
                    ? `"${name}" is now deactivated`
                    : `"${name}" is now activated`,
                'success',
                3000
            );
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(extractErrorMessage(error, `Failed to ${currentStatus ? 'deactivate' : 'activate'} OTP purpose`), 'error', 5000);
            }
        } finally {
            setIsToggling(false);
        }
    };

    /* ============================================================
       Listing helpers
    ============================================================ */
    const otppurposes = data?.data?.results || data?.results || [];
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
                { value: 'name', label: 'Name A-Z' },
                { value: '-name', label: 'Name Z-A' },
                { value: 'expiry_seconds', label: 'Expiry Time' },
                { value: '-expiry_seconds', label: 'Expiry Time (Descending)' },
            ],
        },
    ];

    // ---------- Loading / error ----------
    if (isLoading) return <Loader text="Loading OTP purposes..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load OTP purposes. Please try again.')}
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
                    <FiLock className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>OTP Purpose Management</h1>
                </div>
                <button
                    onClick={handleCreateOTPPurpose}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create OTP Purpose
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
                    dataLength: otppurposes.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <OTPPurposeTable
                    otppurposes={otppurposes}
                    onEdit={handleEditOTPPurpose}
                    onDelete={handleDeleteOTPPurpose}
                    onToggleStatus={handleToggleStatus}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {/* Loading Overlay */}
            {isFetching && otppurposes.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
