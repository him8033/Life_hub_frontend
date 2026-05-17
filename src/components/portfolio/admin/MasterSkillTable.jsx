'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';

export default function MasterSkillTable({
    skills,
    onDelete,
    onToggleStatus,
    onEdit,
    isLoading = false
}) {
    if (!skills || skills.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>💻</div>
                <p className={tableStyles.emptyText}>No master skills available</p>
            </div>
        );
    }

    return (
        <div className={tableStyles.tableContainer}>
            <table className={tableStyles.dataTable}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Slug</th>
                        <th>Icon</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Updated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((skill) => (
                        <tr key={skill.masterskill_id} className={tableStyles.tableRow}>
                            <td>
                                <div className={tableStyles.imageCell}>
                                    {skill.image_url ? (
                                        <img
                                            src={skill.image_url}
                                            alt={skill.name}
                                            className={tableStyles.thumbnailImage}
                                        />
                                    ) : (
                                        <div className={tableStyles.imagePlaceholder}>
                                            <FiImage size={16} />
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{skill.name}</div>
                                    {skill.description && (
                                        <div className={tableStyles.subName}>
                                            {skill.description.length > 50
                                                ? `${skill.description.substring(0, 50)}...`
                                                : skill.description}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.categoryBadge}>
                                    {skill.category_name || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.idBadge}>{skill.slug}</span>
                            </td>
                            <td>
                                <span className={tableStyles.iconDisplay}>
                                    {skill.icon || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.countBadge}>
                                    {skill.priority || 0}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant={skill.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(skill.masterskill_id, skill.is_active, skill.name)}
                                    disabled={isLoading}
                                >
                                    {skill.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {skill.updated_at ? formatDateTime(skill.updated_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiEdit2 />}
                                        onClick={() => !isLoading && onEdit(skill.masterskill_id)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiTrash2 />}
                                        onClick={() => !isLoading && onDelete(skill.masterskill_id, skill.name)}
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