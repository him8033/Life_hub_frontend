```bash
// 1. Default (white background, automatic colors based on error type)
<SimpleErrorState
    message="Failed to load travel spots. Please try again."
    errorType="error"
    onRetry={() => refetch()}
    retryMsg="Refresh"
/>

// 2. Custom card background color
<SimpleErrorState
    message="Maintenance in progress"
    errorType="info"
    cardBackground="#f0f9ff" // Light blue
    onRetry={() => refetch()}
    retryMsg="Refresh"
/>

// 3. Custom text color
<SimpleErrorState
    message="Session expired"
    errorType="warning"
    textColor="#7c2d12" // Dark orange
    onRetry={() => router.push('/login')}
    retryMsg="Login"
/>

// 4. Custom button color
<SimpleErrorState
    message="No data found"
    errorType="info"
    buttonBackground="#059669" // Green button
    onRetry={() => router.push('/create')}
    retryMsg="Create New"
/>

// 5. All custom colors
<SimpleErrorState
    message="Custom styled error"
    errorType="error"
    cardBackground="#fef2f2" // Light red
    textColor="#991b1b" // Dark red
    buttonBackground="#dc2626" // Red button
    onRetry={() => refetch()}
    retryMsg="Retry"
/>

// 6. Dark theme error
<SimpleErrorState
    message="Server error occurred"
    errorType="error"
    cardBackground="#1f2937" // Dark gray
    textColor="#f9fafb" // White text
    buttonBackground="#ef4444" // Red button
    onRetry={() => refetch()}
    retryMsg="Try Again"
/>

// 7. Success-like error (with info type)
<SimpleErrorState
    message="Action completed successfully"
    errorType="info"
    cardBackground="#f0fdf4" // Light green
    textColor="#065f46" // Dark green
    buttonBackground="#10b981" // Green button
    onRetry={() => router.push('/dashboard')}
    retryMsg="Continue"
/>
```