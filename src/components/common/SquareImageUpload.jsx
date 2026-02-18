'use client';

import { useState, useRef, useCallback } from 'react';
import { FiImage, FiX, FiUpload, FiCrop, FiCheck, FiRotateCw } from 'react-icons/fi';
import Cropper from 'react-easy-crop';

// Shadcn Components
import { Button } from '@/components/ui/button';

// Styles
import styles from '@/styles/common/SquareImageUpload.module.css';
import imageCompression from "browser-image-compression";


const compressImage = async (file) => {
    const options = {
        maxSizeMB: 1,            // target size
        maxWidthOrHeight: 1600,  // resize large images
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (err) {
        console.error("Compression error:", err);
        return file; // fallback to original
    }
};

const SquareImageUpload = ({
    onImageSelect,
    onRemove,
    previewUrl,
    disabled = false,
    loading = false,
    maxSizeMB = 5,
    label = 'Upload Image',
    accept = 'image/*',
    size = 'medium',
    showLabel = true,
    compact = false,
    enableCrop = true, // New prop to enable/disable cropping
    aspectRatio = 1, // Default square aspect ratio
    onCropComplete: onCropCompleteProp, // Rename prop to avoid conflict
    showCropControls = true // Show crop controls
}) => {
    const [error, setError] = useState('');
    const [cropState, setCropState] = useState({
        image: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        rotation: 0,
        croppedAreaPixels: null,
        showCropper: false
    });
    const fileInputRef = useRef(null);

    const sizeClasses = {
        small: styles.small,
        medium: styles.medium,
        large: styles.large
    };

    // Create a blob URL from the cropped image
    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        // set each dimensions to double largest dimension to allow for a safe area for the
        // image to rotate in without being clipped by canvas context
        canvas.width = safeArea;
        canvas.height = safeArea;

        // translate canvas context to a central location on image to allow rotating around the center.
        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        // draw rotated image and store data.
        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // paste generated rotate image with correct offsets for x,y crop values.
        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        // As a blob
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleFileChange = async (e) => {
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

        if (enableCrop) {
            // Show cropper
            const imageUrl = URL.createObjectURL(file);
            setCropState(prev => ({
                ...prev,
                image: imageUrl,
                showCropper: true
            }));
        } else {
            // Compress before direct upload
            const compressed = await compressImage(file);
            const preview = URL.createObjectURL(compressed);
            onImageSelect(compressed, preview);
        }
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

    const onCropChange = useCallback((crop) => {
        setCropState(prev => ({ ...prev, crop }));
    }, []);

    const onZoomChange = useCallback((zoom) => {
        setCropState(prev => ({ ...prev, zoom }));
    }, []);

    const onRotationChange = useCallback((rotation) => {
        setCropState(prev => ({ ...prev, rotation }));
    }, []);

    // Renamed this function to avoid conflict with prop
    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCropState(prev => ({ ...prev, croppedAreaPixels }));
        // Call the prop callback if provided
        if (onCropCompleteProp) {
            onCropCompleteProp(croppedArea, croppedAreaPixels);
        }
    }, [onCropCompleteProp]);

    const handleCropCancel = useCallback(() => {
        // Cleanup the image URL
        if (cropState.image) {
            URL.revokeObjectURL(cropState.image);
        }

        setCropState({
            image: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            rotation: 0,
            croppedAreaPixels: null,
            showCropper: false
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [cropState.image]);

    const handleCropConfirm = useCallback(async () => {
        try {
            if (!cropState.image || !cropState.croppedAreaPixels) return;

            const croppedImage = await getCroppedImg(
                cropState.image,
                cropState.croppedAreaPixels,
                cropState.rotation
            );

            // Convert blob to file
            const fileName = `cropped-${Date.now()}.jpg`;
            let file = new File([croppedImage], fileName, { type: 'image/jpeg' });

            // Compress the cropped image
            file = await compressImage(file);

            const croppedUrl = URL.createObjectURL(file);

            onImageSelect(file, croppedUrl);

            // Cleanup
            URL.revokeObjectURL(cropState.image);
            setCropState({
                image: null,
                crop: { x: 0, y: 0 },
                zoom: 1,
                rotation: 0,
                croppedAreaPixels: null,
                showCropper: false
            });
        } catch (error) {
            setError('Failed to crop image');
            console.error('Error cropping image:', error);
        }
    }, [cropState, onImageSelect]);

    const rotateImage = useCallback(() => {
        setCropState(prev => ({
            ...prev,
            rotation: (prev.rotation + 90) % 360
        }));
    }, []);

    // Render cropper modal
    const renderCropper = () => {
        if (!cropState.showCropper) return null;

        return (
            <div className={styles.cropperModal}>
                <div className={styles.cropperContainer}>
                    <div className={styles.cropperHeader}>
                        <h3>Crop Image</h3>
                        <button
                            onClick={handleCropCancel}
                            className={styles.closeButton}
                        >
                            <FiX />
                        </button>
                    </div>

                    <div className={styles.cropperArea}>
                        <Cropper
                            image={cropState.image}
                            crop={cropState.crop}
                            zoom={cropState.zoom}
                            rotation={cropState.rotation}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={handleCropComplete} // Use renamed function
                        />
                    </div>

                    {showCropControls && (
                        <div className={styles.cropControls}>
                            <div className={styles.controlGroup}>
                                <label>Zoom</label>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={cropState.zoom}
                                    onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                                    className={styles.zoomSlider}
                                />
                            </div>

                            <div className={styles.controlGroup}>
                                <label>Rotation</label>
                                <div className={styles.rotationControls}>
                                    <button
                                        onClick={rotateImage}
                                        className={styles.rotationButton}
                                    >
                                        <FiRotateCw />
                                        Rotate 90°
                                    </button>
                                    <input
                                        type="range"
                                        min={0}
                                        max={360}
                                        step={1}
                                        value={cropState.rotation}
                                        onChange={(e) => onRotationChange(parseInt(e.target.value))}
                                        className={styles.rotationSlider}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.cropActions}>
                        <Button
                            variant="outline"
                            onClick={handleCropCancel}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCropConfirm}
                            className={styles.confirmButton}
                        >
                            <FiCheck />
                            Crop & Save
                        </Button>
                    </div>
                </div>
            </div>
        );
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
                                {enableCrop && (
                                    <div className={styles.cropHint}>
                                        <FiCrop />
                                        Crop enabled
                                    </div>
                                )}
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

            {/* Cropper Modal */}
            {renderCropper()}
        </div>
    );
};

export default SquareImageUpload;