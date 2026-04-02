'use client';

import buttonStyles from '@/styles/common/buttons/Button.module.css';
import {
    FiPlus, FiX, FiSave, FiRefreshCw, FiTrash2,
    FiChevronLeft, FiChevronRight, FiEdit, FiEye,
    FiArrowRight, FiArrowLeft, FiCheck, FiXCircle
} from 'react-icons/fi';

const ICON_MAP = {
    create: FiPlus,
    add: FiPlus,
    cancel: FiX,
    close: FiX,
    save: FiSave,
    update: FiRefreshCw,
    edit: FiEdit,
    delete: FiTrash2,
    remove: FiTrash2,
    next: FiChevronRight,
    prev: FiChevronLeft,
    back: FiArrowLeft,
    submit: FiCheck,
    view: FiEye,
};

export default function Button({
    children,
    type = 'button',
    onClick,
    variant = 'primary', // primary, secondary, outline, danger, success
    size = 'md', // sm, md, lg
    isLoading = false,
    loadingText = 'Loading...',
    icon,
    iconPosition = 'left', // left, right
    fullWidth = false,
    disabled = false,
    className = '',
    ...props
}) {
    const sizeClass = buttonStyles[`btn${size.charAt(0).toUpperCase() + size.slice(1)}`];
    const variantClass = buttonStyles[`btn${variant.charAt(0).toUpperCase() + variant.slice(1)}`];

    // Auto-add icon based on text content if icon not provided
    const getAutoIcon = () => {
        if (icon) return icon;

        const text = typeof children === 'string' ? children.toLowerCase() : '';

        if (text.includes('create') || text.includes('add')) return <FiPlus />;
        if (text.includes('save')) return <FiSave />;
        if (text.includes('update')) return <FiRefreshCw />;
        if (text.includes('delete') || text.includes('remove')) return <FiTrash2 />;
        if (text.includes('cancel') || text.includes('close')) return <FiX />;
        if (text.includes('next')) return <FiChevronRight />;
        if (text.includes('prev') || text.includes('previous')) return <FiChevronLeft />;
        if (text.includes('back')) return <FiArrowLeft />;
        if (text.includes('submit')) return <FiCheck />;
        if (text.includes('edit')) return <FiEdit />;
        if (text.includes('view')) return <FiEye />;

        return null;
    };

    const autoIcon = getAutoIcon();
    const finalIcon = icon || autoIcon;

    // Get icon size based on button size
    const getIconSize = () => {
        switch (size) {
            case 'sm': return 14;
            case 'lg': return 20;
            default: return 16;
        }
    };

    const renderIcon = () => {
        if (!finalIcon) return null;

        const iconElement = finalIcon.type ?
            finalIcon :
            React.cloneElement(finalIcon, { size: getIconSize() });

        return iconElement;
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`${buttonStyles.btn} ${variantClass} ${sizeClass} ${fullWidth ? buttonStyles.fullWidth : ''} ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className={`${buttonStyles.spinner} ${buttonStyles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}></span>
                    {loadingText}
                </>
            ) : (
                <>
                    {finalIcon && iconPosition === 'left' && (
                        <span className={`${buttonStyles.btnIcon} ${buttonStyles[`btnIcon${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                            {renderIcon()}
                        </span>
                    )}
                    {children}
                    {finalIcon && iconPosition === 'right' && (
                        <span className={`${buttonStyles.btnIcon} ${buttonStyles[`btnIcon${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                            {renderIcon()}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}