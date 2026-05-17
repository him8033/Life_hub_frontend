'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSnackbar } from '@/context/SnackbarContext';
import { useConfirm } from '@/context/ConfirmContext';
import { extractErrorMessage } from '@/utils/errorHandler';
import { ROUTES } from '@/routes/routes.constants';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import NotFoundState from '@/components/common/NotFoundState';
import Button from '@/components/common/buttons/Button';
import { useGetSnapshotQuery, useDeleteSnapshotMutation, useDuplicateSnapshotMutation } from '@/services/api/portfolioApi';
import { formatDateTime } from '@/utils/date.utils';
import styles from '@/styles/portfolio/SnapshotView.module.css';
import {
    FiEdit2, FiTrash2, FiCopy, FiArrowLeft, FiFolder,
    FiTarget, FiFileText, FiGlobe, FiLock, FiCalendar,
    FiHash, FiLayers, FiLink
} from 'react-icons/fi';

export default function SnapshotViewPage() {
    const params = useParams();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const confirm = useConfirm();
    const snapshotId = params.snapshotId;

    const { data, isLoading, error, refetch } = useGetSnapshotQuery(snapshotId, { skip: !snapshotId });
    const [deleteSnapshot] = useDeleteSnapshotMutation();
    const [duplicateSnapshot] = useDuplicateSnapshotMutation();

    const snapshot = data?.data;

    const handleDelete = async () => {
        const ok = await confirm({
            title: 'Delete Snapshot',
            message: `Are you sure you want to delete "${snapshot?.title}"? This action cannot be undone. All associated data will be permanently removed.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
        });
        if (!ok) return;
        try {
            await deleteSnapshot(snapshotId).unwrap();
            showSnackbar('Snapshot deleted successfully', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST);
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to delete snapshot'), 'error', 5000);
        }
    };

    const handleDuplicate = async () => {
        try {
            await duplicateSnapshot(snapshotId).unwrap();
            showSnackbar('Snapshot duplicated successfully', 'success', 5000);
            router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST);
        } catch (error) {
            showSnackbar(extractErrorMessage(error, 'Failed to duplicate snapshot'), 'error', 5000);
        }
    };

    if (isLoading) return <Loader text="Loading snapshot..." />;

    if (error?.status === 404) {
        return (
            <NotFoundState
                title="Snapshot Not Found"
                message="The snapshot you're looking for doesn't exist or is no longer available."
                backLabel="Back to Snapshots"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST}
                fullPage={true}
            />
        );
    }

    if (error) {
        return (
            <ErrorState
                message={error?.data?.message || "Failed to load snapshot details"}
                onRetry={refetch}
                retryMsg="Retry"
            />
        );
    }

    if (!snapshot) {
        return (
            <NotFoundState
                title="Snapshot Not Found"
                message="The snapshot you're looking for doesn't exist."
                backLabel="Back to Snapshots"
                backTo={ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST}
                fullPage={true}
            />
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Back Button */}
            <button
                onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST)}
                className={styles.backButton}
            >
                <FiArrowLeft /> Back to Snapshots
            </button>

            {/* Header Card */}
            <div className={styles.headerCard}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}>
                        <FiFolder />
                    </div>
                    <div className={styles.headerInfo}>
                        <h1 className={styles.headerTitle}>{snapshot.title}</h1>
                        {snapshot.target_role && (
                            <span className={styles.headerRole}>
                                <FiTarget size={12} />
                                {snapshot.target_role}
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiCopy />}
                        onClick={handleDuplicate}
                    >
                        Duplicate
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiEdit2 />}
                        onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.EDIT(snapshotId))}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<FiTrash2 />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            {/* Details Grid */}
            <div className={styles.detailsGrid}>
                {/* Main Info Card */}
                <div className={styles.detailCard}>
                    <h3 className={styles.cardTitle}>Snapshot Information</h3>
                    <div className={styles.cardContent}>
                        {snapshot.description && (
                            <div className={styles.infoRow}>
                                <div className={styles.infoIcon}>
                                    <FiFileText />
                                </div>
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Description</span>
                                    <p className={styles.infoValue}>{snapshot.description}</p>
                                </div>
                            </div>
                        )}

                        <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                                <FiTarget />
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoLabel}>Target Role</span>
                                <span className={styles.infoValue}>
                                    {snapshot.target_role || 'Not specified'}
                                </span>
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                                {snapshot.visibility === 'public' ? <FiGlobe /> : <FiLock />}
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoLabel}>Visibility</span>
                                <span className={`${styles.visibilityBadge} ${snapshot.visibility === 'public' ? styles.publicBadge : styles.privateBadge
                                    }`}>
                                    {snapshot.visibility === 'public' ? 'Public' : 'Private'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meta Info Card */}
                <div className={styles.detailCard}>
                    <h3 className={styles.cardTitle}>Metadata</h3>
                    <div className={styles.cardContent}>
                        <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                                <FiHash />
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoLabel}>Snapshot ID</span>
                                <span className={styles.infoValueMono}>
                                    {snapshot.profile_snapshot_id}
                                </span>
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                                <FiLayers />
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoLabel}>Version</span>
                                <span className={styles.versionBadge}>
                                    v{snapshot.version || 1}
                                </span>
                            </div>
                        </div>

                        {snapshot.source_profile && (
                            <div className={styles.infoRow}>
                                <div className={styles.infoIcon}>
                                    <FiLink />
                                </div>
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Source Profile</span>
                                    <span className={styles.infoValueMono}>
                                        {snapshot.source_profile}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                                <FiCalendar />
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoLabel}>Created</span>
                                <span className={styles.infoValue}>
                                    {snapshot.created_at ? formatDateTime(snapshot.created_at) : '—'}
                                </span>
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoIcon}>
                                <FiCalendar />
                            </div>
                            <div className={styles.infoContent}>
                                <span className={styles.infoLabel}>Last Updated</span>
                                <span className={styles.infoValue}>
                                    {snapshot.updated_at ? formatDateTime(snapshot.updated_at) : '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className={styles.detailCard}>
                    <h3 className={styles.cardTitle}>Quick Actions</h3>
                    <div className={styles.cardContent}>
                        <div className={styles.actionGrid}>
                            <button
                                className={styles.actionCard}
                                onClick={() => router.push(ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.EDIT(snapshotId))}
                            >
                                <FiEdit2 className={styles.actionIcon} />
                                <span className={styles.actionLabel}>Edit Snapshot</span>
                                <span className={styles.actionDesc}>Update details</span>
                            </button>
                            <button
                                className={styles.actionCard}
                                onClick={handleDuplicate}
                            >
                                <FiCopy className={styles.actionIcon} />
                                <span className={styles.actionLabel}>Duplicate</span>
                                <span className={styles.actionDesc}>Create a copy</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}