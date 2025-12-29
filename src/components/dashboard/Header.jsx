'use client';

import { useEffect, useState } from 'react';
import { FiUser, FiLogOut, FiSettings, FiEye } from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';
import PopupMenu from '@/components/Application/PopupMenu';
import styles from '@/styles/dashboard.module.css';
import { useRouter } from "next/navigation";
import { ROUTES } from '@/routes/routes.constants';
import { tokenService } from '@/services/auth/token.service';

const Header = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const router = useRouter();
    const [userData, setUserData] = useState(null);

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

    const handleLogout = () => {
        tokenService.remove();
        router.push(ROUTES.AUTH.LOGIN);
        setIsPopupOpen(false);
    };

    const handleProfileView = () => {
        // Navigate to profile page
        router.push(ROUTES.DASHBOARD.PROFILE);
        setIsPopupOpen(false);
    };

    const handleResetPassword = () => {
        // Navigate to reset password page
        router.push(ROUTES.AUTH.CHANGE_PASSWORD);
        setIsPopupOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerCenter}>
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
                    {/* You can replace this with an actual image */}
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

                <PopupMenu
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                >
                    {/* User Info Section */}
                    <div className={styles.userInfoSection}>
                        <div className={styles.userAvatar}>
                            {userData.avatar ? (
                                <img
                                    src={userData.avatar}
                                    alt={userData.name}
                                    className={styles.userAvatarImage}
                                />
                            ) : (
                                <div className={styles.userAvatarPlaceholder}>
                                    <FiUser size={32} />
                                </div>
                            )}
                        </div>

                        <div className={styles.userDetails}>
                            <h4 className={styles.userName}>{userData.name}</h4>
                            <p className={styles.userEmail}>{userData.email}</p>
                            <span className={styles.userRole}>{userData.role}</span>
                        </div>
                    </div>

                    <div className={styles.popupDivider} />

                    {/* Menu Items */}
                    <ul className={styles.popupList}>
                        <li className={styles.popupItem}>
                            <button
                                onClick={handleProfileView}
                                className={styles.popupLink}
                                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                            >
                                <FiEye className={styles.popupIcon} />
                                View Profile
                            </button>
                        </li>
                        <li className={styles.popupItem}>
                            <button
                                onClick={handleResetPassword}
                                className={styles.popupLink}
                                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                            >
                                <FiSettings className={styles.popupIcon} />
                                Reset Password
                            </button>
                        </li>
                        <div className={styles.popupDivider} />
                        <li className={styles.popupItem}>
                            <button
                                onClick={handleLogout}
                                className={styles.popupLink}
                                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                            >
                                <FiLogOut className={styles.popupIcon} />
                                Logout
                            </button>
                        </li>
                    </ul>
                </PopupMenu>
            </div>
        </header>
    );
};

export default Header;