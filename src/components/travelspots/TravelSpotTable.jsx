'use client';

import listingStyles from '@/styles/common/Listing.module.css';
import { formatDateTime } from '@/utils/date.utils';
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function TravelSpotTable({
    travelSpots,
    onDelete,
    onToggleStatus,
    onEdit,
    onView,
    isLoading = false
}) {

    return (
        <div className={listingStyles.tableWrapper}>
            <table className={listingStyles.listingTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {travelSpots.map((spot) => (
                        <tr key={spot.id || spot.slug}>
                            <td>{spot.travelspot_id || 'N/A'}</td>
                            <td>
                                <div className={listingStyles.nameCell}>
                                    <div className={listingStyles.name}>{spot.name}</div>
                                    <div className={listingStyles.slug}>{spot.slug}</div>
                                </div>
                            </td>
                            <td>{spot.location.sub_district || 'N/A'}</td>
                            <td>
                                <button
                                    type="button"
                                    className={spot.is_active ? listingStyles.statusActive : listingStyles.statusInactive}
                                    onClick={() => !isLoading && onToggleStatus(spot.travelspot_id, spot.is_active, spot.name)}
                                    style={{
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        opacity: isLoading ? 0.7 : 1
                                    }}
                                    title={spot.is_active ? 'Click to hide' : 'Click to show'}
                                >
                                    {spot.is_active ? 'Active' : 'Inactive'}
                                </button>
                            </td>
                            <td>{spot.created_at ? formatDateTime(spot.created_at) : '—'}</td>
                            <td>
                                <div className={listingStyles.actionButtons}>
                                    <button
                                        onClick={() => !isLoading && onView(spot.slug)}
                                        className={`${listingStyles.actionButton} ${listingStyles.viewButton}`}
                                        title="View Details"
                                        disabled={isLoading}
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => !isLoading && onEdit(spot.slug)}
                                        className={`${listingStyles.actionButton} ${listingStyles.editButton}`}
                                        title="Edit"
                                        disabled={isLoading}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => !isLoading && onDelete(spot.travelspot_id, spot.name)}
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