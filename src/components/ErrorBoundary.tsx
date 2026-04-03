import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || 'An unknown error occurred';
      let isFirestoreError = false;

      try {
        const parsedError = JSON.parse(errorMessage);
        if (parsedError.operationType) {
          isFirestoreError = true;
          errorMessage = `Firestore Permission Denied: You do not have permission to ${parsedError.operationType} at path ${parsedError.path}.`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h1>
            <div className="bg-slate-100 p-4 rounded-lg text-left mb-6 overflow-auto max-h-48">
              <p className="text-sm text-slate-700 font-mono break-words">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-700 hover:bg-primary-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
