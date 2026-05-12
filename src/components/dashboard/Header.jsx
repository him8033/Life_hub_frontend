'use client';

import { useEffect, useState, useRef } from 'react';
import { FiUser } from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';
import UserPopup from '@/components/dashboard/UserPopup';
import styles from '@/styles/dashboard/Header.module.css';
import { tokenService } from '@/services/auth/token.service';

const Header = ({ toggleSidebar, sidebarOpen, isMobile }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const { user } = tokenService.get();
        setUserData({
            name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Guest User",
            email: user?.email || "guest@example.com",
            avatar: user?.profile_image || "",
            role: user?.role || "Guest",
        });
    }, []);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    if (!userData) return null;

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <button
                    className={styles.menuButton}
                    onClick={toggleSidebar}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
                <div className={styles.logo}>
                    <AiOutlineDashboard className={styles.logoIcon} />
                    <span>LifeHub</span>
                </div>
            </div>

            <div className={styles.headerRight}>
                <button
                    ref={buttonRef}
                    className={styles.userButton}
                    onClick={togglePopup}
                    aria-label="User menu"
                >
                    {userData.avatar ? (
                        <img src={userData.avatar} alt={userData.name} />
                    ) : (
                        <FiUser size={18} />
                    )}
                </button>

                <UserPopup
                    isOpen={isPopupOpen}
                    onClose={closePopup}
                    userData={userData}
                    anchorEl={buttonRef.current}
                />
            </div>
        </header>
    );
};

export default Header;