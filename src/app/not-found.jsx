'use client';

import PageNotFound from '@/components/common/PageNotFound';
import { ROUTES } from '@/routes/routes.constants';

export default function NotFound() {
    return (
        <PageNotFound
            title="Page Not Found"
            message="The page you are looking for doesn't exist or may have been moved. Please check the URL and try again."
            homeLabel="Go to Dashboard"
            homePath={ROUTES.HOME}
            backLabel="Go Back"
            showBackButton={true}
            showHomeButton={true}
            show404={true}
            background="gradient"
        />
    );
}