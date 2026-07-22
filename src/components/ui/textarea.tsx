import * as React from "react"
import { cn } from "@/lib/utils"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-neutral-900 bg-neutral-950 px-3 py-2 text-base sm:text-sm text-white placeholder:text-neutral-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 resize-y touch-manipulation",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
