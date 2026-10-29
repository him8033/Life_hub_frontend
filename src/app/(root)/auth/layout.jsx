import React from 'react'
import { PasswordResetProvider } from '@/context/PasswordResetContext'

const layout = ({ children }) => {
    return (
        <PasswordResetProvider>
            <div>{children}</div>
        </PasswordResetProvider>
    )
}

export default layout