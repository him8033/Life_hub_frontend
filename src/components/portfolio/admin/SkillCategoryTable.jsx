'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function SkillCategoryTable({
    categories,
    onDelete,
    onToggleStatus,
    onEdit,
    isLoading = false
}) {
    if (!categories || categories.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>📊</div>
                <p className={tableStyles.emptyText}>No skill categories available</p>
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
                        <th>Slug</th>
                        <th>Icon</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.skillcategory_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>
                                    {category.skillcategory_id}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{category.name}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.slugText}>{category.slug}</span>
                            </td>
                            <td>
                                <span className={tableStyles.iconDisplay}>
                                    {category.icon || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.countBadge}>
                                    {category.position || 0}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant={category.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(category.skillcategory_id, category.is_active, category.name)}
                                    disabled={isLoading}
                                >
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiEdit2 />}
                                        onClick={() => !isLoading && onEdit(category.skillcategory_id)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiTrash2 />}
                                        onClick={() => !isLoading && onDelete(category.skillcategory_id, category.name)}
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