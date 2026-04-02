'use client';

import { FiChevronDown } from 'react-icons/fi';
import styles from '@/styles/common/SimpleSelect.module.css';

export default function SimpleSelect({
    value,
    onChange,
    options = [],
    placeholder = "Select an option",
    disabled = false,
    className = '',
    ...props
}) {
    return (
        <div className={`${styles.selectWrapper} ${className}`}>
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={styles.select}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <FiChevronDown className={styles.selectIcon} />
        </div>
    );
}