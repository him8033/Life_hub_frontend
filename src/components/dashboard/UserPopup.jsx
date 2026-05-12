'use client';

import { useEffect, useRef } from 'react';
import { FiUser, FiLogOut, FiSettings, FiEye } from 'react-icons/fi';
import styles from '@/styles/dashboard/UserPopup.module.css';
import { useRouter } from "next/navigation";
import { ROUTES } from '@/routes/routes.constants';
import { tokenService } from '@/services/auth/token.service';

const UserPopup = ({ isOpen, onClose, userData, anchorEl }) => {
    const router = useRouter();
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                anchorEl &&
                !anchorEl.contains(event.target)
            ) {
                onClose();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose, anchorEl]);

    const handleLogout = () => {
        tokenService.remove();
        router.push(ROUTES.AUTH.LOGIN);
        onClose();
    };

    const handleProfileView = () => {
        router.push(ROUTES.DASHBOARD.PROFILE);
        onClose();
    };

    const handleChangePassword = () => {
        router.push(ROUTES.AUTH.CHANGE_PASSWORD);
        onClose();
    };

    if (!isOpen) return null;

    const getPopupPosition = () => {
        if (!anchorEl) return { top: 60, right: 20 };
        const rect = anchorEl.getBoundingClientRect();
        return {
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right
        };
    };

    const position = getPopupPosition();
    const getInitials = () => {
        if (!userData.name) return '?';
        return userData.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            ref={popupRef}
            className={styles.userPopup}
            style={{
                position: 'fixed',
                top: `${position.top}px`,
                right: `${position.right}px`,
                zIndex: 1000
            }}
        >
            <div className={styles.userPopupContent}>
                {/* Header with centered avatar and details */}
                <div className={styles.userHeader}>
                    <div className={styles.userAvatar}>
                        {userData.avatar ? (
                            <img
                                src={userData.avatar}
                                alt={userData.name}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <div className={styles.avatarInitials}>
                                {getInitials()}
                            </div>
                        )}
                    </div>
                    <div className={styles.userDetails}>
                        <h4 className={styles.userName}>{userData.name}</h4>
                        <p className={styles.userEmail}>{userData.email}</p>
                        <span className={styles.userRole}>{userData.role}</span>
                    </div>
                </div>

                {/* Simple Menu Items */}
                <div className={styles.menuList}>
                    <button onClick={handleProfileView} className={styles.menuButton}>
                        <FiEye size={18} />
                        <span>View Profile</span>
                    </button>
                    <button onClick={handleChangePassword} className={styles.menuButton}>
                        <FiSettings size={18} />
                        <span>Change Password</span>
                    </button>
                    <div className={styles.divider} />
                    <button onClick={handleLogout} className={styles.menuButton}>
                        <FiLogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPopup;