import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-neutral-900 bg-neutral-950 px-3 py-2 text-base sm:text-sm text-white placeholder:text-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 touch-manipulation",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
