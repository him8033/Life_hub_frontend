'use client';

import { useEffect, useRef } from 'react';
import styles from '@/styles/application/PopupMenu.module.css';

const PopupMenu = ({ isOpen, onClose, children, position = 'right', offset = 10 }) => {
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const positionClass = styles[`popupMenu${position.charAt(0).toUpperCase() + position.slice(1)}`] || '';

    return (
        <div className={`${styles.popupMenu} ${positionClass}`} ref={popupRef}>
            {children}
        </div>
    );
};

export default PopupMenu;