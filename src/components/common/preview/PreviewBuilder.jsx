// src/components/common/preview/PreviewBuilder.jsx

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useResizablePanel } from '@/hooks/useResizablePanel';
import { usePreviewSettings, PAPER_SIZES } from '@/hooks/usePreviewSettings';
import PreviewTopBar from './PreviewTopBar';
import SectionPanel from './SectionPanel';
import PreviewPanel from './PreviewPanel';
import styles from '@/styles/common/preview/PreviewBuilder.module.css';

export default function PreviewBuilder({
    // Data
    title,
    previewUrl,
    canPreview = false,
    canPrint = false,

    // Sections
    sections = [],
    activeSection,
    onSectionChange,
    renderSection,
    getSectionIcon,
    getRequired,

    // Actions
    onBack,
    onSettings,
    onPreview,
    onExport,

    // Defaults
    defaultLayout = 50,
    defaultSize = 'a4',
    defaultZoom = 100,
    viewMode = 'document',
    refreshTrigger = 0, // New prop to force refresh
}) {
    const { leftWidth, setLeftWidth, isDragging, handleMouseDown, containerRef } = useResizablePanel(defaultLayout);
    const {
        viewportSize,
        setViewportSize,
        customWidth,
        setCustomWidth,
        customHeight,
        setCustomHeight,
        zoom,
        previewKey,
        refresh,
        zoomIn,
        zoomOut,
        zoomReset,
        getPaperStyle,
        print,
        iframeRef,
        isWebpage,
        getViewportLabel,
    } = usePreviewSettings(defaultSize, defaultZoom, viewMode);

    const previousRefreshTrigger = useRef(refreshTrigger);

    // Force refresh when refreshTrigger changes
    useEffect(() => {
        if (previousRefreshTrigger.current !== refreshTrigger) {
            previousRefreshTrigger.current = refreshTrigger;
            refresh();
        }
    }, [refreshTrigger, refresh]);

    // Ctrl+P shortcut
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p' && canPrint) {
                e.preventDefault();
                print();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [canPrint, print]);

    const paper = PAPER_SIZES.find(s => s.value === viewportSize);

    return (
        <div className={styles.builder}>
            <PreviewTopBar
                title={title}
                onBack={onBack}
                onSettings={onSettings}
                onPreview={onPreview}
                onExport={onExport}
                onRefresh={refresh}
                onPrint={print}
                canPrint={canPrint}
                viewportSize={viewportSize}
                onViewportChange={setViewportSize}
                customWidth={customWidth}
                customHeight={customHeight}
                onCustomWidthChange={setCustomWidth}
                onCustomHeightChange={setCustomHeight}
                leftWidth={leftWidth}
                onLayoutChange={setLeftWidth}
                isWebpage={isWebpage}
            />

            <div className={styles.body} ref={containerRef}>
                <div className={styles.left} style={{ width: `${leftWidth}%` }}>
                    <SectionPanel
                        sections={sections}
                        activeSection={activeSection}
                        onSectionChange={onSectionChange}
                        renderSection={renderSection}
                        getSectionIcon={getSectionIcon}
                        getRequired={getRequired}
                    />
                </div>

                <div className={`${styles.divider} ${isDragging ? styles.dividerActive : ''}`} onMouseDown={handleMouseDown}>
                    <div className={styles.dividerHandle} />
                </div>

                <div className={styles.right} style={{ width: `${100 - leftWidth}%` }}>
                    <PreviewPanel
                        paperStyle={getPaperStyle()}
                        zoom={zoom}
                        previewKey={previewKey}
                        iframeRef={iframeRef}
                        previewUrl={previewUrl}
                        canPreview={canPreview}
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                        onZoomReset={zoomReset}
                        onRefresh={refresh}
                        paperLabel={isWebpage ? getViewportLabel() : paper?.label}
                        zoomLabel={zoom}
                        isWebpage={isWebpage}
                    />
                </div>
            </div>
        </div>
    );
}