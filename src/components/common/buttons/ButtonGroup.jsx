'use client';

import buttonStyles from '@/styles/common/buttons/Button.module.css';

export default function ButtonGroup({
    children,
    orientation = 'horizontal',
    align = 'start',
    className = '',
    ...props
}) {
    return (
        <div
            className={`${buttonStyles.buttonGroup} ${buttonStyles[orientation]} ${buttonStyles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}