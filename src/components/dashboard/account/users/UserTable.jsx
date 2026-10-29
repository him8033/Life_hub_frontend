'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaEdit, FaTrash, FaLock } from "react-icons/fa";

export default function UserTable({
    users,
    onDelete,
    onUpdateStatus,
    onEdit,
    isLoading = false
}) {
    if (!users || users.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    👥
                </div>
                <p className={tableStyles.emptyText}>No users available</p>
            </div>
        );
    }

    return (
        <div className={tableStyles.tableContainer}>
            <table className={tableStyles.dataTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Roles</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{user.user_id || 'N/A'}</span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{user.email}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {user.first_name} {user.last_name}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    {(user.roles || []).map((role) => (
                                        <span key={typeof role === 'string' ? role : role.slug} className={tableStyles.roleBadge}>
                                            {typeof role === 'string' ? role : role.name}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td>
                                <span className={`${tableStyles.statusBadge} ${user.status === 'active' || user.status?.slug === 'active' ? tableStyles.statusActive : tableStyles.statusInactive}`}>
                                    {typeof user.status === 'string' ? user.status : user.status?.name || 'Unknown'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {user.created_at ? formatDateTime(user.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaLock />}
                                        onClick={() => !isLoading && onUpdateStatus(user)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Update Status"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaEdit />}
                                        onClick={() => !isLoading && onEdit(user)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(user)}
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
