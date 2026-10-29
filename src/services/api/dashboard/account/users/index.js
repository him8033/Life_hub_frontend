/**
 * Account Module - User CRUD
 * Exports all user-related components, services, and validations
 */

// API Service
export { userApi } from '@/services/api/dashboard/account/users/userApi';
export {
    useGetUserListQuery,
    useGetUserDetailQuery,
    useCreateUserMutation,
    useEditUserMutation,
    useUpdateUserStatusMutation,
    useDeleteUserMutation,
} from '@/services/api/dashboard/account/users/userApi';

// Component
export { default as UserTable } from '@/components/dashboard/account/users/UserTable';

// Validations
export {
    createUserSchema,
    editUserSchema,
    updateUserStatusSchema,
    deleteUserSchema,
} from '@/lib/validations/dashboard/account/users/userValidation';
