# Life Hub Frontend - AI Implementation Guidelines

**Version:** 1.0  
**Last Updated:** 2026-09-20  
**Purpose:** Source of truth for all AI-assisted development in the Life Hub project

---

## 📋 Overview

This document defines the implementation patterns, architecture, and coding conventions that MUST be followed when implementing new features in the Life Hub frontend project. All AI agents must read this document before implementing any new CRUD or frontend feature.

### Project Stack
- **Framework:** Next.js 14+ (App Router)
- **State Management:** Redux Toolkit Query (RTK Query)
- **Validation:** Zod
- **Styling:** CSS Modules
- **UI Contexts:** Modal, Snackbar, Confirm
- **Backend:** Django REST Framework
- **Authentication:** JWT with refresh tokens

---

## 🏗️ Architecture Patterns

### 1. Modular Folder Structure

Every CRUD module MUST follow this exact structure:

```
feature-name/
├── app/(root)/dashboard/feature-name/
│   └── page.jsx                    # Main CRUD page
├── components/dashboard/feature-name/
│   ├── FeatureTable.jsx           # Table component
│   └── index.js                   # Component exports
├── services/api/dashboard/feature-name/
│   ├── featureApi.js              # RTK Query API service
│   └── index.js                   # API exports
├── lib/validations/dashboard/feature-name/
│   └── featureValidation.js       # Zod validation schemas
└── modules/feature-name/
    ├── index.js                   # Main module exports
    ├── constants.js               # Feature constants
    └── README.md                  # Feature documentation
```

#### Example: Account Module Structure
```
account/
├── app/(root)/dashboard/account/
│   ├── users/page.jsx
│   ├── roles/page.jsx
│   └── status/page.jsx
├── components/dashboard/account/
│   ├── users/UserTable.jsx
│   ├── roles/RoleTable.jsx
│   └── status/StatusTable.jsx
├── services/api/dashboard/account/
│   ├── users/userApi.js
│   ├── roles/roleApi.js
│   ├── status/statusApi.js
│   └── index.js
├── lib/validations/dashboard/account/
│   ├── users/userValidation.js
│   ├── roles/roleValidation.js
│   └── status/statusValidation.js
└── modules/account/
    ├── index.js
    ├── constants.js
    └── README.md
```

### 2. Redux Store Integration

All API services MUST be registered in the Redux store:

```javascript
// src/redux/store.js
import { featureApi } from '@/services/api/dashboard/feature-name/featureApi';

export const store = configureStore({
  reducer: {
    [featureApi.reducerPath]: featureApi.reducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      featureApi.middleware,
      // ... other middleware
    ),
});
```

---

## 🔌 API Service Pattern

### 1. RTK Query API Service Structure

All API services MUST follow this exact pattern:

```javascript
// services/api/dashboard/feature-name/featureApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/services/api/baseQueryWithReauth";

export const featureApi = createApi({
    reducerPath: "featureApi",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["FeatureList", "Feature"],

    endpoints: (builder) => ({
        // List endpoint
        getFeatureList: builder.query({
            query: (params) => ({
                url: "features/",
                method: "GET",
                params: {
                    search: params.search,
                    is_active: params.is_active,
                    ordering: params.ordering,
                    page: params.page,
                    page_size: params.page_size,
                },
            }),
            providesTags: ["FeatureList"],
        }),

        // Detail endpoint
        getFeatureDetail: builder.query({
            query: (feature_id) => ({
                url: `features/${feature_id}/`,
                method: "GET",
            }),
            providesTags: (result, error, feature_id) => [
                { type: "Feature", id: feature_id },
            ],
        }),

        // Create endpoint
        createFeature: builder.mutation({
            query: (data) => ({
                url: "features/create/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["FeatureList"],
        }),

        // Edit endpoint
        editFeature: builder.mutation({
            query: ({ feature_id, data }) => ({
                url: `features/${feature_id}/edit/`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { feature_id }) => [
                "FeatureList",
                { type: "Feature", id: feature_id },
            ],
        }),

        // Delete endpoint
        deleteFeature: builder.mutation({
            query: ({ feature_id }) => ({
                url: `features/${feature_id}/delete/`,
                method: "DELETE",
            }),
            invalidatesTags: ["FeatureList"],
        }),
    }),
});

export const {
    useGetFeatureListQuery,
    useGetFeatureDetailQuery,
    useCreateFeatureMutation,
    useEditFeatureMutation,
    useDeleteFeatureMutation,
} = featureApi;
```

