'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserRole } from '@/services/auth/role.service';
import { ROUTES, canAccessRoute } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';

export default function AccountManagementLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { role, mounted } = useUserRole();

    const isAllowed = canAccessRoute(pathname, role);

    useEffect(() => {
        if (mounted && !isAllowed) {
            router.replace(ROUTES.DASHBOARD.HOME);
        }
    }, [mounted, isAllowed, router]);

    if (!mounted) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <Loader />
            </div>
        );
    }

    if (!isAllowed) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
                    You do not have administrative privileges to access this page. Redirecting...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
