import React from "react";

type GlobalErrorBoundaryProps = unknown;

type GlobalErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Handle any uncaught errors that bubble up to the top of the tree.
 * https://reactjs.org/docs/error-boundaries.html
 */
export class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  state: GlobalErrorBoundaryState = {
    hasError: false,
  };

  /**
   * Receives an error property if needed
   */
  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * Run side effects - like logging the error to a service - here.
   */
  // componentDidCatch(error, errorInfo) {
  //   // You can also log the error to an error reporting service
  //   logErrorToMyService(error, errorInfo);
  // }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
