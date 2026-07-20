// src/components/common/preview/PreviewPanel.jsx

'use client';

import { useEffect } from 'react';
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
    // Reload iframe when previewKey changes
    useEffect(() => {
        if (iframeRef.current && previewUrl) {
            // Force iframe to reload
            const iframe = iframeRef.current;
            const currentSrc = iframe.src;
            if (currentSrc && !currentSrc.includes('about:blank')) {
                iframe.src = 'about:blank';
                setTimeout(() => {
                    iframe.src = previewUrl;
                }, 100);
            }
        }
    }, [previewKey, previewUrl, iframeRef]);

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