'use client';

import { useState, useEffect } from 'react';
import { FiUpload, FiImage } from 'react-icons/fi';

// Custom Components
import Button from '@/components/common/buttons/Button';
import SimpleInput from '@/components/common/forms/SimpleInput';
import SquareImageUpload from '@/components/common/SquareImageUpload';
import SquareImageItem from '@/components/common/SquareImageItem';

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
import styles from '@/styles/travelspots/steps/CommonStepStyles.module.css';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import StepHeader from './StepHeader';
import StepActions from './StepActions';
import FormSection from './FormSection';
import EditImageModal from './EditImageModal';

const Step4ImageManagement = ({
    travelSpot,
    onBack,
    onNext,
}) => {
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [images, setImages] = useState([]);
    const [newImage, setNewImage] = useState(null);
    const [imageCaption, setImageCaption] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [editingImage, setEditingImage] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    // Fetch images
    const { data: imagesData, isLoading: imagesLoading, refetch } = useGetTravelSpotImagesQuery(travelSpot.travelspot_id);

    // Mutations
    const [uploadSpotImage, { isLoading: isUploadSpotImage }] = useUploadSpotImageMutation();
    const [setPrimarySpotImage, { isLoading: isSetPrimarySpotImage }] = useSetPrimarySpotImageMutation();
    const [reorderSpotImages, { isLoading: isReorderSpotImages }] = useReorderSpotImagesMutation();
    const [deleteSpotImage, { isLoading: isDeleteSpotImage }] = useDeleteSpotImageMutation();
    const [replaceSpotImage, { isLoading: isReplaceSpotImage }] = useReplaceSpotImageMutation();

    // Initialize images
    useEffect(() => {
        if (imagesData?.data) {
            setImages(imagesData.data);
        }
    }, [imagesData]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const closeMenu = () => {
        setOpenMenuId(null);
    };

    // Image Upload Handlers
    const handleImageSelect = (file, url) => {
        setNewImage(file);
        setPreviewUrl(url);
    };

    const handleRemoveImage = () => {
        setNewImage(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl('');
        setImageCaption('');
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

    // Image Management Handlers
    const handleSetPrimary = async (imageId) => {
        closeMenu();
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
        closeMenu();
        const ok = await confirm({
            title: 'Delete Spot Image',
            message: `Are you sure you want to delete this image? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
            isLoading: false,
        });

        if (!ok) return;

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
        closeMenu();
        setEditingImage(image);
    };

    const handleSaveEdit = async (updatedData) => {
        if (!editingImage) return;

        try {
            const formData = new FormData();

            if (updatedData.caption?.trim()) {
                formData.append('caption', updatedData.caption.trim());
            } else {
                formData.append('caption', '');
            }

            if (updatedData.imageFile) {
                formData.append('image', updatedData.imageFile, updatedData.imageFile.name);
            }

            const res = await replaceSpotImage({
                spotimage_id: editingImage.spotimage_id,
                data: formData
            }).unwrap();

            showSnackbar(res.message, 'success', 5000);
            setEditingImage(null);
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
    };

    const handleMoveUp = async (index) => {
        closeMenu();
        if (index === 0) return;

        const items = [...images];
        [items[index], items[index - 1]] = [items[index - 1], items[index]];

        const updatedItems = items.map((item, i) => ({
            ...item,
            position: i + 1
        }));

        setImages(updatedItems);

        try {
            const reorderData = {
                order: updatedItems.map((item, idx) => ({
                    spotimage_id: item.spotimage_id,
                    position: idx + 1
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
        closeMenu();
        if (index === images.length - 1) return;

        const items = [...images];
        [items[index], items[index + 1]] = [items[index + 1], items[index]];

        const updatedItems = items.map((item, i) => ({
            ...item,
            position: i + 1
        }));

        setImages(updatedItems);

        try {
            const reorderData = {
                order: updatedItems.map((item, idx) => ({
                    spotimage_id: item.spotimage_id,
                    position: idx + 1
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

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (images.length === 0) {
            showSnackbar("Please upload at least one image", "error");
            return;
        }

        onNext();
    };

    return (
        <div className={styles.stepContainer}>
            <div className={styles.form}>
                {/* Step Header */}
                <StepHeader
                    title="Image Management"
                    description="Upload and manage images for this travel spot. Use the menu options to reorder, set primary, edit, or delete images."
                />

                {/* Upload Section */}
                <FormSection
                    icon={FiUpload}
                    title="Upload New Image"
                    subtitle="Allowed Types: JPG, PNG, WebP"
                >
                    <div className={styles.uploadContainer}>
                        <div className={styles.uploadLeft}>
                            <SquareImageUpload
                                onImageSelect={handleImageSelect}
                                onRemove={handleRemoveImage}
                                previewUrl={previewUrl}
                                disabled={isUploadSpotImage}
                                loading={isUploadSpotImage}
                                maxSizeMB={50}
                                label="Upload Image"
                                size="medium"
                                enableCrop={true}
                                aspectRatio={16 / 9}
                                showCropControls={true}
                            />
                        </div>

                        <div className={styles.uploadRight}>
                            <SimpleInput
                                name="image_caption"
                                label="Image Caption (Optional)"
                                placeholder="Describe this image..."
                                value={imageCaption}
                                onChange={(e) => setImageCaption(e.target.value)}
                                size="md"
                                disabled={isUploadSpotImage}
                                description="Keep it short and descriptive"
                            />

                            <div className={styles.uploadActions}>
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handleUploadImage}
                                    isLoading={isUploadSpotImage}
                                    loadingText="Uploading..."
                                    disabled={!newImage || isUploadSpotImage}
                                    icon={<FiUpload />}
                                >
                                    Upload Image
                                </Button>
                                {newImage && (
                                    <div className={styles.fileInfo}>
                                        Selected: {newImage.name}, Size: {(newImage.size / 1024 / 1024).toFixed(2)} MB
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </FormSection>

                {/* Gallery Section */}
                <FormSection
                    icon={FiImage}
                    title={`Image Gallery (${images.length})`}
                    subtitle="Use menu options to reorder images"
                >
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
                        <div className={styles.imagesGrid}>
                            {images.map((image, index) => (
                                <SquareImageItem
                                    key={image.spotimage_id}
                                    image={image}
                                    index={index}
                                    totalItems={images.length}
                                    isPrimary={image.is_primary}
                                    isMenuOpen={openMenuId === image.spotimage_id}
                                    onMenuToggle={() => setOpenMenuId(openMenuId === image.spotimage_id ? null : image.spotimage_id)}
                                    onSetPrimary={() => handleSetPrimary(image.spotimage_id)}
                                    onEdit={() => handleStartEdit(image)}
                                    onDelete={() => handleDeleteImage(image.spotimage_id)}
                                    onMoveUp={() => handleMoveUp(index)}
                                    onMoveDown={() => handleMoveDown(index)}
                                />
                            ))}
                        </div>
                    )}
                </FormSection>

                {/* Edit Modal */}
                <EditImageModal
                    image={editingImage}
                    isSaving={isReplaceSpotImage}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />

                {/* Form Actions */}
                <StepActions
                    onBack={onBack}
                    onNext={handleFormSubmit}
                    isSubmitting={false}
                    isValid={true}
                    backText="Back to Details"
                    nextText="Save & Continue"
                    showBack={true}
                    showCancel={false}
                    showNext={true}
                    align="between"
                />
            </div>
        </div>
    );
};

export default Step4ImageManagement;