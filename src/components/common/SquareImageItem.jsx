// components/common/SquareImageItem.jsx
'use client';

import { useState } from 'react';
import {
    FiEdit,
    FiTrash2,
    FiStar,
    FiArrowUp,
    FiArrowDown,
    FiMoreVertical,
    FiCheck
} from 'react-icons/fi';

// Shadcn Components
import { Button } from '@/components/ui/button';

// Styles
import styles from '@/styles/common/SquareImageItem.module.css';

const SquareImageItem = ({
    image,
    index,
    totalItems,
    isPrimary = false,
    isMenuOpen = false,
    onMenuToggle,
    onSetPrimary,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    className = ''
}) => {
    const handleAction = (action) => {
        action();
    };

    return (
        <div className={`${styles.imageItem} ${className}`}>
            {/* Position Badge */}
            <div className={styles.positionBadge}>
                #{index + 1}
            </div>

            {/* Primary Badge */}
            {isPrimary && (
                <div className={styles.primaryBadge} title="Primary Image">
                    <FiCheck className={styles.primaryIcon} />
                    <span>Primary</span>
                </div>
            )}

            {/* Image Container */}
            <div className={styles.imageContainer}>
                <img
                    src={image.image_url}
                    alt={image.caption || `Image ${index + 1}`}
                    className={styles.image}
                />

                {/* Overlay for better text visibility */}
                <div className={styles.imageOverlay}></div>

                {/* Primary Icon on Image */}
                {isPrimary && (
                    <div className={styles.primaryImageBadge}>
                        <FiStar className={styles.primaryImageIcon} />
                    </div>
                )}
            </div>

            {/* Caption */}
            <div className={styles.captionContainer}>
                <p className={styles.caption} title={image.caption}>
                    {image.caption || 'No caption'}
                </p>
            </div>

            {/* Action Menu */}
            <div className={styles.actionMenu}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMenuToggle}
                    className={`${styles.menuButton} menu-button-selector`}
                    aria-expanded={isMenuOpen}
                >
                    <FiMoreVertical className={styles.menuIcon} />
                </Button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <>
                        <div
                            className={styles.menuOverlay}
                            onClick={() => onMenuToggle()}
                        />
                        <div className={`${styles.dropdownMenu} dropdown-menu-selector`}>
                            <div className={styles.menuHeader}>
                                <span className={styles.menuTitle}>Image Actions</span>
                                <button
                                    onClick={() => onMenuToggle()}
                                    className={styles.menuClose}
                                >
                                    ×
                                </button>
                            </div>

                            <div className={styles.menuItems}>
                                {/* Set Primary */}
                                {!isPrimary && (
                                    <button
                                        onClick={() => handleAction(onSetPrimary)}
                                        className={styles.menuItem}
                                    >
                                        <FiStar className={styles.menuIcon} />
                                        <span className={styles.menuText}>Set as Primary</span>
                                    </button>
                                )}

                                {/* Edit Caption */}
                                <button
                                    onClick={() => handleAction(onEdit)}
                                    className={styles.menuItem}
                                >
                                    <FiEdit className={styles.menuIcon} />
                                    <span className={styles.menuText}>Edit Image</span>
                                </button>

                                {/* Move Actions */}
                                {index > 0 && (
                                    <button
                                        onClick={() => handleAction(onMoveUp)}
                                        className={styles.menuItem}
                                        title="Move Up"
                                    >
                                        <FiArrowUp className={styles.moveIcon} />
                                        <span>Move Up</span>
                                    </button>
                                )}
                                {index < totalItems - 1 && (
                                    <button
                                        onClick={() => handleAction(onMoveDown)}
                                        className={styles.menuItem}
                                        title="Move Down"
                                    >
                                        <FiArrowDown className={styles.moveIcon} />
                                        <span>Move Down</span>
                                    </button>
                                )}

                                {/* Divider */}
                                <div className={styles.menuDivider} />

                                {/* Delete */}
                                <button
                                    onClick={() => handleAction(onDelete)}
                                    className={`${styles.menuItem} ${styles.deleteItem}`}
                                >
                                    <FiTrash2 className={styles.deleteIcon} />
                                    <span className={styles.menuText}>Delete Image</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SquareImageItem;