### 2. Index File Exports

Every API folder MUST have an index.js file:

```javascript
// services/api/dashboard/feature-name/index.js
export { featureApi } from './featureApi';
export {
    useGetFeatureListQuery,
    useGetFeatureDetailQuery,
    useCreateFeatureMutation,
    useEditFeatureMutation,
    useDeleteFeatureMutation,
} from './featureApi';
```

### 3. Module-Level Index

Create a central index for the entire module:

```javascript
// services/api/dashboard/account/index.js
export * from './users';
export * from './roles';
export * from './status';
```

---

## 📝 Validation Pattern

### 1. Zod Validation Schemas

All validation MUST use Zod and follow this pattern:

```javascript
// lib/validations/dashboard/feature-name/featureValidation.js
import { z } from 'zod';

// Create Schema
export const createFeatureSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
});

// Edit Schema
export const editFeatureSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
    description: z.string().optional().or(z.literal('')),
    is_active: z.boolean().optional(),
});

// Delete Schema
export const deleteFeatureSchema = z.object({
    permanent: z.boolean().optional(),
    reason: z.string().optional(),
});

// TypeScript exports
export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type EditFeatureInput = z.infer<typeof editFeatureSchema>;
export type DeleteFeatureInput = z.infer<typeof deleteFeatureSchema>;
```

### 2. Password Validation Pattern

For password fields, always include:

```javascript
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

const confirmPasswordSchema = z.string().min(8, 'Confirm password is required');

// Refine to match passwords
.refine(
    (data) => data.password === data.confirm_password,
    {
        message: "Passwords do not match",
        path: ["confirm_password"],
    }
)
```

---

## 🎨 Component Patterns

### 1. Page Component Structure

All CRUD pages MUST follow this structure:

