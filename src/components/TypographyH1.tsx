import React, { ReactNode } from "react";

export function TypographyH1({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  )
}
