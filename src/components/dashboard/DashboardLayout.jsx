'use client';

import Header from './Header';
import Sidebar from './Sidebar';
import styles from '@/styles/dashboard/DashboardLayout.module.css';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className={styles.dashboardLayout}>
            <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <div className={styles.mainContent}>
                <div 
                    className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.overlayActive : ''}`}
                    onClick={closeSidebar} 
                />
                <aside className={`${styles.sidebarContainer} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                    <Sidebar closeSidebar={closeSidebar} />
                </aside>
                <main className={styles.contentArea}>
                    <div className={styles.contentWrapper}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;