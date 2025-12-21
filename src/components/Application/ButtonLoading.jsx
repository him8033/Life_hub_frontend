import React from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'

function ButtonLoading({ type = "button", text, isLoading, className, onClick, ...props }) {
    return (
        <Button
            type={type}
            className={cn("flex items-center gap-2", className)}
            disabled={isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2Icon className="animate-spin h-4 w-4" />
                    <span>Please wait...</span>
                </>
            ) : (
                <span>{text}</span>
            )}
        </Button>
    )
}

export default ButtonLoading