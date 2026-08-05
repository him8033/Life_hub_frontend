// src/hooks/usePreviewSettings.js

import { useState, useCallback, useRef } from 'react';

// Paper sizes for resume (document view)
export const PAPER_SIZES = [
    // { value: 'auto', label: 'Fit', w: 0, h: 0 },
    { value: 'a4', label: 'A4', w: 210, h: 297 },
    // { value: 'a3', label: 'A3', w: 297, h: 420 },
    // { value: 'a5', label: 'A5', w: 148, h: 210 },
    // { value: 'letter', label: 'Letter', w: 216, h: 279 },
    // { value: 'legal', label: 'Legal', w: 216, h: 356 },
];

// Viewport sizes for portfolio (webpage view)
export const VIEWPORT_SIZES = [
    { value: 'desktop', label: 'Desktop', w: 1440, h: 900 },
    { value: 'laptop', label: 'Laptop', w: 1024, h: 768 },
    { value: 'tablet', label: 'Tablet', w: 768, h: 1024 },
    { value: 'mobile', label: 'Mobile', w: 375, h: 812 },
    { value: 'custom', label: 'Custom', w: null, h: null },
];

export const LAYOUTS = [
    // { value: 20, label: '20/80' },
    // { value: 30, label: '30/70' },
    // { value: 40, label: '40/60' },
    { value: 50, label: '50/50' },
    // { value: 60, label: '60/40' },
    // { value: 70, label: '70/30' },
    // { value: 80, label: '80/20' },
    // { value: 90, label: '90/10' },
];

export function usePreviewSettings(defaultSize = 'a4', defaultZoom = 100, viewMode = 'document') {
    const [viewportSize, setViewportSize] = useState(defaultSize);
    const [customWidth, setCustomWidth] = useState('');
    const [customHeight, setCustomHeight] = useState('');
    const [zoom, setZoom] = useState(defaultZoom);
    const [previewKey, setPreviewKey] = useState(0);
    const iframeRef = useRef(null);
    const refreshCount = useRef(0);

    const refresh = useCallback(() => {
        // Increment refresh count for tracking
        refreshCount.current += 1;
        // Use a more stable key that doesn't cause history issues
        setPreviewKey(prev => prev + 1);
    }, []);

    // Method to refresh without creating history entries
    const refreshIframe = useCallback(() => {
        if (iframeRef.current) {
            try {
                // Try to use location.reload() which doesn't create history entries
                if (iframeRef.current.contentWindow?.location?.reload) {
                    iframeRef.current.contentWindow.location.reload();
                    return;
                }
            } catch (e) {
                // Cross-origin - fallback to src change
            }

            // Fallback: change src without adding to history
            const currentSrc = iframeRef.current.src;
            if (currentSrc && !currentSrc.includes('about:blank')) {
                // Use a unique but non-history-changing approach
                const url = new URL(currentSrc);
                const timestamp = Date.now();
                url.searchParams.set('_refresh', timestamp.toString());

                // Use replace to avoid history entry
                try {
                    iframeRef.current.contentWindow?.location?.replace(url.toString());
                } catch (e) {
                    // Ultimate fallback
                    const tempSrc = iframeRef.current.src;
                    iframeRef.current.src = 'about:blank';
                    setTimeout(() => {
                        iframeRef.current.src = tempSrc;
                    }, 50);
                }
            }
        }
    }, [iframeRef]);

    const zoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
    const zoomOut = () => setZoom(prev => Math.max(prev - 10, 30));
    const zoomReset = () => setZoom(100);

    const getPaperStyle = () => {
        // For webpage view (portfolio) - using viewport sizes
        if (viewMode === 'webpage') {
            const size = VIEWPORT_SIZES.find(s => s.value === viewportSize);

            // If custom viewport
            if (viewportSize === 'custom') {
                const width = customWidth ? parseInt(customWidth) : 1024;
                const height = customHeight ? parseInt(customHeight) : 768;
                return {
                    width: `${width}px`,
                    height: `${height}px`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    background: 'white',
                    overflow: 'auto',
                    borderRadius: '4px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                    flexShrink: 0,
                };
            }

            if (!size || size.value === 'auto') {
                return {
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    overflow: 'auto',
                };
            }

            return {
                width: `${size.w * s}px`,
                height: `${size.h * s}px`,
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                borderRadius: '4px',
                background: 'white',
                overflow: 'hidden',
                flexShrink: 0,
            };
        }

        // For document view (resume) - using paper sizes
        const size = PAPER_SIZES.find(s => s.value === viewportSize);
        if (!size || size.value === 'auto') {
            return {
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                overflow: 'auto',
            };
        }
        const s = 3.78;
        return {
            width: `${size.w * s}px`,
            height: `${size.h * s}px`,
            maxWidth: '100%',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            borderRadius: '4px',
            background: 'white',
            overflow: 'hidden',
            flexShrink: 0,
        };
    };

    const print = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.focus();
            iframeRef.current.contentWindow.print();
        }
    };

    // Get the current viewport label
    const getViewportLabel = () => {
        if (viewportSize === 'custom') {
            return `${customWidth || '?'}×${customHeight || '?'}`;
        }
        const size = VIEWPORT_SIZES.find(s => s.value === viewportSize);
        return size?.label || 'Auto';
    };

    return {
        viewportSize,
        setViewportSize,
        customWidth,
        setCustomWidth,
        customHeight,
        setCustomHeight,
        zoom,
        previewKey,
        refresh,
        refreshIframe, // New method for history-safe refresh
        zoomIn,
        zoomOut,
        zoomReset,
        getPaperStyle,
        print,
        iframeRef,
        isWebpage: viewMode === 'webpage',
        getViewportLabel,
    };
}