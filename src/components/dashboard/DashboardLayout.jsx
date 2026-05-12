'use client';

import Header from './Header';
import Sidebar from './Sidebar';
import styles from '@/styles/dashboard/DashboardLayout.module.css';
import { useState, useEffect, useCallback } from 'react';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const checkScreenSize = useCallback(() => {
        const isMobileView = window.innerWidth < 1024;
        setIsMobile(isMobileView);
        
        if (isMobileView) {
            setSidebarOpen(false);
        } else {
            setSidebarOpen(true);
        }
    }, []);

    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [checkScreenSize]);

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const closeSidebar = useCallback(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    return (
        <div className={styles.dashboardLayout}>
            <Header 
                toggleSidebar={toggleSidebar} 
                sidebarOpen={sidebarOpen} 
                isMobile={isMobile}
            />
            <div className={styles.mainContent}>
                {/* Overlay for mobile - positioned below header */}
                {isMobile && sidebarOpen && (
                    <div 
                        className={styles.sidebarOverlay}
                        onClick={closeSidebar}
                    />
                )}
                
                {/* Sidebar - positioned below header on mobile */}
                <div className={`${styles.sidebarContainer} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                    <Sidebar closeSidebar={closeSidebar} isOpen={sidebarOpen} />
                </div>
                
                <main className={`${styles.contentArea} ${!sidebarOpen && !isMobile ? styles.contentExpanded : ''}`}>
                    <div className={styles.contentWrapper}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;