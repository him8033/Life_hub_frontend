'use client';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import { createContext, useContext, useState } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
    const [state, setState] = useState(null);

    const confirm = (options) => {
        return new Promise((resolve) => {
            setState({
                ...options,
                resolve,
            });
        });
    };

    const handleClose = () => setState(null);

    const handleConfirm = () => {
        state.resolve(true);
        handleClose();
    };

    const handleCancel = () => {
        state.resolve(false);
        handleClose();
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            {state && (
                <ConfirmDialog
                    {...state}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');
    return ctx;
}
