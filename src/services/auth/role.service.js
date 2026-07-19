// src/services/auth/role.service.js

import { tokenService } from './token.service';
import { useEffect, useState } from 'react';

// Simple role check functions
export const getUserRole = () => {
    if (typeof window === 'undefined') return 'user'; // Server-side
    const { user } = tokenService.get();
    return user?.role || 'user';
};

export const isAdmin = () => {
    return getUserRole() === 'admin';
};

export const isUser = () => {
    return getUserRole() === 'user';
};

// Simple hook for components with hydration safety
export const useUserRole = () => {
    const [role, setRole] = useState('user');
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const { user: userData } = tokenService.get();
        setUser(userData || null);
        setRole(userData?.role || 'user');
    }, []);

    return {
        user,
        role,
        isAdmin: role === 'admin',
        isUser: role === 'user',
        mounted,
    };
};