```javascript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { FiIcon1, FiIcon2 } from 'react-icons/fi';
import FeatureTable from '@/components/dashboard/feature-name/FeatureTable';
import TableLayout from '@/components/common/table/TableLayout';
import {
    useGetFeatureListQuery,
    useCreateFeatureMutation,
    useEditFeatureMutation,
    useDeleteFeatureMutation,
} from '@/services/api/dashboard/feature-name/featureApi';
import { useModal } from '@/context/ModalContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useSnackbar } from '@/context/SnackbarContext';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { extractErrorMessage } from '@/utils/errorHandler';
import styles from '@/styles/common/CommonListing.module.css';

export default function FeaturesPage() {
    const showModal = useModal();
    const confirm = useConfirm();
    const { showSnackbar } = useSnackbar();

    // ---------- Mutations ----------
    const [createFeature] = useCreateFeatureMutation();
    const [editFeature] = useEditFeatureMutation();
    const [deleteFeature] = useDeleteFeatureMutation();

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
    const { data, error, isLoading, isFetching, refetch } = useGetFeatureListQuery({
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
       1. CREATE FEATURE
    ============================================================ */
    const handleCreateFeature = () => {
        showModal({
            title: 'Create New Feature',
            subtitle: 'Add a new feature to the system',
            subtitleLabel: 'Feature Management',
            icon: <FiPlus />,
            submitText: 'Create Feature',
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
                    label: 'Feature Name',
                    placeholder: 'Enter feature name',
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
                    placeholder: 'Describe the feature',
                },
                {
                    name: 'is_active',
                    label: 'Active',
                    type: 'checkbox',
                },
            ],
            schema: z.object({
                name: z.string().min(1, 'Feature name is required'),
                slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
                description: z.string().optional().or(z.literal('')),
                is_active: z.boolean().optional(),
            }),
            onSubmit: async (data) => {
                try {
                    await createFeature(data).unwrap();
                    showSnackbar('Feature created successfully', 'success', 5000);
                    refetch();
                } catch (err) {
                    const msg =
                        err.data?.non_field_errors?.[0] ||
                        err.data?.slug?.[0] ||
                        err.data?.message ||
                        'Failed to create feature';
                    showSnackbar(msg, 'error', 5000);
                    throw err;
                }
            },
        });
    };

    /* ============================================================
       2. EDIT FEATURE
    ============================================================ */
    const handleEditFeature = (feature) => {
        showModal({
            title: 'Edit Feature',
            subtitle: feature.name,
            subtitleLabel: 'Feature Name',
            icon: <FiEdit />,
            submitText: 'Save Changes',
            size: 'md',
            defaultValues: {
                name: feature.name || '',
                slug: feature.slug || '',
                description: feature.description || '',
                is_active: feature.is_active,
            },
            fields: [
                // ... same fields as create
            ],
            schema: z.object({
                // ... same schema as create
            }),
            onSubmit: async (data) => {
                try {
                    await editFeature({
                        feature_id: feature.feature_id,
                        data: data,
                    }).unwrap();
                    showSnackbar('Feature updated successfully', 'success', 5000);
                    refetch();
                } catch (err) {
                    const msg =
                        err.data?.non_field_errors?.[0] ||
                        err.data?.slug?.[0] ||
                        err.data?.message ||
                        'Failed to update feature';
                    showSnackbar(msg, 'error', 5000);
                    throw err;
                }
            },
        });
    };

    /* ============================================================
       3. DELETE FEATURE
    ============================================================ */
    const handleDeleteFeature = async (feature_id, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Feature',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
            });

            if (!ok) return;

            await deleteFeature({
                feature_id,
            }).unwrap();
            showSnackbar('Feature deleted successfully', 'success', 5000);
            refetch();
        } catch (err) {
            const msg =
                err.data?.non_field_errors?.[0] ||
                err.data?.message ||
                'Failed to delete feature';
            showSnackbar(msg, 'error', 5000);
        } finally {
            setIsDeleting(false);
        }
    };

    /* ============================================================
       4. TOGGLE STATUS
    ============================================================ */
    const handleToggleStatus = async (feature_id, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Deactivate Feature' : 'Activate Feature',
                message: currentStatus
                    ? `"${name}" will be deactivated.`
                    : `"${name}" will be activated.`,
                confirmText: currentStatus ? 'Deactivate' : 'Activate',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
            });

            if (!ok) return;

            await editFeature({
                feature_id,
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
        } catch (err) {
            const msg =
                err.data?.non_field_errors?.[0] ||
                err.data?.message ||
                `Failed to ${currentStatus ? 'deactivate' : 'activate'} feature`;
            showSnackbar(msg, 'error', 5000);
        } finally {
            setIsToggling(false);
        }
    };

    /* ============================================================
       Listing helpers
    ============================================================ */
    const features = data?.data?.results || data?.results || [];
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
    if (isLoading) return <Loader text="Loading features..." />;

    if (error) {
        return (
            <ErrorState
                message={extractErrorMessage(error, 'Failed to load features. Please try again.')}
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
                    <FiIcon className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>Feature Management</h1>
                </div>
                <button
                    onClick={handleCreateFeature}
                    className={styles.addButton}
                >
                    <FiPlus className={styles.addIcon} />
                    Create Feature
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
                    dataLength: features.length,
                    totalCount,
                    currentPage,
                    totalPages,
                    pageSize,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    isFetching,
                }}
            >
                <FeatureTable
                    features={features}
                    onEdit={handleEditFeature}
                    onDelete={handleDeleteFeature}
                    onToggleStatus={handleToggleStatus}
                    isLoading={isDeleting || isToggling || isFetching}
                />
            </TableLayout>

            {/* Loading Overlay */}
            {isFetching && features.length > 0 && (
                <div className={styles.loadingOverlay}>
                    <Loader text="Loading..." />
                </div>
            )}
        </div>
    );
}
```

### 2. Table Component Pattern

All table components MUST follow this structure:

