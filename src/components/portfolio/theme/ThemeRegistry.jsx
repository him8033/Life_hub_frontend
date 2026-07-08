// src/components/portfolio/theme/ThemeRegistry.js

/**
 * PORTFOLIO THEME REGISTRY
 * 
 * HOW TO ADD A NEW THEME:
 * 
 * 1. Create your theme component file in this directory (e.g., MyNewTheme.jsx)
 * 2. Import it below
 * 3. Add it to THEME_MAP with a unique key
 * 4. Add its display name to THEME_NAMES
 * 
 * Example:
 *   import MyNewTheme from './MyNewTheme';
 *   
 *   const THEME_MAP = {
 *     'my_new_theme': MyNewTheme,  // ← Add here
 *   };
 *   
 *   const THEME_NAMES = {
 *     'my_new_theme': 'My New Theme',  // ← Add here
 *   };
 */

import PortfolioTheme from './PortfolioTheme';
import TestTheme from './TestTheme';
import DefaultTheme from './DefaultTheme';

// ============================================
// 1. REGISTER YOUR THEME HERE
// ============================================
// Map theme_key (from API) → React Component
// ============================================

const THEME_MAP = {
    'portfolio_theme': PortfolioTheme,   // Main portfolio theme
    'test_theme': TestTheme,             // Test theme
    'default': DefaultTheme,             // Fallback theme
    // 👇 Add your new theme here
    // 'your_theme_key': YourThemeComponent,
};

// ============================================
// 2. ADD YOUR THEME NAME HERE
// ============================================
// Map theme_key → Display Name (shown in UI)
// ============================================

const THEME_NAMES = {
    'portfolio_theme': 'Portfolio Theme',
    'test_theme': 'Test Theme',
    'default': 'Default Theme',
    // 👇 Add your theme name here
    // 'your_theme_key': 'Your Theme Display Name',
};

// ============================================
// 3. SET DEFAULT THEME
// ============================================
// Fallback theme when key is not found
// ============================================

const DEFAULT_THEME = PortfolioTheme;

// ============================================
// EXPORTED FUNCTIONS (Don't change these)
// ============================================

export const getPortfolioTheme = (themeKey) => {
    return THEME_MAP[themeKey] || DEFAULT_THEME;
};

export const getThemeList = () => {
    return Object.keys(THEME_MAP);
};

export const getThemeName = (themeKey) => {
    return THEME_NAMES[themeKey] || themeKey || 'Unknown Theme';
};

export const getDefaultTheme = () => {
    return DEFAULT_THEME;
};

export const isThemeRegistered = (themeKey) => {
    return themeKey in THEME_MAP;
};

export const getThemesMetadata = () => {
    return Object.keys(THEME_MAP).map(key => ({
        key: key,
        component: THEME_MAP[key],
        name: THEME_NAMES[key] || key,
    }));
};