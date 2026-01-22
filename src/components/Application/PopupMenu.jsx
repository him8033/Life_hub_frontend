'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/application/PopupMenu.module.css';

const PopupMenu = ({ isOpen, onClose, children }) => {
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.popupMenu} ref={popupRef}>
            {children}
        </div>
    );
};

export default PopupMenu;