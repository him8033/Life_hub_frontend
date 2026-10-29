'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaTrash } from "react-icons/fa";

export default function RolePermissionTable({
    rolepermissions,
    onDelete,
    isLoading = false
}) {
    if (!rolepermissions || rolepermissions.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    🔑
                </div>
                <p className={tableStyles.emptyText}>No role permissions found</p>
            </div>
        );
    }

    return (
        <div className={tableStyles.tableContainer}>
            <table className={tableStyles.dataTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Role</th>
                        <th>Permission</th>
                        <th>Module</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rolepermissions.map((rolepermission) => (
                        <tr key={rolepermission.rolepermission_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{rolepermission.rolepermission_id || 'N/A'}</span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{rolepermission.role_name}</div>
                                    <div className={tableStyles.subName}>{rolepermission.role_slug}</div>
                                </div>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{rolepermission.permission_name}</div>
                                    <div className={tableStyles.subName}>{rolepermission.permission_slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.categoryBadge}>
                                    {rolepermission.permission_module || 'General'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {rolepermission.created_at ? formatDateTime(rolepermission.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(rolepermission.rolepermission_id, rolepermission.role_name, rolepermission.permission_name)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Remove Permission"
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
