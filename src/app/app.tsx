import { AppShell, Header, Title } from "@mantine/core";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalErrorBoundary } from "~/components/global-error-boundary";
import { Logo } from "~/components/logo";
import { Home } from "~/pages/home";

const queryClient = new QueryClient();

type AppRoutesProps = {
  renderRoutes?: (children: JSX.Element) => JSX.Element;
};

/**
 * Renders the top level routes of the app.
 * Provides a prop to replace the underlying router implementation.
 * The actual app will use the BrowserRouter (default value), but tests can
 * swap this out for a MemoryRouter.
 */
export function AppRoutes({
  renderRoutes = (routes) => <BrowserRouter>{routes}</BrowserRouter>,
}: AppRoutesProps): JSX.Element {
  return renderRoutes(
    <Routes>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

/**
 * Renders the App including top level Providers.
 */
export function App(): JSX.Element {
  return (
    <React.StrictMode>
      <GlobalErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppShell
            header={
              <Header height={60} p="xs">
                <Title>
                  <Logo /> Bookmarks JSON
                </Title>
              </Header>
            }
          >
            <main>
              <AppRoutes />
            </main>
          </AppShell>
        </QueryClientProvider>
      </GlobalErrorBoundary>
    </React.StrictMode>
  );
}
