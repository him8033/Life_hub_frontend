'use client';

import Header from './Header';
import Sidebar from './Sidebar';
import styles from '@/styles/dashboard.module.css';

const DashboardLayout = ({ children }) => {
    return (
        <div className={styles.dashboardLayout}>
            <Header />
            <div className={styles.mainContent}>
                <Sidebar />
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;