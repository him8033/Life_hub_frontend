/**
 * Account Module - OTP CRUD
 * Exports all OTP-related components, services, and validations
 */

// API Service
export { otpApi } from '@/services/api/dashboard/account/otps/otpApi';
export {
    useGetOTPListQuery,
    useGetOTPDetailQuery,
} from '@/services/api/dashboard/account/otps/otpApi';
