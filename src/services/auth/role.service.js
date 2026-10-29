// src/services/auth/role.service.js

import { useSyncExternalStore } from 'react';
import { tokenService } from './token.service';

const emptySubscribe = () => () => {};

const extractRole = (userData) => {
    if (!userData) return 'user';
    if (userData.is_superuser === true) return 'admin';
    if (userData.role) return userData.role;
    if (Array.isArray(userData.roles) && userData.roles.length > 0) {
        if (userData.roles.includes('admin')) return 'admin';
        return userData.roles[0];
    }
    return 'user';
};

// Simple role check functions
export const getUserRole = () => {
    if (typeof window === 'undefined') return 'user'; // Server-side
    const { user } = tokenService.get();
    return extractRole(user);
};

export const isAdmin = () => {
    return getUserRole() === 'admin';
};

export const isUser = () => {
    return getUserRole() === 'user';
};

// Simple hook for components with hydration safety
export const useUserRole = () => {
    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const userData = mounted ? tokenService.get().user : null;
    const role = extractRole(userData);
    const user = userData || null;

    return {
        user,
        role,
        isAdmin: role === 'admin',
        isUser: role === 'user',
        mounted,
    };
};