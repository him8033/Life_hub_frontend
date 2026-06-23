'use client';

import { useParams, useRouter } from 'next/navigation';
import ResumeBuilder from '@/components/portfolio/ResumeBuilder';
import { useGenerateResumePDFMutation } from '@/services/api/portfolioApi';
import { useSnackbar } from '@/context/SnackbarContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';

export default function ResumeBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const resumeId = params.resumeId;
    const [generatePDF] = useGenerateResumePDFMutation();

    const handlePreview = (slug) => {
        window.open(`/resume/${slug}`, '_blank');
    };

    const handleGeneratePDF = async (id) => {
        try {
            await generatePDF(id).unwrap();
            showSnackbar('PDF generated successfully!', 'success', 3000);
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to generate PDF'), 'error', 5000);
        }
    };

    const handleBack = () => {
        router.push(ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST);
    };

    return (
        <ResumeBuilder
            resumeId={resumeId}
            onBack={handleBack}
            onPreview={handlePreview}
            onGeneratePDF={handleGeneratePDF}
        />
    );
}