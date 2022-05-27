/**
 * Wraps testing library and adds a custom render function
 * which will apply all of our providers or other "wrapper" setup.
 *
 * https://testing-library.com/docs/react-testing-library/setup/
 *
 * Some ideas for larger apps:
 *
 * - Move the provider setup into a shared space which can then
 *      be reused by the <App /> component as well.
 */
import { render, RenderOptions } from "@testing-library/react";
import React, { FC, ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "~/app";

/**
 * A query provider for react-query that is configured
 * for unit tests.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 0,
      retry: false,
    },
  },
});

/**
 * Applies all providers necessary for components running in a test env.
 */
const AllTheProviders: FC = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

/**
 * Render the provided @param ui within the appropriate testing context.
 * This is useful for testing a single component in isolation.
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Render the top level `<App />` at an initial route.
 * This helps to test a full page component in full context.
 */
const renderApp = (
  initialPath: string,
  options?: Omit<RenderOptions, "wrapper">
) =>
  render(
    <AppRoutes
      renderRoutes={(routes) => (
        <MemoryRouter initialEntries={[initialPath]}>{routes}</MemoryRouter>
      )}
    />,
    {
      wrapper: AllTheProviders,
      ...options,
    }
  );

export * from "@testing-library/react";
export { customRender as render, renderApp };
