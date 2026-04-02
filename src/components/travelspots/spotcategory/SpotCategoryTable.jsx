'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function SpotCategoryTable({
    spotCategories,
    onDelete,
    onToggleStatus,
    onEdit,
    onView,
    isLoading = false
}) {
    if (!spotCategories || spotCategories.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    📋
                </div>
                <p className={tableStyles.emptyText}>No spot categories available</p>
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
                        <th>Total Spots</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {spotCategories.map((category) => (
                        <tr key={category.spotcategory_id || category.id || category.slug} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{category.spotcategory_id || category.id || 'N/A'}</span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{category.name}</div>
                                    <div className={tableStyles.subName}>{category.slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.countBadge}>
                                    {category.total_spots || 0}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant={category.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(category.slug, category.is_active, category.name)}
                                    disabled={isLoading}
                                >
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {category.created_at ? formatDateTime(category.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    {onView && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={<FaEye />}
                                            onClick={() => !isLoading && onView(category.slug)}
                                            disabled={isLoading}
                                            className={tableStyles.iconButton}
                                        />
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaEdit />}
                                        onClick={() => !isLoading && onEdit(category.slug)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(category.slug, category.name)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
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