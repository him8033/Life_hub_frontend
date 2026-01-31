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

// Shadcn Components
import { Button } from '@/components/ui/button';

// RTK Query hooks
import { useGetTravelSpotImagesQuery } from '@/services/api/spotImageApi';

// Styles
import styles from '@/styles/travelspots/steps/Step5ReviewSubmit.module.css';

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
            {/* Step Header */}
            <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Review & Update</h1>
                <p className={styles.stepDescription}>
                    Review your changes before final submission
                </p>
            </div>

            {/* All Fields in Consistent Format */}
            <div className={styles.compactReviewSections}>
                {/* 1. Basic Information */}
                <div className={styles.compactSection}>
                    <div className={styles.sectionHeaderCompact}>
                        <div className={styles.sectionTitleCompact}>
                            <FiHash className={styles.iconCompact} />
                            <span>Basic Information</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(1)}
                            className={styles.editButtonCompact}
                        >
                            <FiEdit2 size={14} />
                        </Button>
                    </div>
                    <div className={styles.compactContent}>
                        <div className={styles.compactInfo}>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Name:</span>
                                <span className={styles.compactValue}>{displayData.name || 'Not specified'}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Slug:</span>
                                <span className={styles.compactValue}>{displayData.slug || 'Not specified'}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Short Description:</span>
                                <span className={styles.compactValue}>{displayData.short_description_preview}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Categories:</span>
                                <span className={styles.compactValue}>{displayData.categories_display}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Location Details */}
                <div className={styles.compactSection}>
                    <div className={styles.sectionHeaderCompact}>
                        <div className={styles.sectionTitleCompact}>
                            <FiMapPin className={styles.iconCompact} />
                            <span>Location Details</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(2)}
                            className={styles.editButtonCompact}
                        >
                            <FiEdit2 size={14} />
                        </Button>
                    </div>
                    <div className={styles.compactContent}>
                        <div className={styles.compactInfo}>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Full Address:</span>
                                <span className={styles.compactValue}>{displayData.full_address || 'Not specified'}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Country:</span>
                                <span className={styles.compactValue}>{displayData.country_name}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>State:</span>
                                <span className={styles.compactValue}>{displayData.state_name}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>District:</span>
                                <span className={styles.compactValue}>{displayData.district_name}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Sub-district:</span>
                                <span className={styles.compactValue}>{displayData.sub_district_name}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Village:</span>
                                <span className={styles.compactValue}>{displayData.village_name}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Pincode:</span>
                                <span className={styles.compactValue}>{displayData.pincode_display}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Latitude:</span>
                                <span className={styles.compactValue}>{displayData.latitude || 'Not specified'}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Longitude:</span>
                                <span className={styles.compactValue}>{displayData.longitude || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Pricing & Timing */}
                <div className={styles.compactSection}>
                    <div className={styles.sectionHeaderCompact}>
                        <div className={styles.sectionTitleCompact}>
                            <FiDollarSign className={styles.iconCompact} />
                            <span>Pricing & Timing</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(3)}
                            className={styles.editButtonCompact}
                        >
                            <FiEdit2 size={14} />
                        </Button>
                    </div>
                    <div className={styles.compactContent}>
                        <div className={styles.compactInfo}>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Entry Fee:</span>
                                <span className={styles.compactValue}>{displayData.entry_fee_display}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Opening Time:</span>
                                <span className={styles.compactValue}>{displayData.opening_time_display}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Closing Time:</span>
                                <span className={styles.compactValue}>{displayData.closing_time_display}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Best Time to Visit:</span>
                                <span className={styles.compactValue}>{displayData.best_time_to_visit || 'Not specified'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Detailed Information */}
                <div className={styles.compactSection}>
                    <div className={styles.sectionHeaderCompact}>
                        <div className={styles.sectionTitleCompact}>
                            <FiFileText className={styles.iconCompact} />
                            <span>Detailed Information</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(3)}
                            className={styles.editButtonCompact}
                        >
                            <FiEdit2 size={14} />
                        </Button>
                    </div>
                    <div className={styles.compactContent}>
                        <div className={styles.compactInfo}>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Long Description:</span>
                                <span className={styles.compactValue}>{displayData.long_description_preview}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Images Overview */}
                <div className={styles.compactSection}>
                    <div className={styles.sectionHeaderCompact}>
                        <div className={styles.sectionTitleCompact}>
                            <FiImage className={styles.iconCompact} />
                            <span>Images Overview</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStep(4)}
                            className={styles.editButtonCompact}
                        >
                            <FiEdit2 size={14} />
                        </Button>
                    </div>
                    <div className={styles.imagesOverview}>
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
                            <div className={styles.imagesPreview}>
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
                                            <div className={styles.compactRow}>
                                                <span className={styles.compactLabel}>Caption:</span>
                                                <span className={styles.compactValue}>
                                                    {primaryImage.caption || 'No caption'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={styles.imageStats}>
                                    <div className={styles.statItemCompact}>
                                        <span className={styles.statLabelCompact}>Total Images:</span>
                                        <span className={styles.statValueCompact}>{images.length}</span>
                                    </div>
                                    <div className={styles.statItemCompact}>
                                        <span className={styles.statLabelCompact}>With Caption:</span>
                                        <span className={styles.statValueCompact}>
                                            {images.filter(img => img.caption).length}
                                        </span>
                                    </div>
                                    <div className={styles.statItemCompact}>
                                        <span className={styles.statLabelCompact}>Primary Set:</span>
                                        <span className={styles.statValueCompact}>
                                            {images.some(img => img.is_primary) ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. Status Information */}
                <div className={styles.compactSection}>
                    <div className={styles.sectionHeaderCompact}>
                        <div className={styles.sectionTitleCompact}>
                            <FiBriefcase className={styles.iconCompact} />
                            <span>Status Information</span>
                        </div>
                    </div>
                    <div className={styles.compactContent}>
                        <div className={styles.compactInfo}>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Completion Status:</span>
                                <span className={styles.compactValue}>{displayData.completion_status || 'Not specified'}</span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Ready for Review:</span>
                                <span className={styles.compactValue}>
                                    {displayData.is_ready_for_review ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Active Status:</span>
                                <span className={styles.compactValue}>
                                    {displayData.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className={styles.compactRow}>
                                <span className={styles.compactLabel}>Last Updated:</span>
                                <span className={styles.compactValue}>
                                    {displayData.updated_at ? new Date(displayData.updated_at).toLocaleDateString() : 'Not available'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary & Actions */}
            <div className={styles.compactSummary}>
                <div className={styles.summaryHeaderCompact}>
                    <h3 className={styles.summaryTitleCompact}>Ready to Update</h3>
                    <p className={styles.summaryDescriptionCompact}>
                        Review all information carefully before submitting.
                    </p>
                </div>

                <div className={styles.compactActions}>
                    <div className={styles.actionButtonsCompact}>
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className={styles.cancelButtonCompact}
                            size="sm"
                        >
                            <FiX className={styles.buttonIcon} />
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={styles.submitButtonCompact}
                            size="sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className={styles.spinnerSmall}></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FiUpload className={styles.buttonIcon} />
                                    Update Travel Spot
                                </>
                            )}
                        </Button>
                    </div>

                    <div className={styles.confirmationNote}>
                        <FiCheckCircle className={styles.confirmationIcon} />
                        <span className={styles.confirmationText}>
                            All changes will be updated immediately.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step5ReviewSubmit;