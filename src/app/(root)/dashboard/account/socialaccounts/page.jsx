'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import {
    FiLink,
    FiPlus,
    FiEdit,
} from 'react-icons/fi';
import SocialAccountTable from '@/components/dashboard/account/socialaccounts/SocialAccountTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetSocialAccountListQuery,
    useCreateSocialAccountMutation,
    useEditSocialAccountMutation,
    useDeleteSocialAccountMutation,
} from '@/services/api/dashboard/account/socialaccounts/socialaccountApi';
import {
    useGetUserListQuery,
} from '@/services/api/dashboard/account/users/userApi';
import {
    useGetSocialProviderListQuery,
} from '@/services/api/dashboard/account/socialproviders/socialproviderApi';
import { useModal } from '@/context/ModalContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useSnackbar } from '@/context/SnackbarContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';
import {
    createSocialAccountSchema,
    editSocialAccountSchema,
} from '@/lib/validations/dashboard/account/socialaccounts/socialaccountValidation';

export default function SocialAccountsPage() {
    const showModal = useModal();
    const confirm = useConfirm();
    const { showSnackbar } = useSnackbar();

    const [createSocialAccount] = useCreateSocialAccountMutation();
    const [editSocialAccount] = useEditSocialAccountMutation();
    const [deleteSocialAccount] = useDeleteSocialAccountMutation();

    // Form ref for backend error handling
    let formRef = null;

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-linked_at');
    const [filters, setFilters] = useState({
        provider: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, error, isLoading, isFetching, refetch } = useGetSocialAccountListQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    // Fetch users and providers for dropdowns
    const { data: usersData } = useGetUserListQuery({
        page: 1,
        page_size: 100,
    });

    const { data: providersData } = useGetSocialProviderListQuery({
        page: 1,
        page_size: 100,
        is_active: 'true',
    });

    // Transform data for form options
    const userOptions = (usersData?.data?.results || usersData?.results || [])
        .map(user => ({
            value: user.user_id,
            label: user.email,
        }));

    const providerOptions = (providersData?.data?.results || providersData?.results || [])
        .filter(provider => provider.is_active)
        .map(provider => ({
            value: provider.slug,
            label: provider.name,
        }));

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const handleClearFilters = () => {
        setSearchTerm('');
        setDebouncedSearch('');
        setFilters({ provider: '' });
        setOrdering('-linked_at');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    /* ============================================================
       1. CREATE SOCIAL ACCOUNT
    ============================================================ */
    const handleCreateSocialAccount = () => {
        showModal({
            title: 'Create Social Account',
            subtitle: 'Manually add a social account for a user',
            subtitleLabel: 'Social Account Management',
            icon: <FiPlus />,
            submitText: 'Create Social Account',
            size: 'md',
            defaultValues: {
                user_id: '',
                provider_slug: '',
                provider_user_id: '',
                provider_email: '',
                provider_username: '',
                avatar_url: '',
                provider_metadata: '',
            },
            fields: [
                {
                    name: 'user_id',
                    label: 'User',
                    type: 'select',
                    placeholder: 'Select a user',
                    required: true,
                    options: userOptions,
                },
                {
                    name: 'provider_slug',
                    label: 'Provider',
                    type: 'select',
                    placeholder: 'Select a provider',
                    required: true,
                    options: providerOptions,
                },
                {
                    name: 'provider_user_id',
                    label: 'Provider User ID',
                    placeholder: 'Enter provider user ID',
                    required: true,
                    description: 'Unique user ID from the provider (e.g., Google ID, GitHub ID)',
                },
                {
                    name: 'provider_email',
                    label: 'Provider Email',
                    placeholder: 'Enter provider email',
                    description: 'Email from the provider (may be unverified)',
                },
                {
                    name: 'provider_username',
                    label: 'Provider Username',
                    placeholder: 'Enter provider username',
                },
                {
                    name: 'avatar_url',
                    label: 'Avatar URL',
                    placeholder: 'Enter avatar URL',
                },
                {
                    name: 'provider_metadata',
                    label: 'Provider Metadata (JSON)',
                    type: 'textarea',
                    rows: 4,
                    placeholder: '{"additional_data": "..."}',
                    description: 'Additional data from the provider (JSON format)',
                },
            ],
            schema: createSocialAccountSchema,
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

                    const res = await createSocialAccount({
                        ...data,
                        provider_metadata: metadata,
                    }).unwrap();
                    showSnackbar(res.message || 'Social account created successfully', 'success', 5000);
                    refetch();
                } catch (err) {
                    const backendErrors = err?.data?.errors;
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
                        throw err;
                    }
                }
            },
            onBackendError: (form) => {
                formRef = form;
            },
        });
    };

    /* ============================================================
       2. EDIT SOCIAL ACCOUNT
    ============================================================ */
    const handleEditSocialAccount = (socialaccount) => {
        showModal({
            title: 'Edit Social Account',
            subtitle: `${socialaccount.user_email} - ${socialaccount.provider_name}`,
            subtitleLabel: 'Social Account',
            icon: <FiEdit />,
            submitText: 'Save Changes',
            size: 'md',
            defaultValues: {
                provider_user_id: socialaccount.provider_user_id || '',
                provider_email: socialaccount.provider_email || '',
                provider_username: socialaccount.provider_username || '',
                avatar_url: socialaccount.avatar_url || '',
                provider_metadata: socialaccount.provider_metadata ? JSON.stringify(socialaccount.provider_metadata, null, 2) : '',
            },
            fields: [
                {
                    name: 'provider_user_id',
                    label: 'Provider User ID',
                    placeholder: 'Enter provider user ID',
                    required: true,
                },
                {
                    name: 'provider_email',
                    label: 'Provider Email',
                    placeholder: 'Enter provider email',
                },
                {
                    name: 'provider_username',
                    label: 'Provider Username',
                    placeholder: 'Enter provider username',
                },
                {
                    name: 'avatar_url',
                    label: 'Avatar URL',
                    placeholder: 'Enter avatar URL',
                },
                {
                    name: 'provider_metadata',
                    label: 'Provider Metadata (JSON)',
                    type: 'textarea',
                    rows: 4,
                    placeholder: '{"additional_data": "..."}',
                },
            ],
            schema: editSocialAccountSchema,
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

                    await editSocialAccount({
                        socialaccount_id: socialaccount.socialaccount_id,
                        data: {
                            ...data,
                            provider_metadata: metadata,
                        },
                    }).unwrap();
                    showSnackbar('Social account updated successfully', 'success', 5000);
                    refetch();
                } catch (err) {
                    const backendErrors = err?.data?.errors;
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
                        throw err;
                    }
                }
            },
            onBackendError: (form) => {
                formRef = form;
            },
        });
    };

    /* ============================================================
       3. DELETE SOCIAL ACCOUNT
    ============================================================ */
    const handleDeleteSocialAccount = async (socialaccount_id, user_email, provider_name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Social Account',
                message: `Are you sure you want to delete ${user_email}'s ${provider_name} account? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            const res = await deleteSocialAccount({
                socialaccount_id,
            }).unwrap();
            showSnackbar(res.message || 'Social account deleted successfully', 'success', 5000);
            refetch();
        } catch (err) {
            const backendErrors = err?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(extractErrorMessage(err, 'Failed to delete social account'), 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const socialaccounts = data?.data?.results || data?.results || [];
    const pagination = data?.data?.pagination || {};
    const totalCount = pagination.total ?? data?.data?.count ?? data?.count ?? 0;
    const totalPages = pagination.total_pages ?? Math.max(1, Math.ceil(totalCount / pageSize));

    const handlePageChange = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };
    const handlePageSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    const headerFilters = [
        {
            value: filters.provider,
            onChange: (v) => handleFilterChange('provider', v),
            options: [
                { value: '', label: 'All Providers' },
                ...providerOptions,
            ],
        },
        {
            value: ordering,
            onChange: (v) => setOrdering(v),
            options: [
                { value: '-linked_at', label: 'Newest First' },
                { value: 'linked_at', label: 'Oldest First' },
            ],
        },
    ];

    if (isLoading) return <Loader text="Loading social accounts..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load social accounts. Please try again.')}
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
                    <h1 className={styles.pageTitle}>Social Accounts</h1>
                </div>
                <button
                    onClick={handleCreateSocialAccount}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Social Account
                </button>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: 'Search by user email or provider...',
                    size: 'md',
                    showFilterButton: false,
                }}
                paginationProps={{
                    dataLength: socialaccounts.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <SocialAccountTable
                    socialaccounts={socialaccounts}
                    onEdit={handleEditSocialAccount}
                    onDelete={handleDeleteSocialAccount}
                    isLoading={isDeleting || isFetching}
                />
            </TableLayout>

            {isFetching && socialaccounts.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
