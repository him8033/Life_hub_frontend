'use client';

import { FiX } from 'react-icons/fi';

// Custom Components
import Button from '@/components/common/buttons/Button';
import ButtonGroup from '@/components/common/buttons/ButtonGroup';
import SimpleInput from '@/components/common/forms/SimpleInput';
import SquareImageUpload from '@/components/common/SquareImageUpload';

// Styles
import styles from '@/styles/travelspots/steps/EditImageModal.module.css';
import { useEffect, useState } from 'react';

const EditImageModal = ({
    image,
    isSaving,
    onSave,
    onCancel,
}) => {
    const [editCaption, setEditCaption] = useState(image?.caption || '');
    const [editImageFile, setEditImageFile] = useState(null);
    const [editPreviewUrl, setEditPreviewUrl] = useState('');

    // Reset state when image changes
    useEffect(() => {
        if (image) {
            setEditCaption(image.caption || '');
            setEditImageFile(null);
            setEditPreviewUrl('');
        }
    }, [image]);

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (editPreviewUrl) {
                URL.revokeObjectURL(editPreviewUrl);
            }
        };
    }, [editPreviewUrl]);

    const handleEditImageSelect = (file, url) => {
        setEditImageFile(file);
        setEditPreviewUrl(url);
    };

    const handleRemoveEditImage = () => {
        setEditImageFile(null);
        if (editPreviewUrl) {
            URL.revokeObjectURL(editPreviewUrl);
        }
        setEditPreviewUrl('');
    };

    const handleSave = () => {
        onSave({
            caption: editCaption,
            imageFile: editImageFile,
        });
    };

    if (!image) return null;

    return (
        <div className={styles.editModalOverlay} onClick={onCancel}>
            <div className={styles.editModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.editModalHeader}>
                    <h3 className={styles.editModalTitle}>Edit Image</h3>
                    <button onClick={onCancel} className={styles.closeButton}>
                        <FiX />
                    </button>
                </div>

                <div className={styles.editModalContent}>
                    {/* Current Image Preview */}
                    <div className={styles.currentImageSection}>
                        <h4 className={styles.editSectionSubtitle}>Current Image</h4>
                        <div className={styles.currentImagePreview}>
                            <img
                                src={image.image_url}
                                alt={image.caption || 'Current image'}
                                className={styles.currentImage}
                            />
                        </div>
                    </div>

                    {/* Replace Image Section */}
                    <div className={styles.replaceImageSection}>
                        <h4 className={styles.editSectionSubtitle}>Replace Image (Optional)</h4>
                        <SquareImageUpload
                            onImageSelect={handleEditImageSelect}
                            onRemove={handleRemoveEditImage}
                            previewUrl={editPreviewUrl}
                            disabled={isSaving}
                            loading={false}
                            maxSizeMB={50}
                            label="Choose New Image"
                            size='medium'
                            enableCrop={true}
                            aspectRatio={16 / 9}
                            showCropControls={true}
                        />
                    </div>

                    {/* Caption Section */}
                    <div className={styles.captionSection}>
                        <h4 className={styles.editSectionSubtitle}>Caption</h4>
                        <SimpleInput
                            name="edit_caption"
                            placeholder="Enter caption for this image"
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            size="md"
                            disabled={isSaving}
                        />
                        <div className={styles.captionHint}>
                            Leave empty to remove caption
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <ButtonGroup align="end" className={styles.editModalActions}>
                        <Button
                            variant="outline"
                            size="md"
                            onClick={onCancel}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleSave}
                            isLoading={isSaving}
                            loadingText="Saving..."
                            disabled={isSaving}
                        >
                            Save Changes
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
};

export default EditImageModal;