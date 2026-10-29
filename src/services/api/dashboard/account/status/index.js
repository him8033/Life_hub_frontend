/**
 * Account Module - Status CRUD
 * Exports all status-related components, services, and validations
 */

// API Service
export { statusApi } from '@/services/api/dashboard/account/status/statusApi';
export {
    useGetStatusListQuery,
    useGetStatusDetailQuery,
    useCreateStatusMutation,
    useEditStatusMutation,
    useDeleteStatusMutation,
} from '@/services/api/dashboard/account/status/statusApi';

// Component
export { default as StatusTable } from '@/components/dashboard/account/statuses/StatusTable';

// Validations
export {
    createStatusSchema,
    editStatusSchema,
} from '@/lib/validations/dashboard/account/status/statusValidation';
