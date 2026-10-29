/**
 * Account Module - Social Account CRUD
 * Exports all social account-related components, services, and validations
 */

// API Service
export { socialaccountApi } from '@/services/api/dashboard/account/socialaccounts/socialaccountApi';
export {
    useGetSocialAccountListQuery,
    useGetSocialAccountDetailQuery,
    useCreateSocialAccountMutation,
    useEditSocialAccountMutation,
    useDeleteSocialAccountMutation,
} from '@/services/api/dashboard/account/socialaccounts/socialaccountApi';
