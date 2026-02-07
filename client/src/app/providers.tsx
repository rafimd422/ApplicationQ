"use client";

import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { ToastProvider } from "@/components/ui";
import StyledComponentsRegistry from "@/lib/registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StyledComponentsRegistry>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </StyledComponentsRegistry>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
