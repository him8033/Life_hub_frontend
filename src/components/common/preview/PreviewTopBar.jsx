// src/components/common/preview/PreviewTopBar.jsx

'use client';

import { useState } from 'react';
import { FiArrowLeft, FiSettings, FiEye, FiDownload, FiRefreshCw, FiPrinter, FiMaximize } from 'react-icons/fi';
import Button from '@/components/common/buttons/Button';
import SimpleSelect from '@/components/common/forms/SimpleSelect';
import { PAPER_SIZES, VIEWPORT_SIZES, LAYOUTS } from '@/hooks/usePreviewSettings';
import styles from '@/styles/common/preview/PreviewTopBar.module.css';

export default function PreviewTopBar({
    title,
    onBack,
    onSettings,
    onPreview,
    onExport,
    onRefresh,
    onPrint,
    canPrint,
    viewportSize,
    onViewportChange,
    customWidth,
    customHeight,
    onCustomWidthChange,
    onCustomHeightChange,
    leftWidth,
    onLayoutChange,
    isWebpage = false,
}) {
    const [showCustomInputs, setShowCustomInputs] = useState(false);

    const layoutOptions = LAYOUTS.map(l => ({ value: String(l.value), label: l.label }));

    // Choose the right options based on view mode
    const sizeOptions = isWebpage
        ? VIEWPORT_SIZES.map(s => ({
            value: s.value,
            label: s.w ? `${s.label} (${s.w}×${s.h})` : s.label,
        }))
        : PAPER_SIZES.map(s => ({
            value: s.value,
            label: s.w > 0 ? `${s.label} (${s.w}×${s.h}mm)` : s.label,
        }));

    const handleSizeChange = (value) => {
        onViewportChange(value);
        if (value === 'custom') {
            setShowCustomInputs(true);
        } else {
            setShowCustomInputs(false);
        }
    };

    return (
        <div className={styles.topBar}>
            {/* Back Button */}
            <Button
                className={`${styles.toolbarButton} ${styles.iconOnly}`}
                variant="outline"
                size="sm"
                icon={<FiArrowLeft />}
                onClick={onBack}
                title="Back"
            />

            <span className={styles.title}>{title || 'Preview'}</span>

            <div className={styles.actions}>
                {/* Layout Select */}
                <SimpleSelect
                    name="layout"
                    value={String(leftWidth)}
                    onChange={(e) => onLayoutChange(Number(e.target.value))}
                    options={layoutOptions}
                    size="sm"
                    emptyOption={false}
                    placeholder="Layout"
                    className={`${styles.actionSelect} ${styles.toolbarItem}`}
                />

                {/* Size Select (Paper or Viewport) */}
                <div className={styles.sizeControl}>
                    <SimpleSelect
                        name="viewportSize"
                        value={viewportSize}
                        onChange={(e) => handleSizeChange(e.target.value)}
                        options={sizeOptions}
                        size="sm"
                        emptyOption={false}
                        placeholder={isWebpage ? 'Viewport' : 'Paper'}
                        className={`${styles.actionSelect} ${styles.toolbarItem}`}
                    />

                    {/* Custom Size Inputs */}
                    {showCustomInputs && isWebpage && (
                        <div className={styles.customSizeInputs}>
                            <input
                                type="number"
                                placeholder="Width"
                                value={customWidth}
                                onChange={(e) => onCustomWidthChange(e.target.value)}
                                className={styles.customInput}
                                min="200"
                                max="3840"
                            />
                            <span className={styles.customSeparator}>×</span>
                            <input
                                type="number"
                                placeholder="Height"
                                value={customHeight}
                                onChange={(e) => onCustomHeightChange(e.target.value)}
                                className={styles.customInput}
                                min="200"
                                max="2160"
                            />
                        </div>
                    )}
                </div>

                {/* Refresh Button */}
                <Button
                    className={`${styles.toolbarButton} ${styles.iconOnly}`}
                    variant="outline"
                    size="sm"
                    icon={<FiRefreshCw />}
                    onClick={onRefresh}
                    title="Refresh"
                />

                {/* Print Button */}
                {canPrint && (
                    <Button
                        className={`${styles.toolbarButton} ${styles.iconOnly}`}
                        variant="outline"
                        size="sm"
                        icon={<FiPrinter />}
                        onClick={onPrint}
                        title="Print (Ctrl+P)"
                    />
                )}

                {/* Settings Button */}
                {onSettings && (
                    <Button
                        className={`${styles.toolbarButton} ${styles.iconOnly}`}
                        variant="outline"
                        size="sm"
                        icon={<FiSettings />}
                        onClick={onSettings}
                        title="Settings"
                    />
                )}

                {/* Preview Button */}
                {onPreview && (
                    <Button
                        className={`${styles.toolbarButton} ${styles.iconOnly}`}
                        variant="outline"
                        size="sm"
                        icon={<FiEye />}
                        onClick={onPreview}
                        title="Open Preview"
                    />
                )}

                {/* Export Button */}
                {onExport && (
                    <Button
                        className={`${styles.toolbarButton} ${styles.iconOnly}`}
                        variant="outline"
                        size="sm"
                        icon={<FiDownload />}
                        onClick={onExport}
                        title="Export PDF"
                    />
                )}
            </div>
        </div>
    );
}