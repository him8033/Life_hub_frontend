'use client';

import { useState, useEffect } from 'react';
import {
    FiMapPin,
    FiDollarSign,
    FiClock,
    FiCalendar,
    FiFileText,
    FiCheckCircle,
    FiEdit2,
    FiUpload,
    FiX,
    FiImage,
    FiNavigation,
    FiHash,
    FiGlobe,
    FiLayers,
    FiBriefcase,
    FiTag
} from 'react-icons/fi';

// Custom Button Component
import Button from '@/components/common/buttons/Button';

// RTK Query hooks
import { useGetTravelSpotImagesQuery } from '@/services/api/spotImageApi';

// Styles
import styles from '@/styles/travelspots/steps/CommonStepStyles.module.css';
import StepHeader from './StepHeader';
import StepActions from './StepActions';
import FormSection from './FormSection';

const Step5ReviewSubmit = ({
    travelSpot,
    onSubmit,
    isSubmitting,
    onCancel,
    onEditStep,
}) => {
    const [images, setImages] = useState([]);

    // Fetch images
    const { data: imagesData, isLoading: imagesLoading } = useGetTravelSpotImagesQuery(travelSpot.travelspot_id);

    useEffect(() => {
        if (imagesData?.data) {
            setImages(imagesData.data);
        }
    }, [imagesData]);

    // Format data for display
    const formatDataForDisplay = () => {
        const data = { ...travelSpot };

        // Format entry fee
        if (data.entry_fee === '0' || data.entry_fee === 0 || data.entry_fee === '0.00') {
            data.entry_fee_display = 'Free';
        } else if (data.entry_fee) {
            const fee = parseFloat(data.entry_fee);
            data.entry_fee_display = `₹${fee.toFixed(2)}`;
        } else {
            data.entry_fee_display = 'Not specified';
        }

        // Format times
        data.opening_time_display = formatTimeDisplay(data.opening_time);
        data.closing_time_display = formatTimeDisplay(data.closing_time);

        // Format categories
        if (data.category_details && Array.isArray(data.category_details)) {
            data.categories_display = data.category_details.map(cat => cat.name).join(', ');
        } else if (data.categories) {
            data.categories_display = data.categories;
        } else {
            data.categories_display = 'Not specified';
        }

        // Get location names
        if (data.location) {
            data.country_name = data.location.country || data.country;
            data.state_name = data.location.state || data.state;
            data.district_name = data.location.district || data.district;
            data.sub_district_name = data.location.sub_district || data.sub_district;
            data.village_name = data.location.village || data.village;
            data.pincode_display = data.location.zipcode || data.pincode;
        } else {
            data.country_name = data.country || 'Not specified';
            data.state_name = data.state || 'Not specified';
            data.district_name = data.district || 'Not specified';
            data.sub_district_name = data.sub_district || 'Not specified';
            data.village_name = data.village || 'Not specified';
            data.pincode_display = data.pincode || 'Not specified';
        }

        // Truncate descriptions
        if (data.short_description && data.short_description.length > 100) {
            data.short_description_preview = data.short_description.substring(0, 100) + '...';
        } else {
            data.short_description_preview = data.short_description || 'Not specified';
        }

        if (data.long_description && data.long_description.length > 150) {
            data.long_description_preview = data.long_description.substring(0, 150) + '...';
        } else {
            data.long_description_preview = data.long_description || 'Not specified';
        }

        return data;
    };

    // Format time for display
    const formatTimeDisplay = (time) => {
        if (!time || time === 'not-specified') return 'Not specified';

        try {
            const timeWithoutSeconds = time.split(':').slice(0, 2).join(':');
            const [hours, minutes] = timeWithoutSeconds.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        } catch (error) {
            return time;
        }
    };

    const displayData = formatDataForDisplay();

    // Handle final submission
    const handleSubmit = () => {
        onSubmit();
    };

    // Handle edit step
    const handleEditStep = (stepNumber) => {
        if (onEditStep) {
            onEditStep(stepNumber);
        }
    };

    // Get primary image
    const primaryImage = images.find(img => img.is_primary) || images[0];

    return (
        <div className={styles.stepContainer}>
            <StepHeader
                title="Review & Update"
                description="Review your changes before final submission"
            />

            <div className={styles.reviewSections}>
                {/* Basic Information - With Edit */}
                <FormSection
                    icon={FiTag}
                    title="Basic Information"
                    showEdit={true}
                    editText="Edit"
                    editVariant="outline"
                    editSize="sm"
                    onEdit={() => handleEditStep(1)}
                >
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Name:</span>
                            <span className={styles.infoValue}>{displayData.name || 'Not specified'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Slug:</span>
                            <span className={styles.infoValue}>{displayData.slug || 'Not specified'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Short Description:</span>
                            <span className={styles.infoValue}>{displayData.short_description_preview}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Categories:</span>
                            <span className={styles.infoValue}>{displayData.categories_display}</span>
                        </div>
                    </div>
                </FormSection>

                {/* Location Details - With Edit */}
                <FormSection
                    icon={FiMapPin}
                    title="Location Details"
                    showEdit={true}
                    editText="Edit"
                    editVariant="outline"
                    editSize="sm"
                    onEdit={() => handleEditStep(2)}
                >
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Full Address:</span>
                            <span className={styles.infoValue}>{displayData.full_address || 'Not specified'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Country:</span>
                            <span className={styles.infoValue}>{displayData.country_name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>State:</span>
                            <span className={styles.infoValue}>{displayData.state_name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>District:</span>
                            <span className={styles.infoValue}>{displayData.district_name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Sub-district:</span>
                            <span className={styles.infoValue}>{displayData.sub_district_name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Village:</span>
                            <span className={styles.infoValue}>{displayData.village_name}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Pincode:</span>
                            <span className={styles.infoValue}>{displayData.pincode_display}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Latitude:</span>
                            <span className={styles.infoValue}>{displayData.latitude || 'Not specified'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Longitude:</span>
                            <span className={styles.infoValue}>{displayData.longitude || 'Not specified'}</span>
                        </div>
                    </div>
                </FormSection>

                {/* Pricing & Timing - With Edit */}
                <FormSection
                    icon={FiDollarSign}
                    title="Pricing & Timing"
                    showEdit={true}
                    editText="Edit"
                    editVariant="outline"
                    editSize="sm"
                    onEdit={() => handleEditStep(3)}
                >
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Entry Fee:</span>
                            <span className={styles.infoValue}>{displayData.entry_fee_display}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Opening Time:</span>
                            <span className={styles.infoValue}>{displayData.opening_time_display}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Closing Time:</span>
                            <span className={styles.infoValue}>{displayData.closing_time_display}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Best Time to Visit:</span>
                            <span className={styles.infoValue}>{displayData.best_time_to_visit || 'Not specified'}</span>
                        </div>
                    </div>
                </FormSection>

                {/* Detailed Information - With Edit */}
                <FormSection
                    icon={FiFileText}
                    title="Detailed Information"
                    showEdit={true}
                    editText="Edit"
                    editVariant="outline"
                    editSize="sm"
                    onEdit={() => handleEditStep(3)}
                >
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Long Description:</span>
                            <span className={styles.infoValue}>{displayData.long_description_preview}</span>
                        </div>
                    </div>
                </FormSection>

                {/* Images Overview - With Edit */}
                <FormSection
                    icon={FiImage}
                    title={`Images Overview (${images.length})`}
                    showEdit={true}
                    editText="Edit Images"
                    editVariant="outline"
                    editSize="sm"
                    onEdit={() => handleEditStep(4)}
                >
                    {imagesLoading ? (
                        <div className={styles.imagesLoading}>
                            <div className={styles.loadingSpinnerSmall}></div>
                            <span>Loading images...</span>
                        </div>
                    ) : images.length === 0 ? (
                        <div className={styles.noImages}>
                            <FiImage className={styles.noImagesIcon} />
                            <span>No images added</span>
                        </div>
                    ) : (
                        <>
                            {primaryImage && (
                                <div className={styles.primaryImagePreview}>
                                    <div className={styles.imageContainer}>
                                        <img
                                            src={primaryImage.image_url}
                                            alt={primaryImage.caption || 'Primary image'}
                                            className={styles.previewImage}
                                        />
                                        {primaryImage.is_primary && (
                                            <div className={styles.primaryBadge}>Primary</div>
                                        )}
                                    </div>
                                    <div className={styles.imageInfo}>
                                        <div className={styles.infoRow}>
                                            <span className={styles.infoLabel}>Caption:</span>
                                            <span className={styles.infoValue}>
                                                {primaryImage.caption || 'No caption'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={styles.imageStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Total Images:</span>
                                    <span className={styles.statValue}>{images.length}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>With Caption:</span>
                                    <span className={styles.statValue}>
                                        {images.filter(img => img.caption).length}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Primary Set:</span>
                                    <span className={styles.statValue}>
                                        {images.some(img => img.is_primary) ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </FormSection>

                {/* Status Information - No Edit Button */}
                <FormSection
                    icon={FiBriefcase}
                    title="Status Information"
                    showEdit={false}
                >
                    <div className={styles.infoGrid}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Completion Status:</span>
                            <span className={styles.infoValue}>{displayData.completion_status || 'Not specified'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Ready for Review:</span>
                            <span className={styles.infoValue}>
                                {displayData.is_ready_for_review ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Active Status:</span>
                            <span className={styles.infoValue}>
                                {displayData.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Last Updated:</span>
                            <span className={styles.infoValue}>
                                {displayData.updated_at ? new Date(displayData.updated_at).toLocaleDateString() : 'Not available'}
                            </span>
                        </div>
                    </div>
                </FormSection>
            </div>

            {/* Summary & Actions */}
            <div className={styles.reviewSummary}>
                <div className={styles.summaryHeader}>
                    <h3 className={styles.summaryTitle}>Ready to Update</h3>
                    <p className={styles.summaryDescription}>
                        Review all information carefully before submitting.
                    </p>
                </div>

                <StepActions
                    onBack={() => { }}
                    onNext={handleSubmit}
                    onCancel={onCancel}
                    isSubmitting={isSubmitting}
                    isValid={true}
                    backText=""
                    nextText="Update Travel Spot"
                    cancelText="Cancel"
                    showBack={false}
                    showCancel={true}
                    showNext={true}
                    nextVariant="primary"
                    cancelVariant="outline"
                    align="center"
                />

                <div className={styles.confirmationNote}>
                    <FiCheckCircle className={styles.confirmationIcon} />
                    <span className={styles.confirmationText}>
                        All changes will be updated immediately.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Step5ReviewSubmit;