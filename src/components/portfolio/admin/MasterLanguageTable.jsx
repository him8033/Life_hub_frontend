'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function MasterLanguageTable({
    languages,
    onDelete,
    onToggleStatus,
    onEdit,
    isLoading = false
}) {
    if (!languages || languages.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>🗣️</div>
                <p className={tableStyles.emptyText}>No master languages available</p>
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
                        <th>Code</th>
                        <th>Slug</th>
                        <th>Icon</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {languages.map((language) => (
                        <tr key={language.masterlanguage_id} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>
                                    {language.masterlanguage_id}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{language.name}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.codeBadge}>
                                    {language.code || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.idBadge}>{language.slug}</span>
                            </td>
                            <td>
                                <span className={tableStyles.iconDisplay}>
                                    {language.icon || '—'}
                                </span>
                            </td>
                            <td>
                                <span className={tableStyles.countBadge}>
                                    {language.position || 0}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant={language.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(language.masterlanguage_id, language.is_active, language.name)}
                                    disabled={isLoading}
                                >
                                    {language.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {language.created_at ? formatDateTime(language.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiEdit2 />}
                                        onClick={() => !isLoading && onEdit(language.masterlanguage_id)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FiTrash2 />}
                                        onClick={() => !isLoading && onDelete(language.masterlanguage_id, language.name)}
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