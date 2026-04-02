    'use client';

    import listingStyles from '@/styles/common/table/TableHeader.module.css';
    import { FiSearch, FiFilter } from 'react-icons/fi';
    import Button from '@/components/common/buttons/Button';
    import SimpleSelect from '@/components/common/forms/SimpleSelect';
    import SimpleInput from '@/components/common/forms/SimpleInput';

    export default function TableHeader({
        searchTerm,
        setSearchTerm,
        filters = [],
        activeFilterCount = 0,
        onOpenFilters,
        onClearFilters,
        placeholder = "Search...",
        showSearch = true,
        showFilterButton = false,
        filterButtonText = "Filters",
        size = 'md', // sm, md, lg - consistent size for all elements
    }) {
        return (
            <div className={listingStyles.tableHeader}>
                {/* Header Row */}
                <div className={listingStyles.headerRow}>
                    {/* Left Side - Filters and Filter Button */}
                    <div className={listingStyles.leftSection}>
                        <div className={listingStyles.filtersContainer}>
                            {filters.map((filter, index) => (
                                <div key={index} className={listingStyles.filterGroup}>
                                    <SimpleSelect
                                        label={filter.label}
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.target.value)}
                                        options={filter.options}
                                        disabled={filter.disabled}
                                        placeholder={filter.placeholder || `Select ${filter.label}`}
                                        emptyOption={false}
                                        size={size}
                                        className={listingStyles.filterSelect}
                                        required={filter.required}
                                        error={filter.error}
                                        description={filter.description}
                                    />
                                </div>
                            ))}

                            {/* Filter Button - Placed at the end of select bar queue */}
                            {showFilterButton && onOpenFilters && (
                                <div className={listingStyles.filterGroup}>
                                    <Button
                                        variant="outline"
                                        size={size}
                                        onClick={onOpenFilters}
                                        icon={<FiFilter />}
                                        className={listingStyles.filterButton}
                                    >
                                        {filterButtonText}
                                        {activeFilterCount > 0 && (
                                            <span className={`${listingStyles.filterBadge} ${listingStyles[`filterBadge${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}>
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Search Section */}
                    {showSearch && (
                        <div className={listingStyles.searchSection}>
                            <SimpleInput
                                name="search"
                                placeholder={placeholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={FiSearch}
                                size={size}
                                className={listingStyles.searchInput}
                            />
                        </div>
                    )}
                </div>

                {/* Clear Filters Row */}
                {activeFilterCount > 0 && onClearFilters && (
                    <div className={listingStyles.clearFiltersRow}>
                        <button
                            onClick={onClearFilters}
                            className={`${listingStyles.clearFiltersButton} ${listingStyles[`clearFiltersButton${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}
                        >
                            Clear all filters ({activeFilterCount})
                        </button>
                    </div>
                )}
            </div>
        );
    }