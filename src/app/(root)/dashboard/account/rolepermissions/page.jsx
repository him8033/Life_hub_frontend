'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import {
    FiKey,
    FiPlus,
} from 'react-icons/fi';
import RolePermissionTable from '@/components/dashboard/account/rolepermissions/RolePermissionTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetRolePermissionListQuery,
    useCreateRolePermissionMutation,
    useDeleteRolePermissionMutation,
} from '@/services/api/dashboard/account/rolepermissions/rolepermissionApi';
import {
    useGetRoleListQuery,
} from '@/services/api/dashboard/account/roles/roleApi';
import {
    useGetPermissionListQuery,
} from '@/services/api/dashboard/account/permissions/permissionApi';
import { useModal } from '@/context/ModalContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useSnackbar } from '@/context/SnackbarContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import { createRolePermissionSchema } from '@/lib/validations/dashboard/account/rolepermissions/rolepermissionValidation';
import styles from '@/styles/common/CommonListing.module.css';

export default function RolePermissionsPage() {
    const showModal = useModal();
    const confirm = useConfirm();
    const { showSnackbar } = useSnackbar();

    const [createRolePermission] = useCreateRolePermissionMutation();
    const [deleteRolePermission] = useDeleteRolePermissionMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('role__name,permission__name');
    const [filters, setFilters] = useState({
        role: '',
        permission: '',
        module: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, error, isLoading, isFetching, refetch } = useGetRolePermissionListQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    // Fetch roles and permissions for dropdowns
    const { data: rolesData } = useGetRoleListQuery({
        page: 1,
        page_size: 100,
        is_active: 'true',
    });

    const { data: permissionsData } = useGetPermissionListQuery({
        page: 1,
        page_size: 100,
        is_active: 'true',
    });

    // Transform data for form options
    const roleOptions = (rolesData?.data?.results || rolesData?.results || [])
        .filter(role => role.is_active)
        .map(role => ({
            value: role.slug,
            label: role.name,
        }));

    const permissionOptions = (permissionsData?.data?.results || permissionsData?.results || [])
        .filter(permission => permission.is_active)
        .map(permission => ({
            value: permission.slug,
            label: `${permission.module ? permission.module + '.' : ''}${permission.name}`,
        }));

    // Get unique modules for filter
    const moduleOptions = Array.from(
        new Set(
            (permissionsData?.data?.results || permissionsData?.results || [])
                .filter(p => p.module)
                .map(p => p.module)
        )
    ).map(module => ({ value: module, label: module }));

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
        setFilters({ role: '', permission: '', module: '' });
        setOrdering('role__name,permission__name');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    /* ============================================================
       1. CREATE ROLE PERMISSION
    ============================================================ */
    const handleCreateRolePermission = () => {
        let formRef = null;
        showModal({
            title: 'Assign Permission to Role',
            subtitle: 'Grant a permission to a role',
            subtitleLabel: 'Role Permission Management',
            icon: <FiPlus />,
            submitText: 'Assign Permission',
            size: 'md',
            defaultValues: {
                role_slug: '',
                permission_slug: '',
            },
            fields: [
                {
                    name: 'role_slug',
                    label: 'Role',
                    type: 'select',
                    placeholder: 'Select a role',
                    required: true,
                    options: roleOptions,
                },
                {
                    name: 'permission_slug',
                    label: 'Permission',
                    type: 'select',
                    placeholder: 'Select a permission',
                    required: true,
                    options: permissionOptions,
                },
            ],
            schema: createRolePermissionSchema,
            onSubmit: async (data) => {
                try {
                    const res = await createRolePermission(data).unwrap();
                    showSnackbar(res.message || 'Permission assigned to role successfully', 'success', 5000);
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
       2. DELETE ROLE PERMISSION
    ============================================================ */
    const handleDeleteRolePermission = async (rolepermission_id, role_name, permission_name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Remove Permission from Role',
                message: `Are you sure you want to remove "${permission_name}" from "${role_name}"? This action cannot be undone.`,
                confirmText: 'Remove',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            await deleteRolePermission({
                rolepermission_id,
            }).unwrap();
            showSnackbar('Permission removed from role successfully', 'success', 5000);
            refetch();
        } catch (err) {
            const backendErrors = err?.data?.errors;
            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(extractErrorMessage(err, 'Failed to remove permission from role'), 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const rolepermissions = data?.data?.results || data?.results || [];
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
            value: filters.role,
            onChange: (v) => handleFilterChange('role', v),
            options: [
                { value: '', label: 'All Roles' },
                ...roleOptions,
            ],
        },
        {
            value: filters.permission,
            onChange: (v) => handleFilterChange('permission', v),
            options: [
                { value: '', label: 'All Permissions' },
                ...permissionOptions,
            ],
        },
        {
            value: filters.module,
            onChange: (v) => handleFilterChange('module', v),
            options: [
                { value: '', label: 'All Modules' },
                ...moduleOptions,
            ],
        },
        {
            value: ordering,
            onChange: (v) => setOrdering(v),
            options: [
                { value: 'role__name,permission__name', label: 'Role, Permission' },
                { value: '-role__name,permission__name', label: 'Role, Permission (Descending)' },
                { value: 'permission__name', label: 'Permission Name' },
                { value: '-permission__name', label: 'Permission Name (Descending)' },
            ],
        },
    ];

    if (isLoading) return <Loader text="Loading role permissions..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load role permissions. Please try again.')}
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
                    <h1 className={styles.pageTitle}>Role Permissions</h1>
                </div>
                <button
                    onClick={handleCreateRolePermission}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Assign Permission
                </button>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: 'Search by role or permission...',
                    size: 'md',
                    showFilterButton: false,
                }}
                paginationProps={{
                    dataLength: rolepermissions.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <RolePermissionTable
                    rolepermissions={rolepermissions}
                    onDelete={handleDeleteRolePermission}
                    isLoading={isDeleting || isFetching}
                />
            </TableLayout>

            {isFetching && rolepermissions.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
