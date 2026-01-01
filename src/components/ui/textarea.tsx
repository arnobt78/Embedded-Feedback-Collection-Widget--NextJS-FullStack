import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-white/20 placeholder:text-white/60 focus-visible:border-sky-400/50 focus-visible:ring-sky-500/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-white/5 backdrop-blur-sm flex field-sizing-content min-h-16 w-full rounded-xl border px-3 py-2 text-base text-white shadow-lg transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
