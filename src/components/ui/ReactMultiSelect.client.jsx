'use client';

import React from 'react';
import Select from 'react-select';
import styles from '@/styles/ui/ReactMultiSelect.module.css';

const customStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: '42px',
        borderColor: state.isFocused ? '#4F46E5' : '#d1d5db',
        borderRadius: '6px',
        boxShadow: state.isFocused
            ? '0 0 0 3px rgba(79, 70, 229, 0.1)'
            : 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#4F46E5' : '#9ca3af',
        },
        backgroundColor: state.isDisabled ? '#f9fafb' : 'white',
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#f5f3ff',
        borderRadius: '4px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#4F46E5',
        fontWeight: '500',
        padding: '2px 6px',
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: '#4F46E5',
        '&:hover': {
            backgroundColor: '#ede9fe',
            color: '#4338CA',
        },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#f5f3ff'
            : state.isFocused
                ? '#f3f4f6'
                : 'white',
        color: state.isSelected ? '#4F46E5' : '#374151',
        fontWeight: state.isSelected ? '500' : '400',
    }),
};

const ReactMultiSelectClient = ({
    options = [],
    value = [],
    onChange,
    placeholder = 'Select categories...',
    isDisabled = false,
    isSearchable = true,
    isLoading = false,
    className = '',
}) => {
    const selectOptions = options.map(option => ({
        value: option.spotcategory_id || option.value,
        label: option.name || option.label,
        count: option.count,
    }));

    const selectedValues = selectOptions.filter(opt =>
        value.includes(opt.value)
    );

    const handleChange = (selected) => {
        const newValue = selected ? selected.map(i => i.value) : [];
        onChange(newValue);
    };

    const formatOptionLabel = (option) => (
        <div className={styles.optionContainer}>
            <span>{option.label}</span>
            {option.count !== undefined && (
                <span className={styles.optionCount}>({option.count})</span>
            )}
        </div>
    );

    return (
        <Select
            isMulti
            options={selectOptions}
            value={selectedValues}
            onChange={handleChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
            isLoading={isLoading}
            isSearchable={isSearchable}
            styles={customStyles}
            className={className}
            formatOptionLabel={formatOptionLabel}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            classNamePrefix="react-select"
        />
    );
};

export default ReactMultiSelectClient;
