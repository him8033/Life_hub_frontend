'use client';

import { useEffect, useState } from 'react';
import { FiUser, FiMenu, FiX } from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';
import UserPopup from '@/components/dashboard/UserPopup';
import styles from '@/styles/dashboard/Header.module.css';
import { tokenService } from '@/services/auth/token.service';

const Header = ({ toggleSidebar, sidebarOpen }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const { user } = tokenService.get();

        setUserData({
            name: user?.name || "Guest User",
            email: user?.email || "guest@example.com",
            avatar: "",
            role: user?.role || "Guest",
        });
    }, []);

    if (!userData) return null;

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                {isMobile && (
                    <button
                        className={styles.mobileMenuButton}
                        onClick={toggleSidebar}
                        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                    >
                        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                )}
                <div className={styles.logo}>
                    <AiOutlineDashboard className={styles.logoIcon} />
                    <span>LifeHub</span>
                </div>
            </div>

            <div className={styles.headerRight}>
                <div
                    className={styles.userIcon}
                    onClick={() => setIsPopupOpen(!isPopupOpen)}
                    title={`${userData.name} (${userData.role})`}
                >
                    <div className={styles.avatarPreview}>
                        {userData.avatar ? (
                            <img
                                src={userData.avatar}
                                alt={userData.name}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <FiUser size={20} />
                        )}
                    </div>
                </div>

                <UserPopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    userData={userData}
                />
            </div>
        </header>
    );
};

export default Header;