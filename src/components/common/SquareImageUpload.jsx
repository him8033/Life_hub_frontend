// components/common/SquareImageUpload.jsx
'use client';

import { useState, useRef } from 'react';
import { FiImage, FiX, FiUpload } from 'react-icons/fi';

// Shadcn Components
import { Button } from '@/components/ui/button';

// Styles
import styles from '@/styles/common/SquareImageUpload.module.css';

const SquareImageUpload = ({
    onImageSelect,
    onRemove,
    previewUrl,
    disabled = false,
    loading = false,
    maxSizeMB = 5,
    label = 'Upload Image',
    accept = 'image/*',
    size = 'medium', // 'small' | 'medium' | 'large'
    showLabel = true,
    compact = false // Add this prop
}) => {
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const sizeClasses = {
        small: styles.small,
        medium: styles.medium,
        large: styles.large
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        setError('');
        onImageSelect(file);
    };

    const handleClick = () => {
        if (!disabled && !loading) {
            fileInputRef.current?.click();
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onRemove();
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`${styles.uploadContainer} ${compact ? styles.compact : ''}`}>
            <div className={styles.container}>
                <div className={styles.uploadArea}>
                    <div
                        className={`${styles.uploadBox} ${sizeClasses[size]} ${previewUrl ? styles.hasPreview : ''} ${disabled ? styles.disabled : ''}`}
                        onClick={handleClick}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            onChange={handleFileChange}
                            className={styles.hiddenInput}
                            disabled={disabled || loading}
                        />

                        {previewUrl ? (
                            <div className={styles.previewContainer}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className={styles.previewImage}
                                />
                                {!disabled && (
                                    <button
                                        type="button"
                                        className={styles.removeButton}
                                        onClick={handleRemove}
                                        disabled={loading}
                                    >
                                        <FiX />
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className={styles.uploadContent}>
                                <FiImage className={styles.uploadIcon} />
                                <span className={styles.uploadText}>
                                    {loading ? 'Uploading...' : label}
                                </span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SquareImageUpload;