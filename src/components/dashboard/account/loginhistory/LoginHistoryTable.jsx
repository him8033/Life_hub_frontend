'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';

export default function LoginHistoryTable({
    loginhistory,
    isLoading = false
}) {
    if (!loginhistory || loginhistory.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    📊
                </div>
                <p className={tableStyles.emptyText}>No login history found</p>
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
                        <th>Method</th>
                        <th>Status</th>
                        <th>IP Address</th>
                        <th>Device</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {loginhistory.map((history) => (
                        <tr key={history.loginhistory_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{history.loginhistory_id || 'N/A'}</span>
                            </td>
                            <td>
                                <span className={tableStyles.categoryBadge}>
                                    {history.user_email || 'Unknown'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {history.login_method || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={`${tableStyles.statusBadge} ${history.success ? tableStyles.statusActive : tableStyles.statusInactive}`}>
                                    {history.success ? 'Success' : 'Failed'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {history.ip_address || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {history.device || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {history.browser || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {history.operating_system || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {history.created_at ? formatDateTime(history.created_at) : '—'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
