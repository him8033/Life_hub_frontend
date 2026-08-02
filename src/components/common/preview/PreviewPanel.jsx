// src/components/common/preview/PreviewPanel.jsx

'use client';

import { useEffect, useRef } from 'react';
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

    // Use location.replace to avoid adding history entries
    useEffect(() => {
        if (iframeRef.current && previewUrl) {
            const iframe = iframeRef.current;

            // Try to use location.replace if available
            try {
                if (iframe.contentWindow?.location?.replace) {
                    if (!isFirstLoad.current) {
                        // Use replace for subsequent loads
                        iframe.contentWindow.location.replace(previewUrl);
                    } else {
                        // First load can use src
                        iframe.src = previewUrl;
                        isFirstLoad.current = false;
                    }
                } else {
                    // Fallback: use src but with a cache-busting parameter
                    // that doesn't affect history
                    const url = new URL(previewUrl, window.location.origin);
                    url.searchParams.set('_t', Date.now());
                    iframe.src = url.toString();
                }
            } catch (error) {
                // Cross-origin fallback - reload iframe without adding history
                if (!isFirstLoad.current) {
                    // Use a hidden technique to reload without history
                    const currentSrc = iframe.src;
                    if (currentSrc && !currentSrc.includes('about:blank')) {
                        // Force reload without history using a temporary document
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

    // Cleanup function to prevent memory leaks
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
                    <div className={isWebpage ? styles.webpageScroll : styles.scrollArea}>
                        <div
                            className={isWebpage ? styles.webpagePaper : styles.paper}
                            style={isWebpage ? {
                                ...paperStyle,
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'top center',
                            } : {
                                ...paperStyle,
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'top center',
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