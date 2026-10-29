'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { z } from 'zod';
import {
    FiUsers,
    FiPlus,
    FiEdit,
    FiLock,
    FiAlertTriangle,
} from 'react-icons/fi';
import TableLayout from '@/components/common/table/TableLayout';
import UserTable from '@/components/dashboard/account/users/UserTable';
import {
    useGetUserListQuery,
    useCreateUserMutation,
    useEditUserMutation,
    useUpdateUserStatusMutation,
    useDeleteUserMutation,
} from '@/services/api/dashboard/account/users/userApi';
import {
    useGetRoleListQuery,
} from '@/services/api/dashboard/account/roles/roleApi';
import {
    useGetStatusListQuery,
} from '@/services/api/dashboard/account/status/statusApi';
import { useModal } from '@/context/ModalContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useSnackbar } from '@/context/SnackbarContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';
import {
    createUserSchema,
    editUserSchema,
    updateUserStatusSchema,
    deleteUserSchema,
} from '@/lib/validations/dashboard/account/users/userValidation';
export default function UsersPage() {
    const showModal = useModal();
    const confirm = useConfirm();
    const { showSnackbar } = useSnackbar();

    // ---------- Mutations ----------
    const [createUser] = useCreateUserMutation();
    const [editUser] = useEditUserMutation();
    const [updateStatus] = useUpdateUserStatusMutation();
    const [deleteUser] = useDeleteUserMutation();

    // Form ref for backend error handling
    const formRef = useRef(null);

    // ---------- Search / sort / filters ----------
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [ordering, setOrdering] = useState('-created_at');
    const [filters, setFilters] = useState({
        status: '',
        role: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // ---------- API ----------
    const { data, error, isLoading, isFetching, refetch } = useGetUserListQuery({
        page: currentPage,
        page_size: pageSize,
        ordering,
        search: debouncedSearch,
        ...filters,
    });

    // Fetch roles and statuses for dropdowns
    const { data: rolesData } = useGetRoleListQuery({
        page: 1,
        page_size: 100,
        is_active: 'true',
    });

    const { data: statusesData } = useGetStatusListQuery({
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

    const statusOptions = (statusesData?.data?.results || statusesData?.results || [])
        .filter(status => status.is_active)
        .map(status => ({
            value: status.slug,
            label: status.name,
        }));

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
        setFilters({ status: '', role: '' });
        setOrdering('-created_at');
        setCurrentPage(1);
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    /* ============================================================
       0. CREATE USER — admin creates user without OTP
    ============================================================ */
    const handleCreateUser = () => {
        showModal({
            title: 'Create New User',
            subtitle: 'User will be created with pending status',
            subtitleLabel: 'Status',
            icon: <FiPlus />,
            submitText: 'Create User',
            size: 'md',
            defaultValues: {
                email: '',
                first_name: '',
                last_name: '',
                phone_number: '',
                password: '',
                confirm_password: '',
                roles: roleOptions.length > 0 ? [roleOptions[0].value] : ['user'],
                send_email: false,
            },
            fields: [
                {
                    name: 'email',
                    label: 'Email Address',
                    type: 'email',
                    placeholder: 'Enter email address',
                    required: true,
                },
                {
                    name: 'first_name',
                    label: 'First Name',
                    placeholder: 'Enter first name',
                },
                {
                    name: 'last_name',
                    label: 'Last Name',
                    placeholder: 'Enter last name',
                },
                {
                    name: 'phone_number',
                    label: 'Phone Number',
                    placeholder: 'Enter phone number',
                },
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Enter password (min 8 characters)',
                    required: true,
                    autoComplete: 'new-password',
                },
                {
                    name: 'confirm_password',
                    label: 'Confirm Password',
                    type: 'password',
                    placeholder: 'Confirm password',
                    required: true,
                    autoComplete: 'new-password',
                },
                {
                    name: 'roles',
                    label: 'Roles',
                    type: 'checkbox-group',
                    options: roleOptions.length > 0 ? roleOptions : [
                        { value: 'user', label: 'User' },
                    ],
                },
                {
                    name: 'send_email',
                    label: 'Send welcome email with login credentials',
                    type: 'checkbox',
                },
            ],
            schema: createUserSchema,
            onSubmit: async (data) => {
                try {
                    const res = await createUser({
                        email: data.email,
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        phone_number: data.phone_number || '',
                        password: data.password,
                        confirm_password: data.confirm_password,
                        roles: data.roles && data.roles.length > 0 ? data.roles : (roleOptions.length > 0 ? [roleOptions[0].value] : ['user']),
                        send_email: !!data.send_email,
                    }).unwrap();
                    showSnackbar(res.message || 'User created successfully with pending status', 'success', 5000);
                    refetch();
                } catch (error) {
                    const backendErrors = error?.data?.errors;
                    if (backendErrors?.field_errors && formRef.current) {
                        Object.entries(backendErrors.field_errors).forEach(([field, messages]) => {
                            formRef.current.setError(field, { type: 'server', message: messages[0] });
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
                formRef.current = form;
            },
        });
    };

    /* ============================================================
       1. EDIT — profile + roles + password in one call
    ============================================================ */
    const handleEditUser = (user) => {
        const originalRoles = user.roles || [];

        // Convert role slugs to role IDs for the form
        const userRoleSlugs = originalRoles.map(role => typeof role === 'string' ? role : role.slug);

        // Get default roles from available active roles
        const defaultRoles = roleOptions.length > 0
            ? userRoleSlugs.filter(slug => roleOptions.some(opt => opt.value === slug))
            : ['user'];

        showModal({
            title: 'Edit User',
            subtitle: user.email,
            subtitleLabel: 'User Email',
            icon: <FiEdit />,
            submitText: 'Save Changes',
            size: 'md',
            defaultValues: {
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number || '',
                roles: defaultRoles,
                new_password: '',
                confirm_password: '',
                send_email: false,
            },
            fields: [
                {
                    name: 'first_name',
                    label: 'First Name',
                    placeholder: 'Enter first name',
                },
                {
                    name: 'last_name',
                    label: 'Last Name',
                    placeholder: 'Enter last name',
                },
                {
                    name: 'phone_number',
                    label: 'Phone Number',
                    placeholder: 'Enter phone number',
                },
                {
                    name: 'roles',
                    label: 'Roles',
                    type: 'checkbox-group',
                    options: roleOptions.length > 0 ? roleOptions : [
                        { value: 'user', label: 'User' },
                    ],
                },
                {
                    name: 'new_password',
                    label: 'New Password (optional)',
                    type: 'password',
                    placeholder: 'Leave blank to keep current password',
                    autoComplete: 'new-password',
                    description: 'Filling this will revoke all active sessions for this user.',
                },
                {
                    name: 'confirm_password',
                    label: 'Confirm New Password',
                    type: 'password',
                    placeholder: 'Confirm new password',
                    autoComplete: 'new-password',
                },
                {
                    name: 'send_email',
                    label: 'Send email notification to user',
                    type: 'checkbox',
                },
            ],
            schema: editUserSchema,
            onSubmit: async (data) => {
                // Build a diff-based payload so we only send what changed.
                // This avoids triggering permission checks for untouched
                // sections (e.g. role.manage when roles are unchanged).
                const payload = {
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    phone_number: data.phone_number || '',
                    send_email: !!data.send_email,
                };

                // Roles — only if changed
                const rolesChanged =
                    JSON.stringify([...(data.roles || [])].sort()) !==
                    JSON.stringify([...originalRoles].sort());
                if (rolesChanged) {
                    payload.roles = data.roles;
                }

                // Password — only if filled
                if (data.new_password) {
                    payload.new_password = data.new_password;
                    payload.confirm_password = data.confirm_password;
                }

                try {
                    const res = await editUser({
                        user_id: user.user_id,
                        data: payload,
                    }).unwrap();
                    showSnackbar(res.message || 'User updated successfully', 'success', 5000);
                    refetch();
                } catch (error) {
                    const backendErrors = error?.data?.errors;
                    if (backendErrors?.field_errors && formRef.current) {
                        Object.entries(backendErrors.field_errors).forEach(([field, messages]) => {
                            formRef.current.setError(field, { type: 'server', message: messages[0] });
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
                formRef.current = form;
            },
        });
    };

    /* ============================================================
       2. UPDATE STATUS — unified (active / pending / blocked / suspended)
       Reason is optional for all statuses.
    ============================================================ */
    const handleUpdateStatus = (user) => {
        // Get the status slug from user object
        const userStatusSlug = typeof user.status === 'string' ? user.status : user.status?.slug || '';

        showModal({
            title: 'Update User Status',
            subtitle: user.email,
            subtitleLabel: 'User Email',
            icon: <FiLock />,
            submitText: 'Update Status',
            defaultValues: {
                status_slug: userStatusSlug || (statusOptions.length > 0 ? statusOptions[0].value : 'active'),
                reason: '',
                send_email: false,
            },
            fields: [
                {
                    name: 'status_slug',
                    label: 'Select Status',
                    type: 'select',
                    placeholder: 'Select a status',
                    emptyOptionLabel: 'Select a status',
                    options: statusOptions.length > 0 ? statusOptions : [
                        { value: 'active', label: 'Active' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'blocked', label: 'Blocked' },
                        { value: 'suspended', label: 'Suspended' },
                    ],
                },
                {
                    name: 'reason',
                    label: 'Reason (Optional)',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Explain why this status change is being made...',
                    description:
                        'Shared with the user when email notification is enabled.',
                },
                {
                    name: 'send_email',
                    label: 'Send email notification to user',
                    type: 'checkbox',
                },
            ],
            schema: updateUserStatusSchema,
            onSubmit: async (data) => {
                try {
                    const res = await updateStatus({
                        user_id: user.user_id,
                        data: {
                            status_slug: data.status_slug,
                            reason: data.reason || '',
                            send_email: !!data.send_email,
                        },
                    }).unwrap();
                    showSnackbar(res.message || 'User status updated successfully', 'success', 5000);
                    refetch();
                } catch (error) {
                    const backendErrors = error?.data?.errors;
                    if (backendErrors?.field_errors && formRef.current) {
                        Object.entries(backendErrors.field_errors).forEach(([field, messages]) => {
                            formRef.current.setError(field, { type: 'server', message: messages[0] });
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
                formRef.current = form;
            },
        });
    };

    /* ============================================================
       3. DELETE — soft / permanent + reason
    ============================================================ */
    const handleDeleteUser = async (user) => {
        // const ok = await confirm({
        //     title: 'Delete User',
        //     message: `Are you sure you want to delete "${user.email}"? This action cannot be undone.`,
        //     confirmText: 'Continue',
        //     cancelText: 'Cancel',
        //     type: 'danger',
        // });
        // if (!ok) return;

        showModal({
            title: 'Delete User',
            subtitle: user.email,
            subtitleLabel: 'User Email',
            icon: <FiAlertTriangle />,
            iconColor: 'var(--error)',
            variant: 'danger',
            submitText: 'Delete User',
            defaultValues: { permanent: false, reason: '', send_email: false },
            fields: [
                {
                    name: 'permanent',
                    label: 'Permanent delete (cannot be recovered)',
                    type: 'checkbox',
                },
                {
                    name: 'reason',
                    label: 'Reason (Optional)',
                    type: 'textarea',
                    rows: 3,
                    placeholder: 'Provide a reason for deletion...',
                },
                {
                    name: 'send_email',
                    label: 'Send email notification to user',
                    type: 'checkbox',
                },
            ],
            schema: deleteUserSchema,
            onSubmit: async (data) => {
                try {
                    const res = await deleteUser({
                        user_id: user.user_id,
                        data: {
                            permanent: !!data.permanent,
                            reason: data.reason || '',
                            send_email: !!data.send_email,
                        },
                    }).unwrap();
                    showSnackbar(
                        res.message || (data.permanent
                            ? 'User permanently deleted'
                            : 'User deleted successfully'),
                        'success',
                        5000
                    );
                    refetch();
                } catch (error) {
                    const backendErrors = error?.data?.errors;
                    if (backendErrors?.field_errors && formRef.current) {
                        Object.entries(backendErrors.field_errors).forEach(([field, messages]) => {
                            formRef.current.setError(field, { type: 'server', message: messages[0] });
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
                formRef.current = form;
            },
        });
    };

    /* ============================================================
       Listing helpers
    ============================================================ */
    const users = data?.data?.users || data?.data?.results || data?.results || [];
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

    // ---------- Header filters (only status, role, sort — backend supports these) ----------
    const headerFilters = [
        {
            value: filters.status,
            onChange: (v) => handleFilterChange('status', v),
            options: [
                { value: '', label: 'All Status' },
                ...statusOptions,
            ],
        },
        {
            value: filters.role,
            onChange: (v) => handleFilterChange('role', v),
            options: [
                { value: '', label: 'All Roles' },
                ...roleOptions,
            ],
        },
        {
            value: ordering,
            onChange: (v) => setOrdering(v),
            options: [
                { value: '-created_at', label: 'Newest First' },
                { value: 'created_at', label: 'Oldest First' },
                { value: 'email', label: 'Email A-Z' },
                { value: '-email', label: 'Email Z-A' },
            ],
        },
    ];

    // ---------- Loading / error ----------
    if (isLoading) return <Loader text="Loading users..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load users. Please try again.')}
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
                    <FiUsers className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>User Management</h1>
                </div>
                <button
                    onClick={handleCreateUser}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create User
                </button>
            </div>

            <TableLayout
                headerProps={{
                    searchTerm,
                    setSearchTerm,
                    filters: headerFilters,
                    activeFilterCount,
                    onClearFilters: handleClearFilters,
                    placeholder: 'Search by name or email...',
                    size: 'md',
                    showFilterButton: false,
                }}
                paginationProps={{
                    dataLength: users.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <UserTable
                    users={users}
                    isLoading={isFetching}
                    onEdit={handleEditUser}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDeleteUser}
                />
            </TableLayout>
        </div>
    );
}