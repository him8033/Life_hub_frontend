// src/components/common/preview/PreviewPanel.jsx

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import styles from '@/styles/common/preview/PreviewPanel.module.css';

export default function PreviewPanel({
    paperStyle,
    zoom,
    previewKey,
    iframeRef,
    previewUrl,
    canPreview,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onRefresh,
    paperLabel,
    zoomLabel,
    isWebpage = false,
}) {
    const isFirstLoad = useRef(true);
    const containerRef = useRef(null);
    const [fitScale, setFitScale] = useState(1);

    // Calculate the scale to fit the paper within the container
    // Calculate the scale to fit the paper within the container
    const calculateFitScale = useCallback(() => {
        if (!containerRef.current) return 1;

        const container = containerRef.current;

        // Minimal padding to reduce gapping
        const availableWidth = container.clientWidth - 4;
        const availableHeight = container.clientHeight - 4;

        const paperWidth = parseFloat(paperStyle.width) || 794;
        const paperHeight = parseFloat(paperStyle.height) || 1123;

        const scaleX = availableWidth / paperWidth;
        const scaleY = availableHeight / paperHeight;

        // Allow scaling up to fill space, but don't exceed 1.5x (150%)
        return Math.max(Math.min(scaleX, scaleY, 1.5), 0.1);
    }, [paperStyle]);

    // Update scale on resize
    useEffect(() => {
        const updateScale = () => {
            setFitScale(calculateFitScale());
        };

        updateScale();

        const resizeObserver = new ResizeObserver(updateScale);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', updateScale);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateScale);
        };
    }, [calculateFitScale]);

    // Use location.replace to avoid adding history entries
    useEffect(() => {
        if (iframeRef.current && previewUrl) {
            const iframe = iframeRef.current;

            try {
                if (iframe.contentWindow?.location?.replace) {
                    if (!isFirstLoad.current) {
                        iframe.contentWindow.location.replace(previewUrl);
                    } else {
                        iframe.src = previewUrl;
                        isFirstLoad.current = false;
                    }
                } else {
                    const url = new URL(previewUrl, window.location.origin);
                    url.searchParams.set('_t', Date.now());
                    iframe.src = url.toString();
                }
            } catch (error) {
                if (!isFirstLoad.current) {
                    const currentSrc = iframe.src;
                    if (currentSrc && !currentSrc.includes('about:blank')) {
                        iframe.src = 'about:blank';
                        setTimeout(() => {
                            iframe.src = previewUrl;
                        }, 50);
                    }
                } else {
                    iframe.src = previewUrl;
                    isFirstLoad.current = false;
                }
            }
        }
    }, [previewKey, previewUrl, iframeRef]);

    // Cleanup function
    useEffect(() => {
        return () => {
            if (iframeRef.current) {
                try {
                    iframeRef.current.src = 'about:blank';
                } catch (e) {
                    // Ignore errors
                }
            }
        };
    }, [iframeRef]);

    // Calculate the final scale (user zoom * fit scale)
    const finalScale = (zoom / 100) * fitScale;

    return (
        <div className={styles.previewPanel}>
            <div className={styles.previewLabel}>
                <span className={styles.dot} />
                <span className={styles.labelText}>Live Preview</span>
                <span className={styles.badge}>{paperLabel || 'Auto'}</span>
                <span className={styles.badge}>{zoomLabel || zoom}%</span>

                <div className={styles.zoomControls}>
                    <Button variant="outline" size="sm" onClick={onZoomOut} title="Zoom Out">−</Button>
                    <Button variant="outline" size="sm" onClick={onZoomReset} title="Reset Zoom">100%</Button>
                    <Button variant="outline" size="sm" onClick={onZoomIn} title="Zoom In">+</Button>
                </div>

                <Button variant="outline" size="sm" icon={<FiRefreshCw />} onClick={onRefresh} title="Refresh" />
            </div>

            <div className={styles.previewFrame}>
                {canPreview && previewUrl ? (
                    <div
                        ref={containerRef}
                        className={isWebpage ? styles.webpageScroll : styles.scrollArea}
                    >
                        <div
                            className={isWebpage ? styles.webpagePaper : styles.paper}
                            style={{
                                ...paperStyle,
                                transform: isWebpage ? 'none' : `scale(${finalScale})`,
                                transformOrigin: 'top center',
                                // For webpage: take full width, for document: use fixed size
                                width: isWebpage ? '100%' : (paperStyle.width || '794px'),
                                height: isWebpage ? '100%' : (paperStyle.height || '1123px'),
                                // Prevent scaling from affecting layout
                                flexShrink: 0,
                            }}
                        >
                            <iframe
                                key={previewKey}
                                ref={iframeRef}
                                src={previewUrl}
                                className={isWebpage ? styles.webpageIframe : styles.iframe}
                                title="Preview"
                                style={isWebpage ? {
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    display: 'block',
                                } : {}}
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <p>Preview not available</p>
                        <p className={styles.hint}>
                            {isWebpage
                                ? 'Make your portfolio public to see the live preview'
                                : 'Make your resume public to see the live preview'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}