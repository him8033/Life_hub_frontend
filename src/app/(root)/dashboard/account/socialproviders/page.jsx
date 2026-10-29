'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import {
    FiLink,
    FiPlus,
    FiEdit,
} from 'react-icons/fi';
import SocialProviderTable from '@/components/dashboard/account/socialproviders/SocialProviderTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetSocialProviderListQuery,
    useCreateSocialProviderMutation,
    useEditSocialProviderMutation,
    useDeleteSocialProviderMutation,
} from '@/services/api/dashboard/account/socialproviders/socialproviderApi';
import { useModal } from '@/context/ModalContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useSnackbar } from '@/context/SnackbarContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';
import {
    createSocialProviderSchema,
    editSocialProviderSchema,
} from '@/lib/validations/dashboard/account/socialproviders/socialproviderValidation';

export default function SocialProvidersPage() {
    const showModal = useModal();
    const confirm = useConfirm();
    const { showSnackbar } = useSnackbar();

    // ---------- Mutations ----------
    const [createSocialProvider] = useCreateSocialProviderMutation();
    const [editSocialProvider] = useEditSocialProviderMutation();
    const [deleteSocialProvider] = useDeleteSocialProviderMutation();

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
    const { data, error, isLoading, isFetching, refetch } = useGetSocialProviderListQuery({
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
       1. CREATE SOCIAL PROVIDER
    ============================================================ */
    const handleCreateSocialProvider = () => {
        showModal({
            title: 'Create New Social Provider',
            subtitle: 'Add a new social provider to the system',
            subtitleLabel: 'Social Provider Management',
            icon: <FiPlus />,
            submitText: 'Create Social Provider',
            size: 'md',
            defaultValues: {
                name: '',
                slug: '',
                description: '',
                is_active: true,
                provider_metadata: {},
            },
            fields: [
                {
                    name: 'name',
                    label: 'Provider Name',
                    placeholder: 'Enter provider name (e.g., Google)',
                    required: true,
                },
                {
                    name: 'slug',
                    label: 'Slug',
                    placeholder: 'Enter slug (e.g., google)',
                    required: true,
                    description: 'URL-friendly identifier (lowercase, hyphens only)',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Describe the social provider',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
                {
                    name: 'provider_metadata',
                    label: 'Provider Metadata (JSON)',
                    type: 'textarea',
                    rows: 4,
                    placeholder: '{"client_id": "...", "client_secret": "..."}',
                    description: 'Provider-specific configuration (JSON format)',
                },
            ],
            schema: createSocialProviderSchema,
            onSubmit: async (data) => {
                try {
                    // Parse JSON metadata if provided
                    let metadata = {};
                    if (data.provider_metadata && typeof data.provider_metadata === 'string') {
                        try {
                            metadata = JSON.parse(data.provider_metadata);
                        } catch (e) {
                            throw new Error('Invalid JSON format for provider metadata');
                        }
                    } else if (data.provider_metadata) {
                        metadata = data.provider_metadata;
                    }

                    await createSocialProvider({
                        ...data,
                        provider_metadata: metadata,
                    }).unwrap();
                    showSnackbar('Social provider created successfully', 'success', 5000);
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
       2. EDIT SOCIAL PROVIDER
    ============================================================ */
    const handleEditSocialProvider = (socialprovider) => {
        showModal({
            title: 'Edit Social Provider',
            subtitle: socialprovider.name,
            subtitleLabel: 'Provider Name',
            icon: <FiEdit />,
            submitText: 'Save Changes',
            size: 'md',
            defaultValues: {
                name: socialprovider.name || '',
                slug: socialprovider.slug || '',
                description: socialprovider.description || '',
                is_active: socialprovider.is_active,
                provider_metadata: socialprovider.provider_metadata ? JSON.stringify(socialprovider.provider_metadata, null, 2) : '',
            },
            fields: [
                {
                    name: 'name',
                    label: 'Provider Name',
                    placeholder: 'Enter provider name',
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
                    placeholder: 'Describe the social provider',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
                {
                    name: 'provider_metadata',
                    label: 'Provider Metadata (JSON)',
                    type: 'textarea',
                    rows: 4,
                    placeholder: '{"client_id": "...", "client_secret": "..."}',
                    description: 'Provider-specific configuration (JSON format)',
                },
            ],
            schema: editSocialProviderSchema,
            onSubmit: async (data) => {
                try {
                    // Parse JSON metadata if provided
                    let metadata = {};
                    if (data.provider_metadata && data.provider_metadata.trim()) {
                        try {
                            metadata = JSON.parse(data.provider_metadata);
                        } catch (e) {
                            throw new Error('Invalid JSON format for provider metadata');
                        }
                    }

                    await editSocialProvider({
                        socialprovider_id: socialprovider.socialprovider_id,
                        data: {
                            ...data,
                            provider_metadata: metadata,
                        },
                    }).unwrap();
                    showSnackbar('Social provider updated successfully', 'success', 5000);
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
       3. DELETE SOCIAL PROVIDER
    ============================================================ */
    const handleDeleteSocialProvider = async (socialprovider_id, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Social Provider',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            const res = await deleteSocialProvider({
                socialprovider_id,
            }).unwrap();
            showSnackbar(res.message || 'Social provider deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(extractErrorMessage(error, 'Failed to delete social provider'), 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    /* ============================================================
       4. TOGGLE STATUS
    ============================================================ */
    const handleToggleStatus = async (socialprovider_id, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Deactivate Social Provider' : 'Activate Social Provider',
                message: currentStatus
                    ? `"${name}" will be deactivated.`
                    : `"${name}" will be activated.`,
                confirmText: currentStatus ? 'Deactivate' : 'Activate',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });

            if (!ok) return;

            await editSocialProvider({
                socialprovider_id,
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
                showSnackbar(extractErrorMessage(error, `Failed to ${currentStatus ? 'deactivate' : 'activate'} social provider`), 'error', 5000);
            }
        } finally {
            setIsToggling(false);
        }
    };

    /* ============================================================
       Listing helpers
    ============================================================ */
    const socialproviders = data?.data?.results || data?.results || [];
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
            ],
        },
    ];

    // ---------- Loading / error ----------
    if (isLoading) return <Loader text="Loading social providers..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load social providers. Please try again.')}
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
                    <FiLink className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Social Provider Management</h1>
                </div>
                <button
                    onClick={handleCreateSocialProvider}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Social Provider
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
                    dataLength: socialproviders.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <SocialProviderTable
                    socialproviders={socialproviders}
                    onEdit={handleEditSocialProvider}
                    onDelete={handleDeleteSocialProvider}
                    onToggleStatus={handleToggleStatus}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {/* Loading Overlay */}
            {isFetching && socialproviders.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
