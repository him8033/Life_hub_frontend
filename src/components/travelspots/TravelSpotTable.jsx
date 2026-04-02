'use client';

import tableStyles from '@/styles/common/TableStyles.module.css';
import { formatDateTime } from '@/utils/date.utils';
import Button from '@/components/common/buttons/Button';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function TravelSpotTable({
    travelSpots,
    onDelete,
    onToggleStatus,
    onEdit,
    onView,
    onViewVisitors,
    isLoading = false
}) {
    if (!travelSpots || travelSpots.length === 0) {
        return (
            <div className={tableStyles.emptyTable}>
                <div className={tableStyles.emptyIcon}>
                    🗺️
                </div>
                <p className={tableStyles.emptyText}>No travel spots available</p>
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
                        <th>State</th>
                        <th>Total Views</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {travelSpots.map((spot) => (
                        <tr key={spot.id || spot.slug} className={tableStyles.tableRow}>
                            <td className={tableStyles.idCell}>
                                <span className={tableStyles.idBadge}>{spot.travelspot_id || 'N/A'}</span>
                            </td>
                            <td>
                                <div className={tableStyles.nameContainer}>
                                    <div className={tableStyles.mainName}>{spot.name}</div>
                                    <div className={tableStyles.subName}>{spot.slug}</div>
                                </div>
                            </td>
                            <td>
                                <span className={tableStyles.stateText}>
                                    {spot.location?.state || 'N/A'}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => !isLoading && onViewVisitors(spot.travelspot_id)}
                                    disabled={isLoading}
                                    className={tableStyles.viewCountButton}
                                >
                                    {spot.view_count || 0}
                                </Button>
                            </td>
                            <td>
                                <Button
                                    variant={spot.is_active ? 'success' : 'danger'}
                                    size="sm"
                                    onClick={() => !isLoading && onToggleStatus(spot.travelspot_id, spot.is_active, spot.name)}
                                    disabled={isLoading}
                                >
                                    {spot.is_active ? 'Active' : 'Inactive'}
                                </Button>
                            </td>
                            <td>
                                <span className={tableStyles.dateText}>
                                    {spot.created_at ? formatDateTime(spot.created_at) : '—'}
                                </span>
                            </td>
                            <td>
                                <div className={tableStyles.actionsContainer}>
                                    {onView && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={<FaEye />}
                                            onClick={() => !isLoading && onView(spot.slug)}
                                            disabled={isLoading}
                                            className={tableStyles.iconButton}
                                            title="View Details"
                                        />
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaEdit />}
                                        onClick={() => !isLoading && onEdit(spot.slug)}
                                        disabled={isLoading}
                                        className={tableStyles.iconButton}
                                        title="Edit"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={<FaTrash />}
                                        onClick={() => !isLoading && onDelete(spot.travelspot_id, spot.name)}
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