// src/components/common/preview/PreviewPanel.jsx

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import styles from '@/styles/common/preview/PreviewPanel.module.css';

// A4 paper dimensions in pixels (at 96 DPI)
const A4_WIDTH_PX = 794;  // 210mm
const A4_HEIGHT_PX = 1123; // 297mm

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
    const previewViewportRef = useRef(null);
    const a4ContainerRef = useRef(null);
    const [fitScale, setFitScale] = useState(1);
    const [zoomCenter, setZoomCenter] = useState({ x: 0.5, y: 0.5 });

    // Calculate the scale to fit the A4 paper within the preview viewport
    const calculateFitScale = useCallback(() => {
        if (!previewViewportRef.current) return 1;

        const viewport = previewViewportRef.current;

        // For webpage (portfolio), use responsive sizing
        if (isWebpage) {
            return 1.0; // No scaling for responsive webpage view
        }

        // For document (resume), use fixed A4 dimensions
        const padding = 20;
        const availableWidth = viewport.clientWidth - (padding * 2);
        const availableHeight = viewport.clientHeight - padding;

        const a4Width = A4_WIDTH_PX;
        const a4Height = A4_HEIGHT_PX;

        const scaleX = availableWidth / a4Width;
        const scaleY = availableHeight / a4Height;

        // Use the smaller scale to fit entirely, but allow up to 1.0 (100%)
        return Math.max(Math.min(scaleX, scaleY, 1.0), 0.1);
    }, [isWebpage]);

    // Update scale on resize
    useEffect(() => {
        const updateScale = () => {
            setFitScale(calculateFitScale());
        };

        updateScale();

        const resizeObserver = new ResizeObserver(updateScale);
        if (previewViewportRef.current) {
            resizeObserver.observe(previewViewportRef.current);
        }

        window.addEventListener('resize', updateScale);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateScale);
        };
    }, [calculateFitScale]);

    // Calculate the final scale (user zoom * fit scale)
    const finalScale = isWebpage ? (zoom / 100) : (zoom / 100) * fitScale;

    // Update scroll position after zoom to maintain center focus
    useEffect(() => {
        if (previewViewportRef.current && zoomCenter.x !== 0) {
            const viewport = previewViewportRef.current;

            // Maintain the same center point after zoom
            const newScrollLeft = (viewport.scrollWidth * zoomCenter.x) - (viewport.clientWidth / 2);
            const newScrollTop = (viewport.scrollHeight * zoomCenter.y) - (viewport.clientHeight / 2);

            viewport.scrollTo({
                left: Math.max(0, newScrollLeft),
                top: Math.max(0, newScrollTop),
                behavior: 'smooth'
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finalScale]);

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

    // Track center point for zoom focus (only on initial load and fit scale changes)
    useEffect(() => {
        if (previewViewportRef.current) {
            const viewport = previewViewportRef.current;
            const centerX = viewport.scrollLeft + viewport.clientWidth / 2;
            const centerY = viewport.scrollTop + viewport.clientHeight / 2;

            setZoomCenter({
                x: centerX / (viewport.scrollWidth || 1),
                y: centerY / (viewport.scrollHeight || 1)
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fitScale]);

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
                        ref={previewViewportRef}
                        className={isWebpage ? styles.webpageViewport : styles.previewViewport}
                    >
                        {!isWebpage && (
                            <div
                                ref={a4ContainerRef}
                                className={styles.a4Paper}
                                style={{
                                    transform: `scale(${finalScale})`,
                                    transformOrigin: 'top center',
                                    // Fixed A4 dimensions for resume
                                    width: `${A4_WIDTH_PX}px`,
                                    height: `${A4_HEIGHT_PX}px`,
                                }}
                            >
                                <iframe
                                    key={previewKey}
                                    ref={iframeRef}
                                    src={previewUrl}
                                    className={styles.iframe}
                                    title="Preview"
                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                                />
                            </div>
                        )}
                        {isWebpage && (
                            <div
                                ref={a4ContainerRef}
                                className={styles.webpageContainer}
                                style={{
                                    // Responsive sizing for portfolio
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '500px',
                                }}
                            >
                                <iframe
                                    key={previewKey}
                                    ref={iframeRef}
                                    src={previewUrl}
                                    className={styles.webpageIframe}
                                    title="Preview"
                                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                                />
                            </div>
                        )}
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