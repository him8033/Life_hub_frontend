/**
 * Account Module - Permission CRUD
 * Exports all permission-related components, services, and validations
 */

// API Service
export { permissionApi } from '@/services/api/dashboard/account/permissions/permissionApi';
export {
    useGetPermissionListQuery,
    useGetPermissionDetailQuery,
    useCreatePermissionMutation,
    useEditPermissionMutation,
    useDeletePermissionMutation,
} from '@/services/api/dashboard/account/permissions/permissionApi';
