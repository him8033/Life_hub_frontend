/**
 * Account Module - Role Permission CRUD
 * Exports all role permission-related components, services, and validations
 */

// API Service
export { rolepermissionApi } from '@/services/api/dashboard/account/rolepermissions/rolepermissionApi';
export {
    useGetRolePermissionListQuery,
    useGetRolePermissionDetailQuery,
    useCreateRolePermissionMutation,
    useDeleteRolePermissionMutation,
} from '@/services/api/dashboard/account/rolepermissions/rolepermissionApi';
