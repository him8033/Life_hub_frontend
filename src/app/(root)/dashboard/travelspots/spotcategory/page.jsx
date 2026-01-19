'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpotCategoryTable from '@/components/travelspots/spotcategory/SpotCategoryTable';
import listingStyles from '@/styles/common/Listing.module.css';
import { useDeleteSpotCategoryMutation, useGetAdminSpotCategoriesQuery, useUpdateSpotCategoryMutation } from '@/services/api/spotcategoryApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { useConfirm } from '@/context/ConfirmContext';

export default function TravelSpotsPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const { data, error, isLoading, refetch } = useGetAdminSpotCategoriesQuery();
    const [deleteSpotCategory] = useDeleteSpotCategoryMutation();
    const [updateSpotCategory] = useUpdateSpotCategoryMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const spotCategories = data?.data || [];

    const handleDelete = async (slug, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Spot Category',
                message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
                confirmText: 'Delete',
                cancelText: 'Cancel',
                type: 'danger',
                isLoading: false,
            });

            if (!ok) {
                setIsDeleting(false);
                return;
            }

            const res = await deleteSpotCategory(slug).unwrap();
            showSnackbar(res?.message || 'Spot Category deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to delete Spot Category. Please try again.', 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (slug, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Hide Spot Category' : 'Show Spot Category',
                message: currentStatus
                    ? `"${name}" will be hidden from users. Users will no longer be able to see this travel spot.`
                    : `"${name}" will be visible to users. Users will be able to see and interact with this travel spot.`,
                confirmText: currentStatus ? 'Hide' : 'Show',
                cancelText: 'Cancel',
                type: currentStatus ? 'warning' : 'info',
                isLoading: false,
            });

            if (!ok) {
                setIsToggling(false);
                return;
            }

            const res = await updateSpotCategory({
                slug,
                data: { is_active: !currentStatus },
            }).unwrap();

            showSnackbar(
                currentStatus
                    ? `"${name}" is now hidden from users`
                    : `"${name}" is now visible to users`,
                'success',
                3000
            );
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar(
                    currentStatus
                        ? 'Failed to hide Spot Category'
                        : 'Failed to show Spot Category',
                    'error',
                    5000
                );
            }
        } finally {
            setIsToggling(false);
        }
    };

    const filteredSpotCategories = useMemo(() => {
        return spotCategories.filter(spot => {
            const matchesSearch =
                spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (spot.spotcategory_id && spot.spotcategory_id.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && spot.is_active) ||
                (statusFilter === 'inactive' && !spot.is_active);

            return matchesSearch && matchesStatus;
        });
    }, [spotCategories, searchTerm, statusFilter]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
    };

    if (isLoading) {
        return (
            <Loader text="Loading Spot Categories..." />
        );
    };

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load Spot Categories. Please try again."}
                errorType="error"
                onRetry={() => refetch()}
                retryMsg="Refresh"
            />
        );
    }

    return (
        <div className={listingStyles.listingContainer}>
            <div className={listingStyles.listingHeader}>
                <h1 className={listingStyles.listingTitle}>Spot Categories</h1>
                <div className={listingStyles.listingActions}>
                    <div className={listingStyles.listingSearch}>
                        <input
                            type="text"
                            placeholder="Search by name, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={listingStyles.searchInput}
                            disabled={isDeleting || isToggling}
                        />
                    </div>
                    <Link
                        href={ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.CREATE}
                        className={listingStyles.primaryButton}
                        style={isDeleting || isToggling ? { opacity: 0.7, pointerEvents: 'none' } : {}}
                    >
                        Add Spot Category
                    </Link>
                </div>
            </div>

            <div className={listingStyles.listingFilters}>
                <div className={listingStyles.filterGroup}>
                    <div className={listingStyles.filterField}>
                        <label className={listingStyles.filterLabel}>Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={listingStyles.filterSelect}
                            disabled={isDeleting || isToggling}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={listingStyles.listingContent}>
                {filteredSpotCategories.length === 0 ? (
                    <div className={listingStyles.listingEmpty}>
                        <p>
                            {spotCategories.length === 0
                                ? 'No Spot Categories found. Add your first Spot Category!'
                                : 'No Spot Categories match your search criteria.'
                            }
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button
                                onClick={handleClearFilters}
                                className={listingStyles.secondaryButton}
                                style={{ marginTop: '8px' }}
                                disabled={isDeleting || isToggling}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <SpotCategoryTable
                        spotCategories={filteredSpotCategories}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                        onEdit={(slug) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.EDIT(slug))}
                        isLoading={isDeleting || isToggling}
                    />
                )}
            </div>
        </div>
    );
}