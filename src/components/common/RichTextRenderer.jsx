// src/components/common/RichTextRenderer.jsx
'use client';

import React from 'react';
import '@/styles/rich-text.css';

/**
 * RichTextRenderer - Universal component for rendering editor content
 * 
 * @param {string} html - HTML content from TipTap editor
 * @param {string} className - Additional CSS classes
 * @param {string} mode - 'light' | 'dark' | 'auto' (default: 'auto')
 * @param {string} as - HTML element to render as (default: 'div')
 * @param {boolean} cleanEmpty - Remove empty paragraphs (default: true)
 * @param {Object} style - Inline styles
 * @param {Object} props - Additional props
 */
export default function RichTextRenderer({
    html,
    className = '',
    mode = 'auto',
    as: Component = 'div',
    cleanEmpty = true,
    style,
    ...props
}) {
    if (!html) return null;

    // Clean empty paragraphs
    let content = html;
    if (cleanEmpty) {
        content = html.replace(/<p>\s*<\/p>/g, '').trim();
    }

    if (!content) return null;

    // Determine mode class
    const modeClass = mode === 'light' ? 'rich-text-light' :
        mode === 'dark' ? 'rich-text-dark' :
            ''; // 'auto' uses system preference

    return (
        <Component
            className={`rich-text-content ${modeClass} ${className}`}
            style={style}
            dangerouslySetInnerHTML={{ __html: content }}
            {...props}
        />
    );
}

// Specialized wrappers for different use cases
export const LightRichText = (props) => (
    <RichTextRenderer {...props} mode="light" />
);

export const DarkRichText = (props) => (
    <RichTextRenderer {...props} mode="dark" />
);

export const AutoRichText = (props) => (
    <RichTextRenderer {...props} mode="auto" />
);