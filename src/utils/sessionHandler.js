/**
 * Session Handler Utility
 * Manages session storage and auto-logout functionality
 * Uses Cookies for storage to match tokenService
 */
import Cookies from "js-cookie";

/**
 * Save session ID to Cookies
 * @param {string} sessionId - The session ID to store
 */
export const saveSessionId = (sessionId) => {
    if (typeof window !== 'undefined' && sessionId) {
        Cookies.set("session_id", sessionId, {
            expires: 7,
            sameSite: "Strict",
            path: "/",
        });
    }
};

/**
 * Get session ID from Cookies
 * @returns {string|null} The session ID or null if not found
 */
export const getSessionId = () => {
    if (typeof window !== 'undefined') {
        return Cookies.get("session_id") || null;
    }
    return null;
};

/**
 * Clear all session data from Cookies
 * Clears session_id, access_token, and refresh_token
 */
export const clearSession = () => {
    if (typeof window !== 'undefined') {
        Cookies.remove("session_id", { path: "/" });
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
    }
};

/**
 * Check if a session is currently active
 * @returns {boolean} True if session_id exists in localStorage
 */
export const isSessionActive = () => {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('session_id');
    }
    return false;
};

/**
 * Handle auto-logout when session is invalid
 * Clears session data, shows notification, and redirects to login
 * @param {string} reason - The reason for logout (e.g., 'Session has been revoked')
 */
export const handleAutoLogout = (reason = 'Session expired') => {
    // Clear session data
    clearSession();

    // Show notification using snackbar (if available)
    if (typeof window !== 'undefined' && window.showSnackbar) {
        window.showSnackbar(reason, 'warning', 5000);
    }

    // Redirect to login page with reason
    if (typeof window !== 'undefined') {
        const loginUrl = `/auth/login?reason=${encodeURIComponent(reason)}`;
        window.location.href = loginUrl;
    }
};

/**
 * Save access token to localStorage
 * @param {string} token - The access token to store
 */
export const saveAccessToken = (token) => {
    if (typeof window !== 'undefined' && token) {
        localStorage.setItem('access_token', token);
    }
};

/**
 * Get access token from localStorage
 * @returns {string|null} The access token or null if not found
 */
export const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

/**
 * Save refresh token to localStorage
 * @param {string} token - The refresh token to store
 */
export const saveRefreshToken = (token) => {
    if (typeof window !== 'undefined' && token) {
        localStorage.setItem('refresh_token', token);
    }
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refresh_token');
    }
    return null;
};
