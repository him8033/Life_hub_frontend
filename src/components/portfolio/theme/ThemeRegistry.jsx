// src/components/portfolio/theme/ThemeRegistry.js

/**
 * ============================================
 * PORTFOLIO THEME REGISTRY
 * ============================================
 *
 * HOW TO ADD A NEW THEME
 *
 * 1. Create your theme component
 *    Example:
 *      MyNewTheme.jsx
 *
 * 2. Import it below
 *
 * 3. Register it inside THEMES.
 *
 * IMPORTANT:
 * - The object key is the unique theme_key.
 * - The key MUST exactly match the theme_key stored in your database/API.
 * - If the key contains a hyphen (-), wrap it in quotes.
 *
 * Example:
 *
 * THEMES = {
 *   'my-new-theme': {
 *      name: 'My New Theme',
 *      component: MyNewTheme,
 *   }
 * }
 *
 * That's it.
 * No other place needs updating.
 * ============================================
 */

import PortfolioTheme from './PortfolioTheme';
import TestTheme from './TestTheme';
import DefaultTheme from './DefaultTheme';

/**
 * ============================================
 * REGISTER ALL THEMES HERE
 * ============================================
 */
const THEMES = {
    portfolio_theme: {
        name: 'Portfolio Theme',
        component: PortfolioTheme,
    },

    test_theme: {
        name: 'Test Theme',
        component: TestTheme,
    },

    default: {
        name: 'Default Theme',
        component: DefaultTheme,
    },

    // Example:
    // 'modern-minimalist': {
    //     name: 'Modern Minimalist',
    //     component: ModernMinimalist,
    // },
};

/**
 * ============================================
 * DEFAULT THEME
 * ============================================
 *
 * Used when:
 * - themeKey is null/undefined
 * - themeKey doesn't exist
 *
 * IMPORTANT:
 * This key MUST exist inside THEMES.
 * ============================================
 */
const DEFAULT_THEME_KEY = 'portfolio_theme';

/**
 * Returns the React component for a theme.
 */
export const getPortfolioTheme = (themeKey) => {
    return (
        THEMES[themeKey]?.component ??
        THEMES[DEFAULT_THEME_KEY].component
    );
};

/**
 * Returns all registered theme keys.
 */
export const getThemeList = () => {
    return Object.keys(THEMES);
};

/**
 * Returns the display name for a theme.
 */
export const getThemeName = (themeKey) => {
    return (
        THEMES[themeKey]?.name ??
        THEMES[DEFAULT_THEME_KEY].name
    );
};

/**
 * Returns the default theme component.
 */
export const getDefaultTheme = () => {
    return THEMES[DEFAULT_THEME_KEY].component;
};

/**
 * Checks whether a theme is registered.
 */
export const isThemeRegistered = (themeKey) => {
    return themeKey in THEMES;
};

/**
 * Returns metadata for all registered themes.
 */
export const getThemesMetadata = () => {
    return Object.entries(THEMES).map(([key, value]) => ({
        key,
        name: value.name,
        component: value.component,
    }));
};

export default THEMES;