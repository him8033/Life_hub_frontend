'use client';

import { useState, useRef, useCallback } from 'react';
import { FiImage, FiX, FiUpload, FiCrop, FiCheck, FiRotateCw, FiZoomIn, FiZoomOut, FiRotateCcw } from 'react-icons/fi';
import Cropper from 'react-easy-crop';

// Custom Button Component
import Button from '@/components/common/buttons/Button';

// Styles
import styles from '@/styles/common/SquareImageUpload.module.css';
import imageCompression from "browser-image-compression";


const compressImage = async (file) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (err) {
        console.error("Compression error:", err);
        return file;
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
    enableCrop = true,
    aspectRatio = 1,
    onCropComplete: onCropCompleteProp,
    showCropControls = true
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

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        setError('');

        if (enableCrop) {
            const imageUrl = URL.createObjectURL(file);
            setCropState(prev => ({
                ...prev,
                image: imageUrl,
                showCropper: true,
                zoom: 1,
                rotation: 0,
                crop: { x: 0, y: 0 }
            }));
        } else {
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

    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCropState(prev => ({ ...prev, croppedAreaPixels }));
        if (onCropCompleteProp) {
            onCropCompleteProp(croppedArea, croppedAreaPixels);
        }
    }, [onCropCompleteProp]);

    const handleCropCancel = useCallback(() => {
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

            const fileName = `cropped-${Date.now()}.jpg`;
            let file = new File([croppedImage], fileName, { type: 'image/jpeg' });

            file = await compressImage(file);

            const croppedUrl = URL.createObjectURL(file);

            onImageSelect(file, croppedUrl);

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

    const handleZoomIn = useCallback(() => {
        setCropState(prev => ({
            ...prev,
            zoom: Math.min(prev.zoom + 0.1, 3)
        }));
    }, []);

    const handleZoomOut = useCallback(() => {
        setCropState(prev => ({
            ...prev,
            zoom: Math.max(prev.zoom - 0.1, 1)
        }));
    }, []);

    const rotateImage = useCallback(() => {
        setCropState(prev => ({
            ...prev,
            rotation: (prev.rotation + 90) % 360
        }));
    }, []);

    const rotateImageAnti = useCallback(() => {
        setCropState(prev => ({
            ...prev,
            rotation: (prev.rotation - 90 + 360) % 360
        }));
    }, []);

    const resetCrop = useCallback(() => {
        setCropState(prev => ({
            ...prev,
            zoom: 1,
            rotation: 0,
            crop: { x: 0, y: 0 }
        }));
    }, []);

    // Render compact cropper modal
    const renderCropper = () => {
        if (!cropState.showCropper) return null;

        return (
            <div className={styles.cropperModal}>
                <div className={styles.cropperContainer}>
                    <div className={styles.cropperHeader}>
                        <h3 className={styles.cropperTitle}>Crop Image</h3>
                        <button
                            onClick={handleCropCancel}
                            className={styles.closeButton}
                            type="button"
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
                            onCropComplete={handleCropComplete}
                        />
                    </div>

                    {showCropControls && (
                        <div className={styles.cropControlsCompact}>
                            {/* Zoom Control - Compact */}
                            <div className={styles.controlRowCompact}>
                                <div className={styles.controlGroupCompact}>
                                    <FiZoomIn className={styles.controlIconCompact} />
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.01}
                                        value={cropState.zoom}
                                        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                                        className={styles.sliderCompact}
                                    />
                                    <button
                                        onClick={handleZoomIn}
                                        className={styles.iconButtonCompact}
                                        type="button"
                                    >
                                        <FiZoomIn />
                                    </button>
                                    <button
                                        onClick={handleZoomOut}
                                        className={styles.iconButtonCompact}
                                        type="button"
                                    >
                                        <FiZoomOut />
                                    </button>
                                </div>
                                <span className={styles.valueCompact}>
                                    {Math.round(cropState.zoom * 100)}%
                                </span>
                            </div>

                            {/* Rotation Control - Compact */}
                            <div className={styles.controlRowCompact}>
                                <div className={styles.controlGroupCompact}>
                                    <FiRotateCw className={styles.controlIconCompact} />
                                    <input
                                        type="range"
                                        min={0}
                                        max={360}
                                        step={1}
                                        value={cropState.rotation}
                                        onChange={(e) => onRotationChange(parseInt(e.target.value))}
                                        className={styles.sliderCompact}
                                    />
                                    <button
                                        onClick={rotateImageAnti}
                                        className={styles.iconButtonCompact}
                                        type="button"
                                    >
                                        <FiRotateCcw />
                                    </button>
                                    <button
                                        onClick={rotateImage}
                                        className={styles.iconButtonCompact}
                                        type="button"
                                    >
                                        <FiRotateCw />
                                    </button>
                                </div>
                                <span className={styles.valueCompact}>
                                    {cropState.rotation}°
                                </span>
                            </div>

                            {/* Reset Button - Compact */}
                            <button
                                onClick={resetCrop}
                                className={styles.resetButtonCompact}
                                type="button"
                            >
                                Reset
                            </button>
                        </div>
                    )}

                    <div className={styles.cropActionsCompact}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCropCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleCropConfirm}
                            icon={<FiCheck />}
                            iconPosition="left"
                        >
                            Apply
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

            {renderCropper()}
        </div>
    );
};

export default SquareImageUpload;