```javascript
'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaEdit, FaTrash } from "react-icons/fa";

export default function FeatureTable({
    features,
    onDelete,
    onToggleStatus,
    onEdit,
    isLoading = false
}) {
    if (!features || features.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    🎯
                </div>
                <p className={tableStyles.emptyText}>No features available</p>
            </div>
        );
    }

    return (
        <div className={tableStyles.tableContainer}>
            <table className={tableStyles.dataTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature) => (
                        <tr key={feature.feature_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{feature.feature_id || 'N/A'}</span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{feature.name}</div>
                                    <div className={tableStyles.subName}>{feature.slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {feature.description || '—'}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant={feature.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(feature.feature_id, feature.is_active, feature.name)}
                                    disabled={isLoading}
                                    className={tableStyles.statusToggle}
                                >
                                    {feature.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {feature.created_at ? formatDateTime(feature.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaEdit />}
                                        onClick={() => !isLoading && onEdit(feature)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(feature.feature_id, feature.name)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Delete"
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

### 3. Required CSS Classes

Use these predefined CSS classes from `TableStyles.module.css`:

- `tableContainer` - Wrapper for table
- `dataTable` - Main table
- `tableRow` - Table row with hover effect
- `idCell` - ID column cell
- `idBadge` - ID badge styling
- `nameContainer` - Container for name + slug
- `mainName` - Primary name text
- `subName` - Secondary text (slug, etc.)
- `mutedText` - Grayed out text
- `dateText` - Date formatting
- `statusBadge` - Status badge
- `statusActive` - Active status style
- `statusInactive` - Inactive status style
- `actionsContainer` - Action buttons container
- `iconButton` - Icon button styling
- `emptyTable` - Empty state container
- `emptyIcon` - Empty state icon
- `emptyText` - Empty state text

---

## 🔄 State Management Patterns

### 1. Loading States

ALWAYS track operation states:

```javascript
const [isDeleting, setIsDeleting] = useState(false);
const [isToggling, setIsToggling] = useState(false);
```

### 2. Search Debouncing

ALWAYS use 500ms debounce for search:

```javascript
useEffect(() => {
    const t = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
}, [searchTerm]);
```

### 3. Pagination Data Extraction

ALWAYS handle multiple response shapes:

```javascript
const features = data?.data?.results || data?.results || [];
const pagination = data?.data?.pagination || {};
const totalCount = pagination.total ?? data?.data?.count ?? data?.count ?? 0;
const totalPages = pagination.total_pages ?? Math.max(1, Math.ceil(totalCount / pageSize));
```

---

## 🎯 UI/UX Patterns

### 1. Confirmation Dialogs

Use `useConfirm` for destructive actions:

```javascript
const ok = await confirm({
    title: 'Delete Feature',
    message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'danger',
});

if (!ok) return;
```

### 2. Status Toggle Confirmation

Use dynamic confirmation for status changes:

```javascript
const ok = await confirm({
    title: currentStatus ? 'Deactivate Feature' : 'Activate Feature',
    message: currentStatus
        ? `"${name}" will be deactivated.`
        : `"${name}" will be activated.`,
    confirmText: currentStatus ? 'Deactivate' : 'Activate',
    cancelText: 'Cancel',
    type: currentStatus ? 'warning' : 'info',
});
```

### 3. Error Handling

ALWAYS handle errors with snackbar:

```javascript
try {
    await operation().unwrap();
    showSnackbar('Success message', 'success', 5000);
    refetch();
} catch (err) {
    const msg =
        err.data?.non_field_errors?.[0] ||
        err.data?.message ||
        'Default error message';
    showSnackbar(msg, 'error', 5000);
} finally {
    setIsDeleting(false);
}
```

### 4. Loading States in Components

Pass `isLoading` to table components:

```javascript
<FeatureTable
    features={features}
    onEdit={handleEditFeature}
    onDelete={handleDeleteFeature}
    onToggleStatus={handleToggleStatus}
    isLoading={isDeleting || isToggling || isFetching}
