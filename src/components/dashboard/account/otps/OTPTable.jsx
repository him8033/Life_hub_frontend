'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';

export default function OTPTable({
    otps,
    isLoading = false
}) {
    if (!otps || otps.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    🔐
                </div>
                <p className={tableStyles.emptyText}>No OTP records found</p>
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
                        <th>Purpose</th>
                        <th>Attempts</th>
                        <th>Status</th>
                        <th>Expires At</th>
                        <th>Used At</th>
                        <th>Requested IP</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {otps.map((otp) => (
                        <tr key={otp.otp_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{otp.otp_id || 'N/A'}</span>
                            </td>
                            <td>
                                <span className={tableStyles.categoryBadge}>
                                    {otp.user_email || 'Unknown'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{otp.purpose_name}</div>
                                    <div className={tableStyles.subName}>{otp.purpose_slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {otp.attempts} / {otp.purpose_slug === 'email-verification' ? 3 : 5}
                                </span>
                            </td>
                            <td>
                                <span className={`${tableStyles.statusBadge} ${otp.is_used ? tableStyles.statusActive : tableStyles.statusInactive}`}>
                                    {otp.is_used ? 'Used' : 'Pending'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {otp.expires_at ? formatDateTime(otp.expires_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {otp.used_at ? formatDateTime(otp.used_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.mutedText}>
                                    {otp.requested_ip || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {otp.created_at ? formatDateTime(otp.created_at) : '—'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
