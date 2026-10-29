/**
 * Account Module - Social Provider CRUD
 * Exports all social provider-related components, services, and validations
 */

// API Service
export { socialproviderApi } from '@/services/api/dashboard/account/socialproviders/socialproviderApi';
export {
    useGetSocialProviderListQuery,
    useGetSocialProviderDetailQuery,
    useCreateSocialProviderMutation,
    useEditSocialProviderMutation,
    useDeleteSocialProviderMutation,
} from '@/services/api/dashboard/account/socialproviders/socialproviderApi';
