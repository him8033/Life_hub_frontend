'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaEdit, FaTrash } from "react-icons/fa";

export default function OTPPurposeTable({
    otppurposes,
    onDelete,
    onToggleStatus,
    onEdit,
    isLoading = false
}) {
    if (!otppurposes || otppurposes.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    🔐
                </div>
                <p className={tableStyles.emptyText}>No OTP purposes available</p>
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
                        <th>Expiry (sec)</th>
                        <th>Max Attempts</th>
                        <th>Cooldown (sec)</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {otppurposes.map((otppurpose) => (
                        <tr key={otppurpose.otppurpose_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{otppurpose.otppurpose_id || 'N/A'}</span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{otppurpose.name}</div>
                                    <div className={tableStyles.subName}>{otppurpose.slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {otppurpose.expiry_seconds}s
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {otppurpose.max_attempts}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {otppurpose.resend_cooldown_seconds}s
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant={otppurpose.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(otppurpose.otppurpose_id, otppurpose.is_active, otppurpose.name)}
                                    disabled={isLoading}
                                >
                                    {otppurpose.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {otppurpose.created_at ? formatDateTime(otppurpose.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaEdit />}
                                        onClick={() => !isLoading && onEdit(otppurpose)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(otppurpose.otppurpose_id, otppurpose.name)}
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
