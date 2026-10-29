/**
 * Account Module - Login History CRUD
 * Exports all login history-related components, services, and validations
 */

// API Service
export { loginhistoryApi } from '@/services/api/dashboard/account/loginhistory/loginhistoryApi';
export {
    useGetLoginHistoryListQuery,
    useGetLoginHistoryDetailQuery,
} from '@/services/api/dashboard/account/loginhistory/loginhistoryApi';