/>
```

---

## 🛣️ Routing Patterns

### 1. Route Constants

ALWAYS define routes in `routes.constants.js`:

```javascript
export const ROUTES = {
    DASHBOARD: {
        FEATURE: {
            LIST: '/dashboard/feature',
            CREATE: '/dashboard/feature/create',
            EDIT: (id) => `/dashboard/feature/edit/${id}`,
            VIEW: (id) => `/dashboard/feature/view/${id}`,
        },
    },
};
```

### 2. Group Related Routes

Use nested route objects for related features:

```javascript
ACCOUNT: {
    USERS: "/dashboard/account/users",
    ROLES: "/dashboard/account/roles",
    STATUS: "/dashboard/account/status",
}
```

---

## 🧭 Navigation Patterns

### 1. Sidebar Structure

Use this pattern for sidebar navigation:

```javascript
{
    title: 'MANAGEMENT',
    items: [
        {
            id: 'feature',
            label: 'Features',
            icon: <FiIcon />,
            show: true,
            href: ROUTES.DASHBOARD.FEATURE.LIST,
        },
    ],
}
```

### 2. Submenu Pattern

For grouped features:

```javascript
{
    id: 'feature-group',
    label: 'Feature Group',
    icon: <FiIcon />,
    show: true,
    submenu: [
        {
            label: 'Sub-feature 1',
            icon: <FiSubIcon />,
            href: ROUTES.DASHBOARD.FEATURE.SUB1,
            show: true,
        },
        {
            label: 'Sub-feature 2',
            icon: <FiSubIcon />,
            href: ROUTES.DASHBOARD.FEATURE.SUB2,
            show: true,
        },
    ],
}
```

---

## 📦 Module Export Pattern

### 1. Main Module Index

Create a comprehensive module index:

```javascript
// modules/feature-name/index.js
export { default as FeaturesPage } from '@/app/(root)/dashboard/feature-name/page';
export { default as FeatureTable } from '@/components/dashboard/feature-name/FeatureTable';
export * from '@/services/api/dashboard/feature-name';
export * from '@/lib/validations/dashboard/feature-name/featureValidation';
export * from './constants';
```

### 2. Constants File

Create a constants file for the module:

```javascript
// modules/feature-name/constants.js
export const FEATURE_ROUTES = {
    LIST: '/dashboard/feature',
    CREATE: '/dashboard/feature/create',
    EDIT: (id) => `/dashboard/feature/edit/${id}`,
};

export const FEATURE_PERMISSIONS = {
    CREATE: 'feature.create',
    LIST: 'feature.list',
    VIEW: 'feature.view',
    UPDATE: 'feature.update',
    DELETE: 'feature.delete',
};

export const FEATURE_CONFIG = {
    DEFAULT_PAGE_SIZE: 10,
    SEARCH_DEBOUNCE_MS: 500,
};
```

---

## 🔐 Backend API Expectations

### 1. Response Structure

ALWAYS expect this response structure:

```json
{
    "message": "Human-readable message",
    "data": { ... },
    "errors": { ... }
}
```

### 2. Pagination Structure

ALWAYS expect this pagination structure:

```json
{
    "data": {
        "results": [...],
        "pagination": {
            "total": 100,
            "total_pages": 10,
            "current_page": 1,
            "page_size": 10
        }
    }
}
```

### 3. Error Response Structure

ALWAYS handle this error structure:

```json
{
    "non_field_errors": ["Error message"],
    "field_name": ["Field-specific error"],
    "message": "General error message"
}
```

---

## 🎨 Styling Conventions

### 1. CSS Module Imports

ALWAYS import from common styles:

```javascript
import styles from '@/styles/common/CommonListing.module.css';
import tableStyles from '@/styles/common/TableStyles.module.css';
```

### 2. Common CSS Classes

Use these standard classes:

- `pageContainer` - Main page wrapper
- `pageHeader` - Page header section
- `pageTitleWrapper` - Title wrapper with icon
- `pageIcon` - Page icon
- `pageTitle` - Page title
- `addButton` - Add new button
- `addIcon` - Add button icon
- `loadingOverlay` - Full-page loading overlay

---

## 🧪 Implementation Checklist

Before marking a feature as complete, ensure:

- [ ] Follows the exact folder structure
- [ ] API service uses RTK Query with proper tags
- [ ] Validation uses Zod schemas
- [ ] Components use TableStyles.module.css
- [ ] Page uses Modal, Snackbar, Confirm contexts
- [ ] Search debounces at 500ms
- [ ] Pagination handles multiple response shapes
- [ ] Delete uses confirmation dialog
- [ ] Status toggle uses confirmation dialog
- [ ] Error handling shows snackbar messages
- [ ] Loading states are tracked and passed to components
- [ ] Routes are defined in routes.constants.js
- [ ] Navigation is updated in Sidebar.jsx
- [ ] Redux store includes new API reducer
- [ ] Module has index.js exports
- [ ] Module has constants.js file
- [ ] Module has README.md documentation

---

## 📖 Code Style Rules

### 1. File Naming

- **Pages:** `page.jsx` (always lowercase)
- **Components:** PascalCase (e.g., `FeatureTable.jsx`)
- **API Services:** camelCase (e.g., `featureApi.js`)
- **Validation:** camelCase (e.g., `featureValidation.js`)
- **Constants:** camelCase (e.g., `constants.js`)

### 2. Import Ordering

1. React hooks
2. External libraries
3. Internal components
4. API services
5. Context providers
6. Common components
7. Utilities
8. Styles

### 3. Comment Sections

Use this comment pattern:

```javascript
/* ============================================================
   SECTION NAME
   ============================================================ */
