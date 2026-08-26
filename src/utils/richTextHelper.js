// src/utils/richTextHelper.js

/**
 * Check if HTML content has meaningful content
 * @param {string} html - HTML content to check
 * @returns {boolean} - true if content exists and is not just whitespace/empty tags
 */
export function hasContent(html) {
    if (!html || typeof html !== 'string') return false;
    
    // Remove HTML tags and check if there's any non-whitespace content
    const textContent = html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .trim();
    
    return textContent.length > 0;
}

/**
 * Strip HTML tags and return plain text
 * @param {string} html - HTML content
 * @returns {string} - Plain text content
 */
export function stripHtml(html) {
    if (!html || typeof html !== 'string') return '';
    
    return html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/&amp;/g, '&') // Replace &amp; with &
        .replace(/&lt;/g, '<') // Replace &lt; with <
        .replace(/&gt;/g, '>') // Replace &gt; with >
        .replace(/&quot;/g, '"') // Replace &quot; with "
        .trim();
}

/**
 * Get plain text excerpt from HTML content
 * @param {string} html - HTML content
 * @param {number} maxLength - Maximum length of excerpt
 * @returns {string} - Plain text excerpt
 */
export function getExcerpt(html, maxLength = 150) {
    const text = stripHtml(html);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}
