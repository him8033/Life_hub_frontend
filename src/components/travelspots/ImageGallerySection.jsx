'use client';

import Button from '@/components/common/buttons/Button';
import SimpleInput from '@/components/common/forms/SimpleInput';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import styles from '@/styles/travelspots/ImageGallerySection.module.css';

const ImageGallerySection = ({ images, onUpload, onDelete, onSetPrimary, isLoading }) => {
    return (
        <div className={styles.photosTab}>
            <div className={styles.photosHeader}>
                <h3>Photo Gallery</h3>
                <span className={styles.photoCount}>{images.length} photos</span>
            </div>

            {/* Upload Section */}
            {/* <div className={styles.uploadSection}>
                <div className={styles.uploadArea}>
                    <FiImage className={styles.uploadIcon} />
                    <p className={styles.uploadText}>Drag & drop or click to upload</p>
                    <p className={styles.uploadHint}>Max 5MB • JPG, PNG, WebP</p>
                    <Button variant="primary" size="md" isLoading={isLoading}>
                        <FiUpload /> Upload Image
                    </Button>
                </div>
                <SimpleInput
                    name="image_caption"
                    placeholder="Image caption (optional)"
                    size="md"
                    className={styles.captionInput}
                />
            </div> */}

            {/* Photos Grid */}
            <div className={styles.photosGrid}>
                {images.map((image, index) => (
                    <div key={image.id || index} className={styles.photoItem}>
                        <img src={image.image_url} alt={image.caption || `Image ${index + 1}`} loading="lazy" />
                        {image.caption && <div className={styles.photoCaption}>{image.caption}</div>}
                        {/* <div className={styles.photoOverlay}>
                            <Button
                                variant="outline"
                                size="sm"
                                className={styles.photoActionBtn}
                                title="Set as Primary"
                            >
                                ⭐
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`${styles.photoActionBtn} ${styles.deleteBtn}`}
                                title="Delete"
                            >
                                <FiX />
                            </Button>
                        </div> */}
                        {image.is_primary && <div className={styles.primaryBadge}>Primary</div>}
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className={styles.noPhotos}>
                    <FiImage className={styles.noPhotosIcon} />
                    <p>No photos available</p>
                    <p className={styles.noPhotosHint}>Upload your first image to showcase this spot</p>
                </div>
            )}
        </div>
    );
};

export default ImageGallerySection;