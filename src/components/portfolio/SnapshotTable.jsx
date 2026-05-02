'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FiEye, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import { FiLock, FiGlobe } from 'react-icons/fi';

export default function SnapshotTable({
    snapshots,
    onDelete,
    onDuplicate,
    onEdit,
    onView,
    isLoading = false
}) {
    if (!snapshots || snapshots.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    📁
                </div>
                <p className={tableStyles.emptyText}>No snapshots available</p>
            </div>
        );
    }

    return (
        <div className={tableStyles.tableContainer}>
            <table className={tableStyles.dataTable}>
                <thead>
                    <tr>
                        <th>Snapshot ID</th>
                        <th>Title</th>
                        <th>Target Role</th>
                        <th>Version</th>
                        <th>Visibility</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {snapshots.map((snapshot) => (
                        <tr key={snapshot.profile_snapshot_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>
                                    {snapshot.profile_snapshot_id}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{snapshot.title}</div>
                                    {snapshot.description && (
                                        <div className={tableStyles.subName}>
                                            {snapshot.description.length > 60
                                                ? `${snapshot.description.substring(0, 60)}...`
                                                : snapshot.description}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                {snapshot.target_role ? (
                                    <span className={tableStyles.roleBadge}>
                                        {snapshot.target_role}
                                    </span>
                                ) : (
                                    <span className={tableStyles.mutedText}>—</span>
                                )}
                            </td>
                            <td>
                                <span className={tableStyles.versionBadge}>
                                    v{snapshot.version || 1}
                                </span>
                            </td>
                            <td>
                                {snapshot.visibility === 'public' ? (
                                    <span className={tableStyles.visibilityPublic}>
                                        <FiGlobe size={12} /> Public
                                    </span>
                                ) : (
                                    <span className={tableStyles.visibilityPrivate}>
                                        <FiLock size={12} /> Private
                                    </span>
                                )}
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {snapshot.updated_at ? formatDateTime(snapshot.updated_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    {onView && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={<FiEye />}
                                            onClick={() => !isLoading && onView(snapshot.profile_snapshot_id)}
                                            disabled={isLoading}
                                            className={tableStyles.iconButton}
                                            title="View"
                                        />
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiEdit2 />}
                                        onClick={() => !isLoading && onEdit(snapshot.profile_snapshot_id)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiCopy />}
                                        onClick={() => !isLoading && onDuplicate(snapshot.profile_snapshot_id, snapshot.title)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Duplicate"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiTrash2 />}
                                        onClick={() => !isLoading && onDelete(snapshot.profile_snapshot_id, snapshot.title)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Delete"
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}