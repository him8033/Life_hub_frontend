// src/components/common/preview/SectionPanel.jsx
'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from '@/styles/common/preview/SectionPanel.module.css';

export default function SectionPanel({
    sections = [],
    activeSection,
    onSectionChange,
    renderSection,
    getSectionIcon,
    getRequired,
}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const current = sections.find(s => s.id === activeSection);

    return (
        <div className={styles.sectionPanel}>
            {/* Mobile */}
            <div className={styles.mobileNav}>
                <button className={styles.mobileBtn} onClick={() => setMobileOpen(!mobileOpen)}>
                    {current?.title || 'Select'} <FiChevronDown size={14} />
                </button>
                {mobileOpen && (
                    <div className={styles.mobileDropdown}>
                        {sections.map(s => (
                            <button
                                key={s.id}
                                className={`${styles.mobileItem} ${activeSection === s.id ? styles.active : ''}`}
                                onClick={() => { onSectionChange(s.id); setMobileOpen(false); }}
                            >
                                {getSectionIcon?.(s.icon)} {s.title}
                                {getRequired?.(s.id) && <span className={styles.required}>*</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Tabs */}
            <div className={styles.desktopNav}>
                {sections.map(s => (
                    <button
                        key={s.id}
                        className={`${styles.tab} ${activeSection === s.id ? styles.active : ''}`}
                        onClick={() => onSectionChange(s.id)}
                    >
                        {getSectionIcon?.(s.icon)}
                        <span>{s.title}</span>
                        {getRequired?.(s.id) && <span className={styles.required}>*</span>}
                    </button>
                ))}
                {sections.length === 0 && <span className={styles.empty}>No sections</span>}
            </div>

            {/* Content */}
            <div className={styles.sectionContent}>
                {renderSection ? renderSection(activeSection) : <p>Select a section</p>}
            </div>
        </div>
    );
}