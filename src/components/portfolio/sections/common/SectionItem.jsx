// src/components/portfolio/sections/common/SectionItem.jsx

'use client';

import React from 'react';
import Button from '@/components/common/buttons/Button';
import { FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import styles from '@/styles/portfolio/sections/common/SectionItem.module.css';

export const SectionItem = ({
    item,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirst = false,
    isLast = false,
    isLoading = false,
    children,
    renderContent,
}) => {
    return (
        <div className={styles.item}>
            <div className={styles.itemContent}>
                {renderContent ? renderContent(item) : children}
            </div>
            <div className={styles.itemActions}>
                {onMoveUp && (
                    <button
                        className={styles.moveBtn}
                        onClick={() => onMoveUp(item)}
                        disabled={isFirst || isLoading}
                        title="Move up"
                    >
                        <FiChevronUp size={16} />
                    </button>
                )}
                {onMoveDown && (
                    <button
                        className={styles.moveBtn}
                        onClick={() => onMoveDown(item)}
                        disabled={isLast || isLoading}
                        title="Move down"
                    >
                        <FiChevronDown size={16} />
                    </button>
                )}
                {onEdit && (
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiEdit2 />}
                        onClick={() => onEdit(item)}
                        disabled={isLoading}
                        className={styles.actionBtn}
                        title="Edit"
                    />
                )}
                {onDelete && (
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiTrash2 />}
                        onClick={() => onDelete(item)}
                        disabled={isLoading}
                        className={styles.actionBtn}
                        title="Delete"
                    />
                )}
            </div>
        </div>
    );
};

export const SectionItemList = ({
    items = [],
    renderItem,
    emptyMessage = 'No items added yet',
}) => {
    if (items.length === 0) {
        return (
            <div className={styles.emptyList}>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {items.map((item, index) => (
                <React.Fragment key={item.id || index}>
                    {renderItem(item, index)}
                </React.Fragment>
            ))}
        </div>
    );
};