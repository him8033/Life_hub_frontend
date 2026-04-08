'use client';

import { FiUser, FiLogOut, FiSettings, FiEye } from 'react-icons/fi';
import PopupMenu from '@/components/Application/PopupMenu';
import styles from '@/styles/dashboard/UserPopup.module.css';
import { useRouter } from "next/navigation";
import { ROUTES } from '@/routes/routes.constants';
import { tokenService } from '@/services/auth/token.service';

const UserPopup = ({ isOpen, onClose, userData }) => {
    const router = useRouter();

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

    return (
        <PopupMenu
            isOpen={isOpen}
            onClose={onClose}
            position="right"
            offset={10}
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

                <div className={styles.popupDivider} />

                {/* Menu Items */}
                <ul className={styles.popupList}>
                    <li className={styles.popupItem}>
                        <button
                            onClick={handleProfileView}
                            className={styles.popupLink}
                        >
                            <FiEye className={styles.popupIcon} />
                            View Profile
                        </button>
                    </li>
                    <li className={styles.popupItem}>
                        <button
                            onClick={handleChangePassword}
                            className={styles.popupLink}
                        >
                            <FiSettings className={styles.popupIcon} />
                            Change Password
                        </button>
                    </li>
                    <div className={styles.popupDivider} />
                    <li className={styles.popupItem}>
                        <button
                            onClick={handleLogout}
                            className={styles.popupLink}
                        >
                            <FiLogOut className={styles.popupIcon} />
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </PopupMenu>
    );
};

export default UserPopup;