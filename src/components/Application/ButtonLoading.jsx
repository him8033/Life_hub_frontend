import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'

function ButtonLoading({ type = "button", text, isLoading, className, icon, onClick, ...props }) {
    return (
        <Button
            type={type}
            className={cn("flex items-center gap-2", className)}
            disabled={isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                </div>
            ) : (
                <div className="flex items-center justify-center gap-2">
                    {icon}
                    {text}
                </div>
            )}
        </Button>
    )
}

export default ButtonLoading