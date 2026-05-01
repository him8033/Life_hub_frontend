'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FiImage, FiX, FiUpload, FiCrop, FiCheck, FiRotateCw, FiZoomIn, FiZoomOut, FiRotateCcw, FiCamera } from 'react-icons/fi';
import Cropper from 'react-easy-crop';
import Button from '@/components/common/buttons/Button';
import LazyImage from '@/components/common/LazyImage';
import styles from '@/styles/common/ProfileImageUpload.module.css';
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

const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, {
        type: blob.type || 'image/jpeg',
        lastModified: Date.now(),
    });
};

const ProfileImageUpload = ({
    onImageSelect,
    onRemove,
    imageUrl,
    firstName = '',
    lastName = '',
    previewUrl: externalPreviewUrl,
    disabled = false,
    loading = false,
    maxSizeMB = 5,
    label = 'Upload Photo',
    accept = 'image/jpeg,image/png,image/webp,image/gif',
    size = 'medium',
    showLabel = true,
    enableCrop = true,
    aspectRatio = 1,
    onCropComplete: onCropCompleteProp,
    showCropControls = true,
    showDelete = true,
    onImageDelete,
    removeLabel = 'Remove Photo',
    changeLabel = 'Change',
    borderWidth = 4,
    imageSize = 160,
}) => {
    const [error, setError] = useState('');
    const [internalPreviewUrl, setInternalPreviewUrl] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(false);

    const previewUrl = externalPreviewUrl !== undefined ? externalPreviewUrl : internalPreviewUrl;

    const [cropState, setCropState] = useState({
        image: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
        rotation: 0,
        croppedAreaPixels: null,
        showCropper: false
    });
    const fileInputRef = useRef(null);
    const originalFileRef = useRef(null);

    useEffect(() => {
        return () => {
            if (internalPreviewUrl) {
                URL.revokeObjectURL(internalPreviewUrl);
            }
        };
    }, [internalPreviewUrl]);

    // Simulate upload progress for better UX
    useEffect(() => {
        if (loading) {
            setUploadProgress(true);
        } else {
            // Small delay to show completion
            const timer = setTimeout(() => setUploadProgress(false), 300);
            return () => clearTimeout(timer);
        }
    }, [loading]);

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
                const fileName = `profile-${Date.now()}.jpg`;
                const file = blobToFile(blob, fileName);
                resolve(file);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        originalFileRef.current = file;

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
            try {
                const compressed = await compressImage(file);
                const renamedFile = new File([compressed], file.name || `profile-${Date.now()}.jpg`, {
                    type: compressed.type || file.type || 'image/jpeg',
                    lastModified: Date.now(),
                });
                const preview = URL.createObjectURL(renamedFile);
                setInternalPreviewUrl(preview);
                onImageSelect(renamedFile, preview);
            } catch (err) {
                const preview = URL.createObjectURL(file);
                setInternalPreviewUrl(preview);
                onImageSelect(file, preview);
            }
        }
    };

    const handleClick = () => {
        if (!disabled && !loading) {
            fileInputRef.current?.click();
        }
    };

    const handleRemove = (e) => {
        if (e) e.stopPropagation();
        if (onRemove) {
            onRemove();
        }
        setInternalPreviewUrl('');
        setError('');
        originalFileRef.current = null;
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = () => {
        if (onImageDelete) {
            onImageDelete();
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
        originalFileRef.current = null;
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [cropState.image]);

    const handleCropConfirm = useCallback(async () => {
        try {
            if (!cropState.image || !cropState.croppedAreaPixels) return;

            const croppedFile = await getCroppedImg(
                cropState.image,
                cropState.croppedAreaPixels,
                cropState.rotation
            );

            let finalFile = croppedFile;
            try {
                finalFile = await compressImage(croppedFile);
                finalFile = new File([finalFile], croppedFile.name, {
                    type: finalFile.type || 'image/jpeg',
                    lastModified: Date.now(),
                });
            } catch (err) {
                console.error('Compression failed, using original cropped file:', err);
            }

            const croppedUrl = URL.createObjectURL(finalFile);

            setInternalPreviewUrl(croppedUrl);
            onImageSelect(finalFile, croppedUrl);

            URL.revokeObjectURL(cropState.image);
            setCropState({
                image: null,
                crop: { x: 0, y: 0 },
                zoom: 1,
                rotation: 0,
                croppedAreaPixels: null,
                showCropper: false
            });
            originalFileRef.current = null;
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

    const displayImage = previewUrl || imageUrl;
    const showExistingImage = imageUrl && !previewUrl;
    const showPlaceholder = !displayImage && !loading;

    const getInitials = () => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return `${first}${last}`.toUpperCase() || '?';
    };

    const containerStyle = {
        width: `${imageSize}px`,
        height: `${imageSize}px`,
        borderWidth: `${borderWidth}px`,
    };

    return (
        <div className={styles.container}>
            <div
                className={`${styles.imageWrapper} ${!displayImage && !loading ? styles.imageWrapperUpload : ''
                    } ${showExistingImage ? styles.hasExistingImage : ''} ${disabled ? styles.disabled : ''
                    } ${loading ? styles.loading : ''}`}
                style={containerStyle}
                onClick={!displayImage && !loading ? handleClick : undefined}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                role={!displayImage ? 'button' : undefined}
                tabIndex={!displayImage ? 0 : undefined}
                onKeyDown={(e) => {
                    if (!displayImage && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        handleClick();
                    }
                }}
                title={!displayImage ? label : changeLabel}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className={styles.hiddenInput}
                    disabled={disabled || loading}
                />

                {/* Preview/Image with LazyImage */}
                {displayImage && !loading ? (
                    <div className={styles.previewContainer}>
                        <LazyImage
                            src={displayImage}
                            alt="Profile"
                            className={styles.profileImage}
                            wrapperClassName={styles.lazyImageWrapper}
                            objectFit="cover"
                            showPlaceholder={true}
                            placeholderIcon={true}
                            rootMargin="0px"
                        />
                        {!disabled && (
                            <div
                                className={`${styles.hoverOverlay} ${isHovering ? styles.hoverOverlayVisible : ''}`}
                                onClick={handleClick}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleClick();
                                    }
                                }}
                            >
                                <FiCamera className={styles.hoverIcon} />
                                <span className={styles.hoverText}>{changeLabel}</span>
                            </div>
                        )}
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
                ) : loading ? (
                    // Animated loading state with shimmer
                    <div className={styles.loadingContainer}>
                        <div className={styles.shimmerCircle} />
                        <div className={styles.loadingText}>Uploading...</div>
                    </div>
                ) : (
                    // Placeholder state
                    <div className={styles.uploadContent}>
                        {showPlaceholder && (
                            <>
                                {firstName || lastName ? (
                                    <span className={styles.initialsText}>{getInitials()}</span>
                                ) : (
                                    <FiImage className={styles.uploadIcon} />
                                )}
                                <span className={styles.uploadText}>
                                    {label}
                                </span>
                                {enableCrop && (
                                    <div className={styles.cropHint}>
                                        <FiCrop />
                                        Crop enabled
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            {showExistingImage && !previewUrl && showDelete && onImageDelete && (
                <button
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    type="button"
                >
                    {removeLabel}
                </button>
            )}

            {cropState.showCropper && (
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
                                        <button onClick={handleZoomIn} className={styles.iconButtonCompact} type="button">
                                            <FiZoomIn />
                                        </button>
                                        <button onClick={handleZoomOut} className={styles.iconButtonCompact} type="button">
                                            <FiZoomOut />
                                        </button>
                                    </div>
                                    <span className={styles.valueCompact}>
                                        {Math.round(cropState.zoom * 100)}%
                                    </span>
                                </div>

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
                                        <button onClick={rotateImageAnti} className={styles.iconButtonCompact} type="button">
                                            <FiRotateCcw />
                                        </button>
                                        <button onClick={rotateImage} className={styles.iconButtonCompact} type="button">
                                            <FiRotateCw />
                                        </button>
                                    </div>
                                    <span className={styles.valueCompact}>
                                        {cropState.rotation}°
                                    </span>
                                </div>

                                <button onClick={resetCrop} className={styles.resetButtonCompact} type="button">
                                    Reset
                                </button>
                            </div>
                        )}

                        <div className={styles.cropActionsCompact}>
                            <Button variant="outline" size="sm" onClick={handleCropCancel}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleCropConfirm} icon={<FiCheck />} iconPosition="left">
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileImageUpload;