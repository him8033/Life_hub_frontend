'use client';

import listingStyles from '@/styles/common/Listing.module.css';
import { formatDateTime } from '@/utils/date.utils';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function SpotCategoryTable({
    spotCategories,
    onDelete,
    onToggleStatus,
    onEdit,
    isLoading = false
}) {

    return (
        <div className={listingStyles.tableWrapper}>
            <table className={listingStyles.listingTable}>
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
                        <tr key={category.id || category.slug}>
                            <td>{category.spotcategory_id || 'N/A'}</td>
                            <td>
                                <div className={listingStyles.nameCell}>
                                    <div className={listingStyles.name}>{category.name}</div>
                                    <div className={listingStyles.slug}>{category.slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={listingStyles.badge}>
                                    {category.total_spots || 0}
                                </span>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className={category.is_active ? listingStyles.statusActive : listingStyles.statusInactive}
                                    onClick={() => !isLoading && onToggleStatus(category.slug, category.is_active, category.name)}
                                    style={{
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        opacity: isLoading ? 0.7 : 1
                                    }}
                                    title={category.is_active ? 'Click to hide' : 'Click to show'}
                                >
                                    {category.is_active ? 'Active' : 'Inactive'}
                                </button>
                            </td>
                            <td>{category.created_at ? formatDateTime(category.created_at) : '—'}</td>
                            <td>
                                <div className={listingStyles.actionButtons}>
                                    <button
                                        onClick={() => !isLoading && onEdit(category.slug)}
                                        className={`${listingStyles.actionButton} ${listingStyles.editButton}`}
                                        title="Edit"
                                        disabled={isLoading}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => !isLoading && onDelete(category.slug, category.name)}
                                        className={`${listingStyles.actionButton} ${listingStyles.deleteButton}`}
                                        title="Delete"
                                        disabled={isLoading}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}