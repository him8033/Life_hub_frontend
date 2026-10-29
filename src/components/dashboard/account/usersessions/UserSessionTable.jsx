'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaBan } from "react-icons/fa";

export default function UserSessionTable({
    usersessions,
    onRevoke,
    isLoading = false
}) {
    if (!usersessions || usersessions.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    🖥️
                </div>
                <p className={tableStyles.emptyText}>No active sessions found</p>
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
                        <th>Device</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th>IP Address</th>
                        <th>Status</th>
                        <th>Last Activity</th>
                        <th>Expires At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usersessions.map((session) => (
                        <tr key={session.usersession_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{session.usersession_id || 'N/A'}</span>
                            </td>
                            <td>
                                <span className={tableStyles.categoryBadge}>
                                    {session.user_email || 'Unknown'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {session.device || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {session.browser || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {session.operating_system || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {session.ip_address || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={`${tableStyles.statusBadge} ${session.is_active ? tableStyles.statusActive : tableStyles.statusInactive}`}>
                                    {session.is_active ? 'Active' : 'Revoked'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {session.last_activity_at ? formatDateTime(session.last_activity_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {session.expires_at ? formatDateTime(session.expires_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    {session.is_active && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={<FaBan />}
                                            onClick={() => !isLoading && onRevoke(session.usersession_id, session.user_email)}
                                            disabled={isLoading}
                                            className={tableStyles.iconButton}
                                            title="Revoke Session"
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
