// src/hooks/useResizablePanel.js
import { useState, useCallback, useEffect, useRef } from 'react';

export function useResizablePanel(defaultWidth = 50) {
    const [leftWidth, setLeftWidth] = useState(defaultWidth);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMouseDown = useCallback(() => {
        setIsDragging(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
            setLeftWidth(Math.min(Math.max(newWidth, 20), 80));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return { leftWidth, setLeftWidth, isDragging, handleMouseDown, containerRef };
}