'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import {
    FiKey,
    FiPlus,
    FiEdit,
} from 'react-icons/fi';
import PermissionTable from '@/components/dashboard/account/permissions/PermissionTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetPermissionListQuery,
    useCreatePermissionMutation,
    useEditPermissionMutation,
    useDeletePermissionMutation,
} from '@/services/api/dashboard/account/permissions/permissionApi';
import { useModal } from '@/context/ModalContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useSnackbar } from '@/context/SnackbarContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';
import {
    createPermissionSchema,
    editPermissionSchema
} from '@/lib/validations/dashboard/account/permissions/permissionValidation';

export default function PermissionsPage() {
    const showModal = useModal();
    const confirm = useConfirm();
    const { showSnackbar } = useSnackbar();

    // ---------- Mutations ----------
    const [createPermission] = useCreatePermissionMutation();
    const [editPermission] = useEditPermissionMutation();
    const [deletePermission] = useDeletePermissionMutation();

    // Form ref for backend error handling
    let formRef = null;

    // ---------- Search / sort / filters ----------
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('module,name');
    const [filters, setFilters] = useState({
        is_active: '',
        module: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // ---------- Operation states ----------
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    // ---------- API ----------
    const { data, error, isLoading, isFetching, refetch } = useGetPermissionListQuery({
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
        setFilters({ is_active: '', module: '' });
        setOrdering('module,name');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    /* ============================================================
       1. CREATE PERMISSION
    ============================================================ */
    const handleCreatePermission = () => {
        showModal({
            title: 'Create New Permission',
            subtitle: 'Add a new permission to the system',
            subtitleLabel: 'Permission Management',
            icon: <FiPlus />,
            submitText: 'Create Permission',
            size: 'md',
            defaultValues: {
                name: '',
                slug: '',
                module: '',
                description: '',
                is_active: true,
            },
            fields: [
                {
                    name: 'name',
                    label: 'Permission Name',
                    placeholder: 'Enter permission name (e.g., Create User)',
                    required: true,
                },
                {
                    name: 'slug',
                    label: 'Slug',
                    placeholder: 'Enter slug (e.g., create)',
                    required: true,
                    description: 'URL-friendly identifier (lowercase, hyphens only)',
                },
                {
                    name: 'module',
                    label: 'Module',
                    placeholder: 'Enter module (e.g., user)',
                    description: 'Module this permission belongs to (e.g., user, role, account)',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Describe what this permission allows',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
            ],
            schema: createPermissionSchema,
            onSubmit: async (data) => {
                try {
                    const res = await createPermission(data).unwrap();
                    showSnackbar(res.message || 'Permission created successfully', 'success', 5000);
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
       2. EDIT PERMISSION
    ============================================================ */
    const handleEditPermission = (permission) => {
        showModal({
            title: 'Edit Permission',
            subtitle: permission.name,
            subtitleLabel: 'Permission Name',
            icon: <FiEdit />,
            submitText: 'Save Changes',
            size: 'md',
            defaultValues: {
                name: permission.name || '',
                slug: permission.slug || '',
                module: permission.module || '',
                description: permission.description || '',
                is_active: permission.is_active,
            },
            fields: [
                {
                    name: 'name',
                    label: 'Permission Name',
                    placeholder: 'Enter permission name',
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
                    name: 'module',
                    label: 'Module',
                    placeholder: 'Enter module',
                    description: 'Module this permission belongs to',
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Describe what this permission allows',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
            ],
            schema: editPermissionSchema,
            onSubmit: async (data) => {
                try {
                    const res = await editPermission({
                        permission_id: permission.permission_id,
                        data: data,
                    }).unwrap();
                    showSnackbar(res.message || 'Permission updated successfully', 'success', 5000);
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
       3. DELETE PERMISSION
    ============================================================ */
    const handleDeletePermission = async (permission_id, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Permission',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            const res = await deletePermission({
                permission_id,
            }).unwrap();
            showSnackbar(res.message || 'Permission deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(extractErrorMessage(error, 'Failed to delete permission'), 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    /* ============================================================
       4. TOGGLE STATUS
    ============================================================ */
    const handleToggleStatus = async (permission_id, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Deactivate Permission' : 'Activate Permission',
                message: currentStatus
                    ? `"${name}" will be deactivated.`
                    : `"${name}" will be activated.`,
                confirmText: currentStatus ? 'Deactivate' : 'Activate',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });

            if (!ok) return;

            await editPermission({
                permission_id,
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
                showSnackbar(extractErrorMessage(error, `Failed to ${currentStatus ? 'deactivate' : 'activate'} permission`), 'error', 5000);
            }
        } finally {
            setIsToggling(false);
        }
    };

    /* ============================================================
       Listing helpers
    ============================================================ */
    const permissions = data?.data?.results || data?.results || [];
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
            value: filters.module,
            onChange: (v) => handleFilterChange('module', v),
            options: [
                { value: '', label: 'All Modules' },
                { value: 'user', label: 'User' },
                { value: 'role', label: 'Role' },
                { value: 'account', label: 'Account' },
                { value: 'permission', label: 'Permission' },
            ],
        },
        {
            value: ordering,
            onChange: (v) => setOrdering(v),
            options: [
                { value: 'module,name', label: 'Module, Name' },
                { value: '-module,name', label: 'Module, Name (Descending)' },
                { value: 'name', label: 'Name A-Z' },
                { value: '-name', label: 'Name Z-A' },
            ],
        },
    ];

    // ---------- Loading / error ----------
    if (isLoading) return <Loader text="Loading permissions..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load permissions. Please try again.')}
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
                    <FiKey className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Permission Management</h1>
                </div>
                <button
                    onClick={handleCreatePermission}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Permission
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
                    dataLength: permissions.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <PermissionTable
                    permissions={permissions}
                    onEdit={handleEditPermission}
                    onDelete={handleDeletePermission}
                    onToggleStatus={handleToggleStatus}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {/* Loading Overlay */}
            {isFetching && permissions.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
