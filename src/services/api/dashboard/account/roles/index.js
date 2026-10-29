/**
 * Account Module - Role CRUD
 * Exports all role-related components, services, and validations
 */

// API Service
export { roleApi } from '@/services/api/dashboard/account/roles/roleApi';
export {
    useGetRoleListQuery,
    useGetRoleDetailQuery,
    useCreateRoleMutation,
    useEditRoleMutation,
    useDeleteRoleMutation,
} from '@/services/api/dashboard/account/roles/roleApi';

// Component
export { default as RoleTable } from '@/components/dashboard/account/roles/RoleTable';

// Validations
export {
    createRoleSchema,
    editRoleSchema,
} from '@/lib/validations/dashboard/account/roles/roleValidation';
