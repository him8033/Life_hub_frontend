'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TravelSpotTable from '@/components/travelspots/TravelSpotTable';
import listingStyles from '@/styles/common/Listing.module.css';
import { useDeleteTravelSpotMutation, useGetAdminTravelSpotsQuery, useUpdateTravelSpotMutation } from '@/services/api/travelspotApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import { useConfirm } from '@/context/ConfirmContext';

export default function TravelSpotsPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const { data, error, isLoading, refetch } = useGetAdminTravelSpotsQuery();
    const [deleteTravelSpot] = useDeleteTravelSpotMutation();
    const [updateTravelSpot] = useUpdateTravelSpotMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [cityFilter, setCityFilter] = useState('all');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const travelSpots = data?.data || [];

    const handleDelete = async (travelspot_id, name) => {
        try {
            setIsDeleting(true);
            const ok = await confirm({
                title: 'Delete Travel Spot',
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

            const res = await deleteTravelSpot(travelspot_id).unwrap();
            showSnackbar(res?.message || 'Travel spot deleted successfully', 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to delete travel spot. Please try again.', 'error', 5000);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (travelspot_id, currentStatus, name) => {
        try {
            setIsToggling(true);
            const ok = await confirm({
                title: currentStatus ? 'Hide Travel Spot' : 'Show Travel Spot',
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

            const res = await updateTravelSpot({
                travelspot_id,
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
                        ? 'Failed to hide travel spot'
                        : 'Failed to show travel spot',
                    'error',
                    5000
                );
            }
        } finally {
            setIsToggling(false);
        }
    };

    const filteredTravelSpots = useMemo(() => {
        return travelSpots.filter(spot => {
            const matchesSearch =
                spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                spot.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (spot.travelspot_id && spot.travelspot_id.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && spot.is_active) ||
                (statusFilter === 'inactive' && !spot.is_active);

            const matchesCity =
                cityFilter === 'all' || spot.city === cityFilter;

            return matchesSearch && matchesStatus && matchesCity;
        });
    }, [travelSpots, searchTerm, statusFilter, cityFilter]);

    // hooks FIRST (always)
    const uniqueCities = useMemo(() => {
        return [...new Set(travelSpots.map(spot => spot.city).filter(Boolean))].sort();
    }, [travelSpots]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setCityFilter('all');
    };

    if (isLoading) {
        return (
            <Loader text="Loading travel spots..." />
        );
    };

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load travel spots. Please try again."}
                errorType="error"
                onRetry={() => refetch()}
                retryMsg="Refresh"
            />
        );
    }

    return (
        <div className={listingStyles.listingContainer}>
            <div className={listingStyles.listingHeader}>
                <h1 className={listingStyles.listingTitle}>Travel Spots</h1>
                <div className={listingStyles.listingActions}>
                    <div className={listingStyles.listingSearch}>
                        <input
                            type="text"
                            placeholder="Search by name, city, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={listingStyles.searchInput}
                            disabled={isDeleting || isToggling}
                        />
                    </div>
                    <Link
                        href={ROUTES.DASHBOARD.TRAVELSPOT.CREATE}
                        className={listingStyles.primaryButton}
                        style={isDeleting || isToggling ? { opacity: 0.7, pointerEvents: 'none' } : {}}
                    >
                        Add Travel Spot
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

                    <div className={listingStyles.filterField}>
                        <label className={listingStyles.filterLabel}>City</label>
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className={listingStyles.filterSelect}
                            disabled={isDeleting || isToggling}
                        >
                            <option value="all">All Cities</option>
                            {uniqueCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                            {/* <option value="Delhi">Delhi</option>
                            <option value="Agra">Agra</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Bangalore">Bangalore</option> */}
                        </select>
                    </div>
                </div>
            </div>

            <div className={listingStyles.listingContent}>
                {filteredTravelSpots.length === 0 ? (
                    <div className={listingStyles.listingEmpty}>
                        <p>
                            {travelSpots.length === 0
                                ? 'No travel spots found. Add your first travel spot!'
                                : 'No travel spots match your search criteria.'
                            }
                        </p>
                        {(searchTerm || statusFilter !== 'all' || cityFilter !== 'all') && (
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
                    <TravelSpotTable
                        travelSpots={filteredTravelSpots}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                        onEdit={(travelspot_id) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.EDIT(travelspot_id))}
                        onView={(travelspot_id) => router.push(ROUTES.DASHBOARD.TRAVELSPOT.VIEW(travelspot_id))}
                        isLoading={isDeleting || isToggling}
                    />
                )}
            </div>
        </div>
    );
}