"use client";

import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { ToastProvider } from "@/components/ui";
import StyledComponentsRegistry from "@/lib/registry";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {/* <ToastProvider>{children}</ToastProvider> */}
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
