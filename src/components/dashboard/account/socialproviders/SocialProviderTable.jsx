'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaEdit, FaTrash } from "react-icons/fa";

export default function SocialProviderTable({
    socialproviders,
    onDelete,
    onToggleStatus,
    onEdit,
    isLoading = false
}) {
    if (!socialproviders || socialproviders.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    🔗
                </div>
                <p className={tableStyles.emptyText}>No social providers available</p>
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
                    {socialproviders.map((socialprovider) => (
                        <tr key={socialprovider.socialprovider_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{socialprovider.socialprovider_id || 'N/A'}</span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{socialprovider.name}</div>
                                    <div className={tableStyles.subName}>{socialprovider.slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {socialprovider.description || '—'}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant={socialprovider.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(socialprovider.socialprovider_id, socialprovider.is_active, socialprovider.name)}
                                    disabled={isLoading}
                                >
                                    {socialprovider.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {socialprovider.created_at ? formatDateTime(socialprovider.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaEdit />}
                                        onClick={() => !isLoading && onEdit(socialprovider)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(socialprovider.socialprovider_id, socialprovider.name)}
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
