'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import GlobalModal from '@/components/common/GlobalModal';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [state, setState] = useState(null);

    const showModal = useCallback((config) => {
        return new Promise((resolve) => {
            setState({ ...config, resolve });
        });
    }, []);

    const handleClose = useCallback((result = null) => {
        setState((prev) => {
            prev?.resolve?.(result);
            return null;
        });
    }, []);

    return (
        <ModalContext.Provider value={{ showModal }}>
            {children}
            {state && <GlobalModal {...state} onClose={handleClose} />}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used inside ModalProvider');
    return ctx.showModal;
}