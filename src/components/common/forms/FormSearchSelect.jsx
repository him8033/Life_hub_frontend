// src/components/common/forms/FormSearchSelect.jsx

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FiChevronDown, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import styles from '@/styles/common/forms/FormSearchSelect.module.css';

export default function FormSearchSelect({
    name,
    label,
    placeholder = "Search and select...",
    options = [],
    fetchOptions = null,
    valueKey = "value",
    labelKey = "label",
    imageKey = null,
    iconKey = null,
    categoryKey = null,
    required = false,
    disabled = false,
    loading = false,
    description,
    size = "md",
    debounce = 300,
    minSearchLength = 1,
    emptyMessage = "No options found",
    searchPlaceholder = "Search...",
    className = "",
    onChange,
    onLoadMore,
    hasMore = false,
    loadMoreText = "Load more",
    showCategory = false,
}) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name];
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [loadingMore, setLoadingMore] = useState(false);

    /* SIZE CLASSES */
    const sizeClass = styles[`input${size.charAt(0).toUpperCase() + size.slice(1)}`] || "";
    const dropdownClass = styles[`dropdown${size.charAt(0).toUpperCase() + size.slice(1)}`] || "";

    /* CLICK OUTSIDE */
    useEffect(() => {
        const handler = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    /* Initialize items with options */
    useEffect(() => {
        if (options.length > 0) {
            setItems(options);
        }
    }, [options]);

    /* API SEARCH */
    const searchRemote = useCallback(async (keyword) => {
        if (!fetchOptions) {
            return;
        }

        if (!keyword || keyword.length < minSearchLength) {
            setItems([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const result = await fetchOptions(keyword);
            const resultArray = Array.isArray(result) ? result : [];
            setItems(resultArray);
            setHighlightIndex(-1);
            setIsLoading(false);

            if (resultArray.length > 0) {
                setOpen(true);
            }
        } catch (error) {
            console.error("Search error:", error);
            setItems([]);
            setIsLoading(false);
        }
    }, [fetchOptions, minSearchLength]);

    /* SEARCH HANDLER */
    useEffect(() => {
        if (!fetchOptions) {
            return;
        }

        clearTimeout(debounceRef.current);

        if (!search || search.length < minSearchLength) {
            if (items.length > 0) {
                setItems([]);
            }
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        debounceRef.current = setTimeout(() => {
            searchRemote(search);
        }, debounce);

        return () => {
            clearTimeout(debounceRef.current);
        };
    }, [search, fetchOptions, debounce, minSearchLength, searchRemote, items.length]);

    /* SELECT ITEM */
    const selectItem = (item, field) => {
        const value = item[valueKey];

        field.onChange(value);

        if (onChange) {
            onChange(value, item);
        }

        setSearch("");
        setOpen(false);
        setHighlightIndex(-1);
        setItems([]);
    };

    /* CLEAR */
    const clearValue = (field) => {
        field.onChange("");
        if (onChange) {
            onChange("", null);
        }
        setSearch("");
        setHighlightIndex(-1);
        setItems([]);
        setOpen(true);
    };

    /* KEYBOARD */
    const handleKeyDown = (e, field) => {
        if (!open) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                if (search && search.length >= minSearchLength) {
                    searchRemote(search);
                }
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex(
                prev => prev < items.length - 1 ? prev + 1 : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex(
                prev => prev > 0 ? prev - 1 : items.length - 1
            );
        }

        if (e.key === "Enter" && highlightIndex >= 0) {
            e.preventDefault();
            const item = items[highlightIndex];
            if (item) {
                selectItem(item, field);
            }
        }

        if (e.key === "Escape") {
            setOpen(false);
            setHighlightIndex(-1);
        }
    };

    /* LOAD MORE */
    const handleLoadMore = async () => {
        if (!onLoadMore || loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            await onLoadMore();
        } catch (error) {
            console.error("Load more error:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    /* RENDER ITEM LABEL */
    const renderItemLabel = (item) => {
        return item[labelKey] || '';
    };

    /* RENDER SELECTED DISPLAY */
    const renderSelectedDisplay = (item) => {
        if (!item) return '';
        return renderItemLabel(item);
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const selected = options.find(item => item[valueKey] === field.value);

                const displayValue = open ? search : (selected ? renderSelectedDisplay(selected) : "");
                const showPlaceholder = !selected && !open && !search;

                return (
                    <FormItem className={`${styles.formItem} ${className}`}>
                        {label && (
                            <FormLabel className={styles.label}>
                                {label}
                                {required && (
                                    <span className={styles.required}>*</span>
                                )}
                            </FormLabel>
                        )}

                        <FormControl>
                            <div ref={wrapperRef} className={styles.wrapper}>
                                <div
                                    className={`${styles.inputWrapper} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
                                    onClick={() => {
                                        if (!disabled && !loading) {
                                            if (field.value) {
                                                field.onChange("");
                                                if (onChange) {
                                                    onChange("", null);
                                                }
                                                setSearch("");
                                                setItems([]);
                                            }
                                            setOpen(true);
                                        }
                                    }}
                                >
                                    <FiSearch className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        value={displayValue}
                                        placeholder={showPlaceholder ? placeholder : ""}
                                        disabled={disabled || loading}
                                        onChange={(e) => {
                                            if (!disabled) {
                                                const value = e.target.value;

                                                if (field.value && value.length > 0) {
                                                    field.onChange("");
                                                    if (onChange) {
                                                        onChange("", null);
                                                    }
                                                }

                                                setSearch(value);
                                                if (!open) setOpen(true);
                                                if (value.length < minSearchLength) {
                                                    setItems([]);
                                                }
                                            }
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, field)}
                                        className={`${styles.input} ${sizeClass}`}
                                        autoComplete="off"
                                    />

                                    {field.value && !disabled && (
                                        <button
                                            type="button"
                                            className={styles.clear}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                clearValue(field);
                                            }}
                                            aria-label="Clear selection"
                                        >
                                            <FiX />
                                        </button>
                                    )}

                                    <FiChevronDown className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`} />
                                </div>

                                {open && !disabled && (
                                    <div className={`${styles.dropdown} ${dropdownClass}`}>
                                        {(loading || isLoading) && (
                                            <div className={styles.loading}>
                                                <div className={styles.loadingSpinner} />
                                                <span>Searching...</span>
                                            </div>
                                        )}

                                        {!loading && !isLoading && items.length === 0 && (
                                            <div className={styles.empty}>
                                                <span>{emptyMessage}</span>
                                                {search && search.length >= minSearchLength && (
                                                    <span className={styles.emptyHint}>
                                                        Try a different search term
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {!loading && !isLoading && items.length > 0 && (
                                            <>
                                                <div className={styles.optionsList}>
                                                    {items.map((item, index) => {
                                                        const itemValue = item[valueKey];
                                                        const isSelected = field.value === itemValue;
                                                        return (
                                                            <div
                                                                key={itemValue || index}
                                                                className={`${styles.option} ${highlightIndex === index ? styles.highlight : ''} ${isSelected ? styles.selected : ''}`}
                                                                onMouseEnter={() => {
                                                                    setHighlightIndex(index);
                                                                }}
                                                                onClick={() => {
                                                                    selectItem(item, field);
                                                                }}
                                                            >
                                                                {imageKey && item[imageKey] && (
                                                                    <img
                                                                        src={item[imageKey]}
                                                                        className={styles.image}
                                                                        alt=""
                                                                    />
                                                                )}

                                                                {iconKey && item[iconKey] && (
                                                                    <span className={styles.icon}>
                                                                        {item[iconKey]}
                                                                    </span>
                                                                )}

                                                                <div className={styles.optionContent}>
                                                                    <span className={styles.optionLabel}>
                                                                        {renderItemLabel(item)}
                                                                    </span>
                                                                    {showCategory && categoryKey && item[categoryKey] && (
                                                                        <span className={styles.optionCategory}>
                                                                            {item[categoryKey]}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {isSelected && (
                                                                    <FiCheck className={styles.check} />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {hasMore && onLoadMore && (
                                                    <button
                                                        type="button"
                                                        className={styles.loadMoreBtn}
                                                        onClick={handleLoadMore}
                                                        disabled={loadingMore}
                                                    >
                                                        {loadingMore ? 'Loading...' : loadMoreText}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {selected && !open && (
                                    <div className={styles.selectedDisplay}>
                                        <div className={styles.selectedContent}>
                                            {imageKey && selected[imageKey] && (
                                                <img
                                                    src={selected[imageKey]}
                                                    className={styles.selectedImage}
                                                    alt=""
                                                />
                                            )}
                                            {iconKey && selected[iconKey] && (
                                                <span className={styles.selectedIcon}>
                                                    {selected[iconKey]}
                                                </span>
                                            )}
                                            <span className={styles.selectedLabel}>
                                                {renderSelectedDisplay(selected)}
                                            </span>
                                            {showCategory && categoryKey && selected[categoryKey] && (
                                                <span className={styles.selectedCategory}>
                                                    {selected[categoryKey]}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </FormControl>

                        {description && (
                            <FormDescription className={styles.description}>
                                {description}
                            </FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
}