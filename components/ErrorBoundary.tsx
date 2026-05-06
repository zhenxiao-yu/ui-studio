import React, { Component, ErrorInfo, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("UI Studio crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-primary-black text-white">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="max-w-sm text-center text-sm text-primary-grey-300">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            className="rounded bg-primary-green px-4 py-2 text-sm font-semibold text-primary-black hover:opacity-90"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