```

### 4. Handler Functions

Name handlers with `handle` prefix:

```javascript
const handleCreateFeature = () => { }
const handleEditFeature = (feature) => { }
const handleDeleteFeature = async (id, name) => { }
const handleToggleStatus = async (id, status, name) => { }
```

---

## 🚫 Anti-Patterns to Avoid

### 1. DON'T Create New Architecture

- Don't create new state management patterns
- Don't introduce new API libraries
- Don't create new validation libraries
- Don't create new UI component libraries

### 2. DON'T Duplicate Existing Patterns

- Don't create new table components if TableStyles.module.css exists
- Don't create new modal patterns if ModalContext exists
- Don't create new confirmation patterns if ConfirmContext exists
- Don't create new notification patterns if SnackbarContext exists

### 3. DON'T Break Conventions

- Don't use different folder structures
- Don't use different naming conventions
- Don't use different error handling patterns
- Don't use different loading state patterns

---

## 📝 Quick Reference

### Implement New CRUD Feature

1. **Create folder structure** following the modular pattern
2. **Create API service** with RTK Query
3. **Create validation schemas** with Zod
4. **Create table component** using TableStyles
5. **Create page component** following the page pattern
6. **Add to Redux store**
7. **Update routes constants**
8. **Update navigation**
9. **Create module exports**
10. **Create constants file**
11. **Create README documentation**

### Quick Template

```bash
# Create folders
mkdir -p app/(root)/dashboard/feature-name
mkdir -p components/dashboard/feature-name
mkdir -p services/api/dashboard/feature-name
mkdir -p lib/validations/dashboard/feature-name
mkdir -p modules/feature-name

# Copy and adapt from existing module
cp -r account/users/page.jsx app/(root)/dashboard/feature-name/page.jsx
cp -r account/roles/RoleTable.jsx components/dashboard/feature-name/FeatureTable.jsx
cp -r account/users/userApi.js services/api/dashboard/feature-name/featureApi.js
cp -r account/users/userValidation.js lib/validations/dashboard/feature-name/featureValidation.js
```

---

## 🎯 Implementation Contract

By following this document, you agree to:

1. **Read this document** before implementing any new feature
2. **Follow existing patterns** without creating new architecture
3. **Maintain consistency** across all CRUD modules
4. **Use established components** instead of creating new ones
5. **Update this document** if patterns change

This document is the **source of truth** for Life Hub frontend development. Any deviation from these patterns must be discussed and approved before implementation.

---

**Document Owner:** Life Hub Development Team  
**Maintained By:** Frontend Development Team  
**Review Cycle:** Monthly or when patterns change
