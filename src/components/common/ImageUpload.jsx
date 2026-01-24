'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import styles from '@/styles/common/ImageUpload.module.css';

export default function ImageUpload({
    onUpload,
    multiple = false,
    maxFiles = 10,
    disabled = false,
    existingImages = [],
}) {
    const [images, setImages] = useState(existingImages);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        handleFiles(files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const files = Array.from(event.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const validFiles = files.filter(file =>
            file.type.startsWith('image/') &&
            file.size <= 5 * 1024 * 1024 // 5MB limit
        ).slice(0, maxFiles - images.length);

        if (validFiles.length === 0) return;

        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
        }));

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);

        if (onUpload) {
            onUpload(updatedImages);
        }
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        if (onUpload) {
            onUpload(updatedImages);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={styles.imageUploadContainer}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={disabled}
            />

            {/* Upload Area */}
            <div
                className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${disabled ? styles.disabled : ''}`}
                onClick={!disabled ? triggerFileInput : undefined}
                onDragOver={!disabled ? handleDragOver : undefined}
                onDragLeave={!disabled ? handleDragLeave : undefined}
                onDrop={!disabled ? handleDrop : undefined}
            >
                <FiUpload className={styles.uploadIcon} />
                <div className={styles.uploadText}>
                    <p className={styles.uploadTitle}>
                        {isDragging ? 'Drop images here' : 'Click or drag images here'}
                    </p>
                    <p className={styles.uploadSubtitle}>
                        Supports JPG, PNG, WebP • Max 5MB per image
                    </p>
                </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
                <div className={styles.previewContainer}>
                    <div className={styles.previewHeader}>
                        <span className={styles.previewTitle}>
                            <FiImage className={styles.previewIcon} />
                            Uploaded Images ({images.length}/{maxFiles})
                        </span>
                    </div>

                    <div className={styles.imageGrid}>
                        {images.map((image, index) => (
                            <div key={index} className={styles.imageItem}>
                                <img
                                    src={image.preview || image.url}
                                    alt={image.name}
                                    className={styles.imagePreview}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className={styles.removeButton}
                                    disabled={disabled}
                                >
                                    <FiX size={14} />
                                </button>
                                <div className={styles.imageInfo}>
                                    <span className={styles.imageName}>
                                        {image.name}
                                    </span>
                                    <span className={styles.imageSize}>
                                        {(image.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}