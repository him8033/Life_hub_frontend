'use client';

import { useState } from 'react';
import FormInput from './FormInput';
import { PrimaryButton } from './FormButtons';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import searchStyles from '@/styles/common/Search.module.css';

export default function SearchForm({ onSearch, placeholder = "Search...", isLoading = false }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className={searchStyles.searchForm}>
            <div className={searchStyles.searchContainer}>
                <FormInput
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    icon={<MagnifyingGlassIcon />}
                    inputClassName={searchStyles.searchInput}
                />
                <PrimaryButton
                    type="submit"
                    disabled={isLoading}
                    className={searchStyles.searchButton}
                >
                    Search
                </PrimaryButton>
            </div>
        </form>
    );
}