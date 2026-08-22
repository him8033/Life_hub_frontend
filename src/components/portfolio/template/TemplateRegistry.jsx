import ModernATS from './ModernATS';
import Minimal from './Minimal';
import Creative from './Creative';
import Corporate from './Corporate';

/**
 * Resume Template Registry
 *
 * Key Rules:
 * - The object key is the unique template_key.
 * - This key MUST exactly match the template_key stored in the Resume Template key in database/API.
 * - If the key contains a hyphen (-), it must be wrapped in quotes.
 *
 * Example:
 *   ✅ 'modern-minimalist'
 *   ❌ modern-minimalist
 */
const TEMPLATES = {
    'modern-minimalist': {
        name: 'Modern ATS',
        component: ModernATS,
    },

    'executive-suite': {
        name: 'Minimal',
        component: Minimal,
    },

    'academic-scholar': {
        name: 'Creative',
        component: Creative,
    },

    'clean-canvas': {
        name: 'Corporate',
        component: Corporate,
    },
};

/**
 * Default template shown when:
 * - templateKey is null/undefined
 * - templateKey doesn't exist in TEMPLATES
 *
 * IMPORTANT:
 * This value MUST be one of the keys defined above.
 */
const DEFAULT_TEMPLATE_KEY = 'modern-minimalist';

/**
 * Returns the React component for a template.
 */
export const getTemplate = (templateKey) => {
    return (
        TEMPLATES[templateKey]?.component ??
        TEMPLATES[DEFAULT_TEMPLATE_KEY].component
    );
};

/**
 * Returns all available template keys.
 *
 * Example:
 * [
 *   'modern-minimalist',
 *   'minimal',
 *   'creative',
 *   'corporate'
 * ]
 */
export const getTemplateList = () => {
    return Object.keys(TEMPLATES);
};

/**
 * Returns the display name of a template.
 * Falls back to the default template name if the key is invalid.
 */
export const getTemplateName = (templateKey) => {
    return (
        TEMPLATES[templateKey]?.name ??
        TEMPLATES[DEFAULT_TEMPLATE_KEY].name
    );
};

export default TEMPLATES;