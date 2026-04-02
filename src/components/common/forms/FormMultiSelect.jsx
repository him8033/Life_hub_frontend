'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import styles from '@/styles/common/forms/FormSelect.module.css';
import { FiChevronDown, FiX } from 'react-icons/fi';

export default function FormMultiSelect({
    name,
    label,
    options = [],
    placeholder = "Select options",
    icon: Icon,
    required = false,
    disabled = false,
    description,
    size = 'md', // sm, md, lg
    className = '',
    selectClassName = '',
    labelClassName = '',
    loading = false,
    maxSelections,
    onChange,
    ...props
}) {
    const { control, formState: { errors }, setValue, watch } = useFormContext();
    const error = errors[name];
    const selectedValues = watch(name) || [];
    const [isOpen, setIsOpen] = useState(false);

    // Size classes
    const sizeClass = styles[`multiSelect${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const labelSizeClass = styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const tagSizeClass = styles[`tag${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const iconSizeClass = styles[`icon${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const dropdownSizeClass = styles[`dropdown${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const dropdownItemSizeClass = styles[`dropdownItem${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const checkboxSizeClass = styles[`checkbox${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const descriptionSizeClass = styles[`description${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const errorSizeClass = styles[`error${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const warningSizeClass = styles[`warning${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const wrapperSizeClass = styles[`wrapper${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';
    const placeholderSizeClass = styles[`placeholder${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    const handleSelect = (value) => {
        let newValues;
        if (selectedValues.includes(value)) {
            newValues = selectedValues.filter(v => v !== value);
        } else {
            if (maxSelections && selectedValues.length >= maxSelections) {
                return;
            }
            newValues = [...selectedValues, value];
        }
        setValue(name, newValues);
        if (onChange) onChange(newValues);
    };

    const handleRemove = (valueToRemove, e) => {
        e.stopPropagation();
        const newValues = selectedValues.filter(v => v !== valueToRemove);
        setValue(name, newValues);
        if (onChange) onChange(newValues);
    };

    const getSelectedLabels = () => {
        return selectedValues.map(val => {
            const option = options.find(opt => opt.value === val);
            return option?.label || val;
        });
    };

    // Get icon size based on component size
    const getIconSize = () => {
        switch (size) {
            case 'sm': return 12;
            case 'lg': return 16;
            default: return 14;
        }
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={`${styles.formItem} ${className}`}>
                    {/* Label */}
                    {label && (
                        <FormLabel className={`${styles.formLabel} ${labelSizeClass} ${labelClassName}`}>
                            {Icon && <span className={styles.labelIcon}>{Icon}</span>}
                            {label}
                            {required && <span className={styles.required}>*</span>}
                        </FormLabel>
                    )}

                    {/* Multi-Select Container */}
                    <FormControl>
                        <div className={`${styles.multiSelectWrapper} ${wrapperSizeClass}`}>
                            <div
                                className={`${styles.multiSelect} ${sizeClass} ${error ? styles.selectError : ''} ${selectedValues.length > 0 ? styles.hasValue : ''} ${selectClassName}`}
                                onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
                            >
                                <div className={styles.selectedTags}>
                                    {selectedValues.length === 0 ? (
                                        <span className={`${styles.placeholder} ${placeholderSizeClass}`}>
                                            {placeholder}
                                        </span>
                                    ) : (
                                        getSelectedLabels().map((label, index) => (
                                            <span key={index} className={`${styles.selectedTag} ${tagSizeClass}`}>
                                                {label}
                                                <button
                                                    type="button"
                                                    className={styles.removeTag}
                                                    onClick={(e) => handleRemove(selectedValues[index], e)}
                                                >
                                                    <FiX size={getIconSize()} />
                                                </button>
                                            </span>
                                        ))
                                    )}
                                </div>
                                <FiChevronDown className={`${styles.selectIcon} ${iconSizeClass} ${isOpen ? styles.iconRotated : ''}`} />
                            </div>

                            {/* Dropdown */}
                            {isOpen && !disabled && !loading && (
                                <div className={`${styles.dropdown} ${dropdownSizeClass}`}>
                                    {options.map((option, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.dropdownItem} ${dropdownItemSizeClass} ${selectedValues.includes(option.value) ? styles.selected : ''}`}
                                            onClick={() => handleSelect(option.value)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedValues.includes(option.value)}
                                                readOnly
                                                className={`${styles.checkbox} ${checkboxSizeClass}`}
                                            />
                                            <span>{option.label}</span>
                                            {option.count !== undefined && (
                                                <span className={styles.count}>({option.count})</span>
                                            )}
                                        </div>
                                    ))}

                                    {options.length === 0 && (
                                        <div className={styles.noOptions}>
                                            No options available
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Loading Indicator */}
                            {loading && (
                                <div className={styles.loadingSpinner}>
                                    <div className={styles.spinner}></div>
                                </div>
                            )}
                        </div>
                    </FormControl>

                    {/* Max Selections Warning */}
                    {maxSelections && selectedValues.length >= maxSelections && (
                        <div className={`${styles.maxWarning} ${warningSizeClass}`}>
                            Maximum {maxSelections} selections allowed
                        </div>
                    )}

                    {/* Description */}
                    {description && (
                        <FormDescription className={`${styles.description} ${descriptionSizeClass}`}>
                            {description}
                        </FormDescription>
                    )}

                    {/* Error Message */}
                    <FormMessage className={`${styles.errorMessage} ${errorSizeClass}`} />
                </FormItem>
            )}
        />
    );
}