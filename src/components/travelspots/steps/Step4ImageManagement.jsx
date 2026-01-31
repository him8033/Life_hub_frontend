'use client';

import { useState, useEffect } from 'react';
import {
    FiChevronLeft,
    FiChevronRight,
    FiPlus,
    FiUpload,
    FiX
} from 'react-icons/fi';

// Shadcn Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// RTK Query hooks
import {
    useGetTravelSpotImagesQuery,
    useUploadSpotImageMutation,
    useSetPrimarySpotImageMutation,
    useReorderSpotImagesMutation,
    useDeleteSpotImageMutation,
    useReplaceSpotImageMutation
} from '@/services/api/spotImageApi';

// Styles
import styles from '@/styles/travelspots/steps/Step4ImageManagement.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import SquareImageItem from '@/components/common/SquareImageItem';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import { useConfirm } from '@/context/ConfirmContext';

const Step4ImageManagement = ({
    travelSpot,
    onSubmit,
    onCancel,
    onBack,
    onNext,
    mode = 'edit'
}) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const [images, setImages] = useState([]);
    const [newImage, setNewImage] = useState(null);
    const [imageCaption, setImageCaption] = useState('');
    const [editingImage, setEditingImage] = useState(null); // Store entire image object
    const [editCaption, setEditCaption] = useState('');
    const [editImageFile, setEditImageFile] = useState(null); // New state for image replacement
    const [editPreviewUrl, setEditPreviewUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null); // Track which menu is open

    // Fetch images
    const { data: imagesData, isLoading: imagesLoading, refetch } = useGetTravelSpotImagesQuery(travelSpot.travelspot_id);

    // Mutations
    const [uploadSpotImage, { isLoading: isUploadSpotImage }] = useUploadSpotImageMutation();
    const [setPrimarySpotImage, { isLoading: isSetPrimarySpotImage }] = useSetPrimarySpotImageMutation();
    const [reorderSpotImages, { isLoading: isReorderSpotImages }] = useReorderSpotImagesMutation();
    const [deleteSpotImage, { isLoading: isDeleteSpotImage }] = useDeleteSpotImageMutation();
    const [replaceSpotImage, { isLoading: isReplaceSpotImage }] = useReplaceSpotImageMutation();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only close if click is outside any menu button or menu
            if (openMenuId && !event.target.closest('.menu-button-selector')) {
                setOpenMenuId(null);
            }
        };

        // Close on Escape key
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && openMenuId) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [openMenuId]);

    // Cleanup preview URLs
    useEffect(() => {
        return () => {
            if (editPreviewUrl) {
                URL.revokeObjectURL(editPreviewUrl);
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [editPreviewUrl, previewUrl]);

    // Initialize images
    useEffect(() => {
        if (imagesData?.data) {
            setImages(imagesData.data);
        }
    }, [imagesData]);

    // Handle menu toggle
    const handleMenuToggle = (imageId, e) => {
        if (e) {
            e.stopPropagation();
        }

        // Close all other menus if a different one is opening
        setOpenMenuId(openMenuId === imageId ? null : imageId);
    };

    // Close menu helper
    const closeMenu = () => {
        setOpenMenuId(null);
    };

    // Handle menu actions - automatically close menu
    const handleMenuAction = (action, imageId) => {
        closeMenu();
        action();
    };

    // Handle image select
    const handleImageSelect = (file) => {
        setNewImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    // Handle image select for editing
    const handleEditImageSelect = (file) => {
        setEditImageFile(file);
        const url = URL.createObjectURL(file);
        setEditPreviewUrl(url);
    };

    // Handle remove edit image
    const handleRemoveEditImage = () => {
        setEditImageFile(null);
        if (editPreviewUrl) {
            URL.revokeObjectURL(editPreviewUrl);
            setEditPreviewUrl('');
        }
    };

    // Handle remove image
    const handleRemoveImage = () => {
        setNewImage(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl('');
        setImageCaption('');
    };

    // Handle back button
    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    // Handle next to review
    const handleNext = () => {
        if (onNext) {
            onNext();
        }
    };

    const handleUploadImage = async () => {
        if (!newImage) return;

        try {
            const formData = new FormData();
            formData.append('image', newImage);
            if (imageCaption.trim()) {
                formData.append('caption', imageCaption.trim());
            }

            const res = await uploadSpotImage({
                travelspot_id: travelSpot.travelspot_id,
                data: formData
            }).unwrap();

            showSnackbar(res.message, 'success', 5000);

            setNewImage(null);
            setImageCaption('');
            setPreviewUrl('');
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to upload spot image', 'error', 3000);
            }
        }
    };

    const handleSetPrimary = async (imageId) => {
        closeMenu(); // Close menu when editing starts
        try {
            const res = await setPrimarySpotImage(imageId).unwrap();
            showSnackbar(res.message, 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to set primary spot image', 'error', 3000);
            }
        }
    };

    const handleDeleteImage = async (imageId) => {
        closeMenu(); // Close menu when editing starts
        const ok = await confirm({
            title: 'Delete Spot Image',
            message: `Are you sure you want to delete this image? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
            isLoading: false,
        });

        if (!ok) {
            return;
        }

        try {
            const res = await deleteSpotImage(imageId).unwrap();
            showSnackbar(res.message, 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to delete spot image', 'error', 3000);
            }
        }
    };

    const handleStartEdit = (image) => {
        closeMenu(); // Close menu when editing starts
        setEditingImage(image);
        setEditCaption(image.caption || '');
        setEditImageFile(null);
        setEditPreviewUrl('');
    };

    const handleSaveEdit = async (imageId) => {
        if (!editingImage) return;
        try {
            const formData = new FormData();

            // Add caption if it exists
            if (editCaption.trim()) {
                formData.append('caption', editCaption.trim());
            } else {
                formData.append('caption', ''); // Send empty string to clear caption
            }

            // Add new image file if selected
            if (editImageFile) {
                formData.append('image', editImageFile);
            }

            const res = await replaceSpotImage({
                spotimage_id: editingImage.spotimage_id,
                data: formData
            }).unwrap();

            showSnackbar(res.message, 'success', 5000);
            handleCancelEdit();
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to update spot image', 'error', 3000);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingImage(null);
        setEditCaption('');
        setEditImageFile(null);
        if (editPreviewUrl) {
            URL.revokeObjectURL(editPreviewUrl);
        }
        setEditPreviewUrl('');
    };

    const handleMoveUp = async (index) => {
        closeMenu(); // Close menu when editing starts
        if (index === 0) return;

        const items = [...images];
        [items[index], items[index - 1]] = [items[index - 1], items[index]];

        // Update positions
        const updatedItems = items.map((item, i) => ({
            ...item,
            position: i + 1
        }));

        setImages(updatedItems);

        try {
            const reorderData = {
                order: updatedItems.map((item, index) => ({
                    spotimage_id: item.spotimage_id,
                    position: index + 1
                }))
            };

            const res = await reorderSpotImages({
                travelspot_id: travelSpot.travelspot_id,
                data: reorderData
            }).unwrap();
            showSnackbar(res.message, 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to move up spot image', 'error', 3000);
            }
        }
    };

    const handleMoveDown = async (index) => {
        closeMenu(); // Close menu when editing starts
        if (index === images.length - 1) return;

        const items = [...images];
        [items[index], items[index + 1]] = [items[index + 1], items[index]];

        // Update positions
        const updatedItems = items.map((item, i) => ({
            ...item,
            position: i + 1
        }));

        setImages(updatedItems);

        try {
            const reorderData = {
                order: updatedItems.map((item, index) => ({
                    spotimage_id: item.spotimage_id,
                    position: index + 1
                }))
            };

            const res = await reorderSpotImages({
                travelspot_id: travelSpot.travelspot_id,
                data: reorderData
            }).unwrap();
            showSnackbar(res.message, 'success', 5000);
            refetch();
        } catch (error) {
            const backendErrors = error?.data?.errors;

            if (backendErrors?.non_field_errors?.length) {
                showSnackbar(backendErrors.non_field_errors[0], 'error', 5000);
            } else {
                showSnackbar('Failed to move down spot image', 'error', 3000);
            }
        }
    };

    // Edit modal content - Updated to include image replacement
    const renderEditModal = () => {
        if (!editingImage) return null;

        return (
            <div className={styles.editModalOverlay} onClick={handleCancelEdit}>
                <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.editModalHeader}>
                        <h3>Edit Image & Caption</h3>
                        <button
                            onClick={handleCancelEdit}
                            className={styles.closeButton}
                        >
                            <FiX />
                        </button>
                    </div>
                    <div className={styles.editModalContent}>
                        {/* Current Image Preview */}
                        <div className={styles.currentImageSection}>
                            <h4 className={styles.sectionSubtitle}>Current Image</h4>
                            <div className={styles.currentImagePreview}>
                                <img
                                    src={editingImage.image_url}
                                    alt={editingImage.caption || 'Current image'}
                                    className={styles.currentImage}
                                />
                                <div className={styles.currentImageInfo}>
                                    <span className={styles.imageInfoText}>
                                        Current image
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Replace Image Section */}
                        <div className={styles.replaceImageSection}>
                            <h4 className={styles.sectionSubtitle}>
                                Replace Image (Optional)
                            </h4>
                            <div className={styles.replaceImageContainer}>
                                {editPreviewUrl ? (
                                    <div className={styles.editImagePreview}>
                                        <img
                                            src={editPreviewUrl}
                                            alt="New image preview"
                                            className={styles.previewImage}
                                        />
                                        <button
                                            onClick={handleRemoveEditImage}
                                            className={styles.removeImageButton}
                                            type="button"
                                        >
                                            <FiX />
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.editImageUpload}>
                                        <SquareImageUpload
                                            onImageSelect={handleEditImageSelect}
                                            onRemove={handleRemoveEditImage}
                                            previewUrl={editPreviewUrl}
                                            disabled={isReplaceSpotImage}
                                            loading={false}
                                            maxSizeMB={5}
                                            label="Choose New Image"
                                            compact={true}
                                        />
                                        <div className={styles.uploadHint}>
                                            Max 5MB • JPG, PNG, WebP
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Caption Section */}
                        <div className={styles.captionSection}>
                            <h4 className={styles.sectionSubtitle}>Caption</h4>
                            <Textarea
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                placeholder="Enter caption for this image"
                                rows={3}
                                className={styles.editTextarea}
                                autoFocus
                            />
                            <div className={styles.captionHint}>
                                Leave empty to remove caption
                            </div>
                        </div>

                        {/* Edit Modal Actions */}
                        <div className={styles.editModalActions}>
                            <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                                disabled={isReplaceSpotImage}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                disabled={isReplaceSpotImage}
                                className={styles.saveButton}
                            >
                                {isReplaceSpotImage ? (
                                    <>
                                        <div className={styles.buttonSpinner}></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.stepContainer}>
            {/* Step Header */}
            <div className={styles.stepHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.stepTitle}>Image Management</h1>
                    <p className={styles.stepDescription}>
                        Upload and manage images for this travel spot. Use the menu options to reorder, set primary, edit, or delete images.
                    </p>
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Total Images:</span>
                            <span className={styles.statValue}>{images.length}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Primary:</span>
                            <span className={styles.statValue}>
                                {images.filter(img => img.is_primary).length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.contentSection}>
                {/* Upload Section - Side by side */}
                <div className={styles.uploadSection}>
                    <div className={styles.uploadHeader}>
                        <h2 className={styles.sectionTitle}>
                            <FiUpload className={styles.titleIcon} />
                            Upload New Image
                        </h2>
                        <div className={styles.uploadHint}>
                            Max 5MB • JPG, PNG, WebP
                        </div>
                    </div>

                    <div className={styles.uploadContainer}>
                        {/* Left: Image Upload */}
                        <div className={styles.uploadLeft}>
                            <SquareImageUpload
                                onImageSelect={handleImageSelect}
                                onRemove={handleRemoveImage}
                                previewUrl={previewUrl}
                                disabled={isUploadSpotImage}
                                loading={isUploadSpotImage}
                                maxSizeMB={5}
                                label="Upload Image"
                                size='medium'
                            />
                        </div>

                        {/* Right: Caption & Actions */}
                        <div className={styles.uploadRight}>
                            <div className={styles.captionContainer}>
                                <label className={styles.captionLabel}>
                                    Image Caption (Optional)
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Describe this image..."
                                    value={imageCaption}
                                    onChange={(e) => setImageCaption(e.target.value)}
                                    disabled={isUploadSpotImage}
                                    className={styles.captionInput}
                                />
                                <div className={styles.captionHint}>
                                    Keep it short and descriptive
                                </div>
                            </div>

                            <div className={styles.uploadActions}>
                                <Button
                                    onClick={handleUploadImage}
                                    disabled={!newImage || isUploadSpotImage}
                                    className={styles.uploadButton}
                                    size="default"
                                >
                                    {isUploadSpotImage ? (
                                        <>
                                            <div className={styles.buttonSpinner}></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FiPlus className={styles.buttonIcon} />
                                            Upload Image
                                        </>
                                    )}
                                </Button>
                                <div className={styles.uploadNote}>
                                    {newImage && (
                                        <span className={styles.fileInfo}>
                                            Selected: {newImage.name}, Size: {(newImage.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images List Section */}
                <div className={styles.imagesListSection}>
                    <div className={styles.listHeader}>
                        <h2 className={styles.sectionTitle}>
                            Image Gallery ({images.length})
                        </h2>
                        <div className={styles.listControls}>
                            <div className={styles.controlHint}>
                                Use menu options to reorder images
                            </div>
                        </div>
                    </div>

                    {imagesLoading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.loadingSpinner}></div>
                            <span>Loading images...</span>
                        </div>
                    ) : images.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIllustration}>
                                📸
                            </div>
                            <div className={styles.emptyContent}>
                                <h3 className={styles.emptyTitle}>No Images Added</h3>
                                <p className={styles.emptyDescription}>
                                    Upload images to showcase this travel spot.
                                    The first image uploaded becomes the primary display image.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.imagesGrid}>
                                {images.map((image, index) => (
                                    <div key={image.spotimage_id} className={styles.gridItem}>
                                        <SquareImageItem
                                            image={image}
                                            index={index}
                                            totalItems={images.length}
                                            isPrimary={image.is_primary}
                                            isMenuOpen={openMenuId === image.spotimage_id}
                                            onMenuToggle={(e) => handleMenuToggle(image.spotimage_id, e)}
                                            onSetPrimary={() => handleMenuAction(() => handleSetPrimary(image.spotimage_id), image.spotimage_id)}
                                            onEdit={() => handleStartEdit(image)}
                                            onDelete={() => handleMenuAction(() => handleDeleteImage(image.spotimage_id), image.spotimage_id)}
                                            onMoveUp={() => handleMenuAction(() => handleMoveUp(index), image.spotimage_id)}
                                            onMoveDown={() => handleMenuAction(() => handleMoveDown(index), image.spotimage_id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {renderEditModal()}

            {/* Navigation Actions */}
            <div className={styles.navigationActions}>
                <div className={styles.actionButtons}>
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        className={styles.backButton}
                        size="lg"
                    >
                        <FiChevronLeft className={styles.buttonIcon} />
                        Back to Details
                    </Button>

                    <div className={styles.rightActions}>
                        <Button
                            onClick={handleNext}
                            className={styles.nextButton}
                            size="lg"
                        >
                            Save & Continue
                            <FiChevronRight className={styles.icon} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step4ImageManagement;