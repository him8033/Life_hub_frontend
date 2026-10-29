/**
 * Account Module - OTP Purpose CRUD
 * Exports all OTP purpose-related components, services, and validations
 */

// API Service
export { otppurposeApi } from '@/services/api/dashboard/account/otppurposes/otppurposeApi';
export {
    useGetOTPPurposeListQuery,
    useGetOTPPurposeDetailQuery,
    useCreateOTPPurposeMutation,
    useEditOTPPurposeMutation,
    useDeleteOTPPurposeMutation,
} from '@/services/api/dashboard/account/otppurposes/otppurposeApi';
