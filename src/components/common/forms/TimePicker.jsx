'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FiClock, FiChevronDown, FiX } from 'react-icons/fi';
import styles from '@/styles/common/forms/TimePicker.module.css';

const TimePicker = ({
    value,
    onChange,
    placeholder = 'Select time',
    disabled = false,
    required = false,
    error = false,
    size = 'md',
    className = '',
    label,
    description,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);
    const [selectedMinute, setSelectedMinute] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [manualInput, setManualInput] = useState('');
    const wrapperRef = useRef(null);
    const hourRef = useRef(null);
    const minuteRef = useRef(null);
    const isScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);
    
    const ITEM_HEIGHT = 40;
    const VISIBLE_ITEMS = 5;
    
    // Generate time options
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    // Initialize from value
    useEffect(() => {
        if (value && value !== 'not-specified') {
            let timeString = value;
            if (timeString.includes(':')) {
                const parts = timeString.split(':');
                const hour = parts[0];
                const minute = parts[1];
                
                const hourNum = parseInt(hour);
                const period = hourNum >= 12 ? 'PM' : 'AM';
                const displayHour = hourNum % 12 || 12;
                
                setSelectedHour(displayHour);
                setSelectedMinute(minute);
                setSelectedPeriod(period);
                setManualInput(formatDisplayTime(displayHour, minute, period));
            }
        } else {
            setSelectedHour(null);
            setSelectedMinute(null);
            setSelectedPeriod(null);
            setManualInput('');
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll to selected value when dropdown opens
    useEffect(() => {
        if (isOpen && selectedHour !== null && hourRef.current) {
            const index = hours.indexOf(selectedHour);
            if (index >= 0) {
                hourRef.current.scrollTop = index * ITEM_HEIGHT;
            }
        }
        if (isOpen && selectedMinute !== null && minuteRef.current) {
            const index = minutes.indexOf(selectedMinute);
            if (index >= 0) {
                minuteRef.current.scrollTop = index * ITEM_HEIGHT;
            }
        }
    }, [isOpen, selectedHour, selectedMinute]);

    // Format time for display
    const formatDisplayTime = (hour, minute, period) => {
        if (!hour || !minute || !period) return '';
        return `${hour}:${minute} ${period}`;
    };

    // Get 24-hour format value with seconds
    const get24HourValue = useCallback((hour, minute, period) => {
        if (!hour || !minute || !period) return '';
        let hour24 = hour;
        if (period === 'PM' && hour !== 12) {
            hour24 = hour + 12;
        } else if (period === 'AM' && hour === 12) {
            hour24 = 0;
        }
        return `${hour24.toString().padStart(2, '0')}:${minute}:00`;
    }, []);

    const updateTimeValue = useCallback((hour, minute, period) => {
        const timeValue = get24HourValue(hour, minute, period);
        onChange(timeValue);
        setManualInput(formatDisplayTime(hour, minute, period));
    }, [get24HourValue, onChange]);

    const handleHourSelect = useCallback((hour) => {
        setSelectedHour(hour);
        if (selectedMinute && selectedPeriod) {
            updateTimeValue(hour, selectedMinute, selectedPeriod);
        }
    }, [selectedMinute, selectedPeriod, updateTimeValue]);

    const handleMinuteSelect = useCallback((minute) => {
        setSelectedMinute(minute);
        if (selectedHour && selectedPeriod) {
            updateTimeValue(selectedHour, minute, selectedPeriod);
        }
    }, [selectedHour, selectedPeriod, updateTimeValue]);

    const handlePeriodSelect = useCallback((period) => {
        setSelectedPeriod(period);
        if (selectedHour && selectedMinute) {
            updateTimeValue(selectedHour, selectedMinute, period);
        }
    }, [selectedHour, selectedMinute, updateTimeValue]);

    const handleClear = useCallback(() => {
        setSelectedHour(null);
        setSelectedMinute(null);
        setSelectedPeriod(null);
        setManualInput('');
        onChange('');
        setIsOpen(false);
    }, [onChange]);

    // Handle manual input
    const handleManualInputChange = (e) => {
        const input = e.target.value;
        setManualInput(input);
        
        // Try to parse the input
        const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
        const match = input.match(timeRegex);
        
        if (match) {
            let hour = parseInt(match[1]);
            const minute = match[2];
            const period = match[3].toUpperCase();
            
            if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
                handleHourSelect(hour);
                handleMinuteSelect(minute);
                handlePeriodSelect(period);
            }
        }
    };

    const handleManualInputBlur = () => {
        if (selectedHour && selectedMinute && selectedPeriod) {
            setManualInput(formatDisplayTime(selectedHour, selectedMinute, selectedPeriod));
        } else {
            setManualInput('');
        }
    };

    // Handle scroll with debounce to prevent infinite loop
    const handleHourScroll = useCallback((e) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
            const scrollTop = e.target.scrollTop;
            const index = Math.floor((scrollTop + ITEM_HEIGHT / 2) / ITEM_HEIGHT);
            if (index >= 0 && index < hours.length) {
                const hour = hours[index];
                if (hour !== selectedHour) {
                    setSelectedHour(hour);
                    if (selectedMinute && selectedPeriod) {
                        updateTimeValue(hour, selectedMinute, selectedPeriod);
                    }
                }
            }
        }, 50);
    }, [hours, selectedHour, selectedMinute, selectedPeriod, updateTimeValue]);

    const handleMinuteScroll = useCallback((e) => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
            const scrollTop = e.target.scrollTop;
            const index = Math.floor((scrollTop + ITEM_HEIGHT / 2) / ITEM_HEIGHT);
            if (index >= 0 && index < minutes.length) {
                const minute = minutes[index];
                if (minute !== selectedMinute) {
                    setSelectedMinute(minute);
                    if (selectedHour && selectedPeriod) {
                        updateTimeValue(selectedHour, minute, selectedPeriod);
                    }
                }
            }
        }, 50);
    }, [minutes, selectedHour, selectedMinute, selectedPeriod, updateTimeValue]);

    const displayValue = selectedHour && selectedMinute && selectedPeriod 
        ? formatDisplayTime(selectedHour, selectedMinute, selectedPeriod)
        : '';

    // Size classes
    const sizeClass = styles[`picker${size.charAt(0).toUpperCase() + size.slice(1)}`] || '';

    // Render scrollable list
    const renderScrollList = (items, selectedValue, onScroll, scrollRef) => {
        return (
            <div
                ref={scrollRef}
                className={styles.scrollList}
                onScroll={onScroll}
                style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
            >
                <div style={{ height: ITEM_HEIGHT * 2 }} />
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.scrollItem} ${selectedValue === item ? styles.selected : ''}`}
                        style={{ height: ITEM_HEIGHT }}
                        onClick={() => {
                            if (scrollRef === hourRef) {
                                handleHourSelect(item);
                            } else if (scrollRef === minuteRef) {
                                handleMinuteSelect(item);
                            }
                        }}
                    >
                        {item}
                    </div>
                ))}
                <div style={{ height: ITEM_HEIGHT * 2 }} />
            </div>
        );
    };

    return (
        <div className={`${styles.timePickerWrapper} ${className}`} ref={wrapperRef}>
            {label && (
                <label className={styles.timePickerLabel}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    className={`${styles.timePickerInput} ${sizeClass} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''} ${displayValue ? styles.hasValue : ''}`}
                    value={manualInput}
                    onChange={handleManualInputChange}
                    onBlur={handleManualInputBlur}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={false}
                />
                <FiClock className={styles.clockIcon} />
                {manualInput && !disabled && (
                    <button
                        type="button"
                        className={styles.clearIcon}
                        onClick={handleClear}
                    >
                        <FiX />
                    </button>
                )}
                <FiChevronDown className={`${styles.chevronIcon} ${isOpen ? styles.rotated : ''}`} />
            </div>

            {isOpen && !disabled && (
                <>
                    <div className={styles.timePickerOverlay} onClick={() => setIsOpen(false)} />
                    <div className={styles.timePickerDropdown}>
                        <div className={styles.timePickerHeader}>
                            <span className={styles.headerTitle}>Select Time</span>
                            <button
                                type="button"
                                onClick={handleClear}
                                className={styles.clearButton}
                            >
                                Clear
                            </button>
                        </div>

                        <div className={styles.timePickerColumns}>
                            {/* Hours Column */}
                            <div className={styles.timeColumn}>
                                <div className={styles.columnTitle}>Hour</div>
                                {renderScrollList(hours, selectedHour, handleHourScroll, hourRef)}
                            </div>

                            {/* Minutes Column */}
                            <div className={styles.timeColumn}>
                                <div className={styles.columnTitle}>Minute</div>
                                {renderScrollList(minutes, selectedMinute, handleMinuteScroll, minuteRef)}
                            </div>

                            {/* Period Column */}
                            <div className={styles.timeColumn}>
                                <div className={styles.columnTitle}>AM/PM</div>
                                <div className={styles.staticColumn}>
                                    {periods.map((period) => (
                                        <button
                                            key={period}
                                            type="button"
                                            className={`${styles.staticItem} ${selectedPeriod === period ? styles.selected : ''}`}
                                            onClick={() => handlePeriodSelect(period)}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {description && (
                <p className={styles.timePickerDescription}>{description}</p>
            )}
        </div>
    );
};

export default TimePicker;