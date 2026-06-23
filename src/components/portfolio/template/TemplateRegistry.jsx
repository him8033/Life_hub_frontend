import ModernATS from './ModernATS';
import Minimal from './Minimal';
import Creative from './Creative';
import Corporate from './Corporate';

// Map template_key to component
const TEMPLATE_MAP = {
    'modern_ats': ModernATS,
    'minimal': Minimal,
    'creative': Creative,
    'corporate': Corporate,
};

// Default fallback template
const DEFAULT_TEMPLATE = ModernATS;

export const getTemplate = (templateKey) => {
    return TEMPLATE_MAP[templateKey] || DEFAULT_TEMPLATE;
};

export const getTemplateList = () => {
    return Object.keys(TEMPLATE_MAP);
};

export const getTemplateName = (templateKey) => {
    const names = {
        'modern_ats': 'Modern ATS',
        'minimal': 'Minimal',
        'creative': 'Creative',
        'corporate': 'Corporate',
    };
    return names[templateKey] || 'Modern ATS';
};