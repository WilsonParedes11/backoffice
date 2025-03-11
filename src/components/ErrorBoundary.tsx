import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}