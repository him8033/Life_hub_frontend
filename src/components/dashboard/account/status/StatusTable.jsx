'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaEdit, FaTrash } from "react-icons/fa";

export default function StatusTable({
    statuses,
    onDelete,
    onToggleStatus,
    onEdit,
    isLoading = false
}) {
    if (!statuses || statuses.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    📊
                </div>
                <p className={tableStyles.emptyText}>No statuses available</p>
            </div>
        );
    }

    return (
        <div className={tableStyles.tableContainer}>
            <table className={tableStyles.dataTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {statuses.map((status) => (
                        <tr key={status.userstatus_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{status.userstatus_id || 'N/A'}</span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{status.name}</div>
                                    <div className={tableStyles.subName}>{status.slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {status.description || '—'}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant={status.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(status.userstatus_id, status.is_active, status.name)}
                                    disabled={isLoading}
                                >
                                    {status.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {status.created_at ? formatDateTime(status.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaEdit />}
                                        onClick={() => !isLoading && onEdit(status)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(status.userstatus_id, status.name)}
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
