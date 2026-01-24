'use client';

import dynamic from 'next/dynamic';

const ReactMultiSelect = dynamic(
    () => import('./ReactMultiSelect.client'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[42px] w-full rounded-md border bg-muted animate-pulse" />
        ),
    }
);

export default ReactMultiSelect;
