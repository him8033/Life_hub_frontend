'use client';
import { useCallback, useState } from 'react';

export default function useSlugGenerator(initialSlug = '') {
    const [slug, setSlug] = useState(initialSlug);
    const [isManual, setIsManual] = useState(!!initialSlug);

    const normalize = useCallback((value) => {
        return value
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }, []);

    const generateFrom = useCallback(
        (value) => {
            if (!isManual) {
                setSlug(normalize(value));
            }
        },
        [isManual, normalize]
    );

    const updateManually = useCallback(
        (value) => {
            setIsManual(true);
            setSlug(normalize(value));
        },
        [normalize]
    );

    const reset = useCallback((value = '') => {
        setSlug(value);
        setIsManual(!!value);
    }, []);

    return {
        slug,
        generateFrom,
        updateManually,
        reset,
    };
}
