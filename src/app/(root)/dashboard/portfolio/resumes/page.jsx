'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import Button from '@/components/common/buttons/Button';
import ResumeCard from '@/components/portfolio/ResumeCard';
import {
    useGetResumeProjectsQuery,
    useDeleteResumeProjectMutation,
    useDuplicateResumeProjectMutation,
    useGenerateResumePDFMutation,
} from '@/services/api/portfolioApi';
import { FiFileText, FiPlus, FiSearch } from 'react-icons/fi';
import styles from '@/styles/common/CommonListing.module.css';

export default function ResumesPage() {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const { data, isLoading, error, refetch } = useGetResumeProjectsQuery();
    const [deleteResume] = useDeleteResumeProjectMutation();
    const [duplicateResume] = useDuplicateResumeProjectMutation();
    const [generatePDF] = useGenerateResumePDFMutation();

    const resumes = data?.data || [];

    const filteredResumes = resumes.filter(r =>
        r.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (resumeId, title) => {
        const ok = await confirm({
            title: 'Delete Resume',
            message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            setIsDeleting(true);
            await deleteResume(resumeId).unwrap();
            showSnackbar('Resume deleted successfully', 'success', 3000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete resume'), 'error', 5000);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async (resumeId, title) => {
        try {
            await duplicateResume(resumeId).unwrap();
            showSnackbar(`"${title}" duplicated successfully`, 'success', 3000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to duplicate resume'), 'error', 5000);
        }
    };

    const handleGeneratePDF = async (resumeId) => {
        try {
            setIsGenerating(true);
            await generatePDF(resumeId).unwrap();
            showSnackbar('PDF generated successfully', 'success', 3000);
            refetch();
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to generate PDF'), 'error', 5000);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePreview = (slug) => {
        window.open(ROUTES.DASHBOARD.PORTFOLIO.RESUME.PREVIEW(slug), '_blank');
    };

    const handleEdit = (resumeId) => {
        router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.VIEW(resumeId));
    };

    const handleEditSettings = (resumeId) => {
        router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.EDIT(resumeId));
    };

    if (isLoading) return <Loader text="Loading resumes..." />;

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load resumes"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Page Header - Same as Travel Spots */}
            <div className={styles.pageHeader}>
                <div className={styles.pageTitleWrapper}>
                    <FiFileText className={styles.pageIcon} />
                    <h1 className={styles.pageTitle}>My Resumes</h1>
                </div>
                <Button
                    variant="primary"
                    onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.CREATE)}
                    icon={<FiPlus />}
                >
                    Create Resume
                </Button>
            </div>

            {/* Search Bar */}
            {resumes.length > 0 && (
                <div className={styles.searchWrapper}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search resumes by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button className={styles.clearSearch} onClick={() => setSearchTerm('')}>
                            ✕
                        </button>
                    )}
                </div>
            )}

            {/* Resume Cards Grid */}
            {filteredResumes.length > 0 ? (
                <div className={styles.cardGrid}>
                    {filteredResumes.map((resume) => (
                        <ResumeCard
                            key={resume.resume_id}
                            resume={resume}
                            onEdit={() => handleEdit(resume.resume_id)}
                            onEditSettings={() => handleEditSettings(resume.resume_id)}
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
                    <h3>{searchTerm ? 'No resumes match your search' : 'No resumes yet'}</h3>
                    <p>
                        {searchTerm
                            ? 'Try a different search term or clear the search.'
                            : 'Create your first resume from scratch or use existing profile data.'}
                    </p>
                    {!searchTerm && (
                        <Button
                            variant="primary"
                            onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.CREATE)}
                            icon={<FiPlus />}
                        >
                            Create Resume
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}