'use client';

import { useParams } from 'next/navigation';
import { useGetPublicResumeQuery } from '@/services/api/portfolioApi';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import { getTemplate } from '@/components/portfolio/template/TemplateRegistry';
import styles from '@/styles/portfolio/resume/ResumePreview.module.css';

export default function PublicResumePage() {
    const params = useParams();
    const slug = params.slug;

    const { data, isLoading, error } = useGetPublicResumeQuery(slug, { skip: !slug });
    const resumeData = data?.data;

    if (isLoading) return <Loader text="Loading resume..." />;
    if (error?.status === 404) return <NotFoundState title="Resume Not Found" message="This resume doesn't exist or is private." fullPage />;
    if (error) return <ErrorState message="Failed to load resume" />;
    if (!resumeData) return <NotFoundState title="Resume Not Found" fullPage />;

    // Get the template key from resume data
    const templateKey = resumeData.resume?.resume_template_key ||
        resumeData.template?.key ||
        'modern_ats';

    // Get the template component
    const TemplateComponent = getTemplate(templateKey);

    // Pass the resume data to the template
    return (
        <div className={styles.publicPage}>
            <TemplateComponent data={resumeData} />
        </div>
    );
}