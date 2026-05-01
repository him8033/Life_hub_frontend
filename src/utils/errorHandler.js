/**
 * Extract error message from API error response
 * @param {Object} error - The error object from RTK Query
 * @param {string} fallbackMessage - Default message if no error found
 * @returns {string} - The extracted error message
 */
export const extractErrorMessage = (error, fallbackMessage = 'Something went wrong') => {
    const backendErrors = error?.data?.errors;

    if (backendErrors) {
        // Check field_errors first
        if (backendErrors.field_errors) {
            const fieldErrors = backendErrors.field_errors;
            const firstField = Object.keys(fieldErrors)[0];
            if (firstField && fieldErrors[firstField]?.length > 0) {
                return fieldErrors[firstField][0];
            }
        }

        // Check non_field_errors
        if (backendErrors.non_field_errors?.length > 0) {
            return backendErrors.non_field_errors[0];
        }

        // Check for direct field errors (like image: ["error"])
        const directFields = Object.keys(backendErrors).filter(
            key => key !== 'field_errors' && key !== 'non_field_errors'
        );

        for (const field of directFields) {
            if (Array.isArray(backendErrors[field]) && backendErrors[field].length > 0) {
                return backendErrors[field][0];
            }
        }
    }

    // Fallback to message
    return error?.data?.message || fallbackMessage;
};