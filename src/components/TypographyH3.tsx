import React, { ReactNode } from "react";

export function TypographyH3({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  )
}
