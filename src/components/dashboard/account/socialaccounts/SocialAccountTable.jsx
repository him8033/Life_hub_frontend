'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaTrash, FaEdit } from "react-icons/fa";

export default function SocialAccountTable({
    socialaccounts,
    onDelete,
    onEdit,
    isLoading = false
}) {
    if (!socialaccounts || socialaccounts.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    🔗
                </div>
                <p className={tableStyles.emptyText}>No social accounts found</p>
            </div>
        );
    }

    return (
        <div className={tableStyles.tableContainer}>
            <table className={tableStyles.dataTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Provider</th>
                        <th>Provider User ID</th>
                        <th>Provider Email</th>
                        <th>Linked At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {socialaccounts.map((socialaccount) => (
                        <tr key={socialaccount.socialaccount_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{socialaccount.socialaccount_id || 'N/A'}</span>
                            </td>
                            <td>
                                <span className={tableStyles.categoryBadge}>
                                    {socialaccount.user_email || 'Unknown'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{socialaccount.provider_name}</div>
                                    <div className={tableStyles.subName}>{socialaccount.provider_slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {socialaccount.provider_user_id || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {socialaccount.provider_email || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {socialaccount.linked_at ? formatDateTime(socialaccount.linked_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaEdit />}
                                        onClick={() => !isLoading && onEdit(socialaccount)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(socialaccount.socialaccount_id, socialaccount.user_email, socialaccount.provider_name)}
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
