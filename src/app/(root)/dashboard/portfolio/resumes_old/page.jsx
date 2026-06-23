'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/common/buttons/Button';
import ResumeCard from '@/components/portfolio/ResumeCard';
import { useGetResumeProjectsQuery, useDeleteResumeProjectMutation, useDuplicateResumeProjectMutation, useGenerateResumePDFMutation } from '@/services/api/portfolioApi';
import { FiFileText, FiPlus } from 'react-icons/fi';
import styles from '@/styles/portfolio/resume/ResumeList.module.css';

export default function ResumesPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [isDeleting, setIsDeleting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const { data, isLoading, error, refetch } = useGetResumeProjectsQuery();
    const [deleteResume] = useDeleteResumeProjectMutation();
    const [duplicateResume] = useDuplicateResumeProjectMutation();
    const [generatePDF] = useGenerateResumePDFMutation();

    const resumes = data?.data || [];

    const handleDelete = async (resumeId, title) => {
        const ok = await confirm({ title: 'Delete Resume', message: `Delete "${title}"?`, confirmText: 'Delete', cancelText: 'Cancel', type: 'danger' });
        if (!ok) return;
        try { setIsDeleting(true); await deleteResume(resumeId).unwrap(); showSnackbar('Resume deleted', 'success', 3000); refetch(); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
        finally { setIsDeleting(false); }
    };

    const handleDuplicate = async (resumeId, title) => {
        try { await duplicateResume(resumeId).unwrap(); showSnackbar(`"${title}" duplicated`, 'success', 3000); refetch(); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
    };

    const handleGeneratePDF = async (resumeId) => {
        try { setIsGenerating(true); await generatePDF(resumeId).unwrap(); showSnackbar('PDF generated successfully', 'success', 3000); refetch(); }
        catch (error) { showSnackbar(extractErrorMessage(error, 'Failed'), 'error', 5000); }
        finally { setIsGenerating(false); }
    };

    const handlePreview = (slug) => {
        window.open(`/resume/${slug}`, '_blank');
    };

    if (isLoading) return <Loader text="Loading resumes..." />;
    if (error) return <ErrorState message={error?.data?.message || "Failed to load resumes"} onRetry={refetch} retryMsg="Retry" />;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiFileText className={styles.pageIcon} />
                    <div>
                        <h1 className={styles.pageTitle}>My Resumes</h1>
                        <p className={styles.pageSubtitle}>{resumes.length} resume{resumes.length !== 1 ? 's' : ''} created</p>
                    </div>
                </div>
                <Button variant="primary" onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.CREATE)} icon={<FiPlus />}>Create Resume</Button>
            </div>

            {resumes.length > 0 ? (
                <div className={styles.grid}>
                    {resumes.map(resume => (
                        <ResumeCard
                            key={resume.resume_id}
                            resume={resume}
                            onEdit={(id) => router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.EDIT(id))}
                            onDelete={handleDelete}
                            onDuplicate={handleDuplicate}
                            onGeneratePDF={handleGeneratePDF}
                            onPreview={handlePreview}
                            isLoading={isDeleting || isGenerating}
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <FiFileText size={48} />
                    <h3>No resumes yet</h3>
                    <p>Create your first resume from a profile snapshot</p>
                    <Button variant="primary" onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.CREATE)} icon={<FiPlus />}>Create Resume</Button>
                </div>
            )}
        </div>
    );
}