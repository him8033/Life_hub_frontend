'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import listingStyles from '@/styles/common/Listing.module.css';
import viewStyles from '@/styles/travelspots/TravelSpotView.module.css';
import { useGetTravelSpotBySlugQuery } from '@/services/api/travelspotApi';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import { formatDateTime } from '@/utils/date.utils';
import NotFoundState from '@/components/common/NotFoundState';
import ErrorState from '@/components/common/ErrorState';

export default function ViewTravelSpotPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const { data, error, isLoading, refetch } = useGetTravelSpotBySlugQuery(slug, { skip: !slug, });
    const travelSpot = data?.data || null;

    if (isLoading) {
        return (
            <Loader text="Loading travel spot Data..." />
        );
    };


    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Travel Spot Not Found"
                message="The travel spot you're looking for doesn't exist or is no longer available."
                backLabel="Back to Travel Spots"
                backTo={ROUTES.TRAVELSPOT.LISTING}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load travel spot details. Please try again."}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={listingStyles.listingContainer}>
            <div className={listingStyles.listingHeader}>
                <div style={{ width: '100%' }}>
                    <button
                        onClick={() => router.back()}
                        className={viewStyles.backButton}
                    >
                        ← Back
                    </button>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}>
                            <h1 className={listingStyles.listingTitle}>{travelSpot.name}</h1>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                flexWrap: 'wrap'
                            }}>
                                <span className={travelSpot.is_active ? listingStyles.statusActive : listingStyles.statusInactive}>
                                    {travelSpot.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                    ID: {travelSpot.travelspot_id}
                                </span>
                                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                    City: {travelSpot.city}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link
                                href={ROUTES.TRAVELSPOT.EDIT(travelSpot.slug)}
                                className={listingStyles.primaryButton}
                            >
                                Edit
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className={viewStyles.detailsContainer}>
                <div className={viewStyles.detailsGrid}>
                    <div className={viewStyles.detailSection}>
                        <h3 className={viewStyles.sectionTitle}>Basic Information</h3>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Name:</span>
                            <span className={viewStyles.detailValue}>{travelSpot.name}</span>
                        </div>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Slug:</span>
                            <span className={viewStyles.detailValue}>{travelSpot.slug}</span>
                        </div>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>City:</span>
                            <span className={viewStyles.detailValue}>{travelSpot.city}</span>
                        </div>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Status:</span>
                            <span className={viewStyles.detailValue}>
                                {travelSpot.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <div className={viewStyles.detailSection}>
                        <h3 className={viewStyles.sectionTitle}>Description</h3>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Short Description:</span>
                            <p className={viewStyles.detailText}>
                                {travelSpot.short_description || 'No description provided'}
                            </p>
                        </div>
                    </div>

                    <div className={viewStyles.detailSection}>
                        <h3 className={viewStyles.sectionTitle}>Location Details</h3>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Full Address:</span>
                            <p className={viewStyles.detailText}>
                                {travelSpot.full_address || 'No address provided'}
                            </p>
                        </div>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Coordinates:</span>
                            <span className={viewStyles.detailValue}>
                                {travelSpot.latitude && travelSpot.longitude
                                    ? `${travelSpot.latitude}, ${travelSpot.longitude}`
                                    : 'Not specified'}
                            </span>
                        </div>
                        {travelSpot.latitude && travelSpot.longitude && (
                            <div className={viewStyles.mapPreview}>
                                <div className={viewStyles.mapPlaceholder}>
                                    <p>📍 Location: {travelSpot.latitude}, {travelSpot.longitude}</p>
                                    <p className={viewStyles.mapHelp}>
                                        Map preview would be displayed here with Google Maps/Leaflet integration
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={viewStyles.detailSection}>
                        <h3 className={viewStyles.sectionTitle}>Audit Information</h3>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Created At:</span>
                            <span className={viewStyles.detailValue}>
                                {travelSpot.created_at ? formatDateTime(travelSpot.created_at) : '—'}
                            </span>
                        </div>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Updated At:</span>
                            <span className={viewStyles.detailValue}>
                                {travelSpot.created_at ? formatDateTime(travelSpot.updated_at) : '—'}
                            </span>
                        </div>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Created By:</span>
                            <span className={viewStyles.detailValue}>
                                {travelSpot.created_by || 'N/A'}
                            </span>
                        </div>
                        <div className={viewStyles.detailItem}>
                            <span className={viewStyles.detailLabel}>Last Updated By:</span>
                            <span className={viewStyles.detailValue}>
                                {travelSpot.updated_by || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}