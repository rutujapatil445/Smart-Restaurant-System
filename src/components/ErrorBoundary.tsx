import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, ArrowLeft, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends (Component as any) {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleGoBack = () => {
    window.history.back();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-12 text-center border border-stone-100">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-500">
              <AlertCircle size={40} />
            </div>
            
            <h1 className="text-3xl font-serif font-bold text-stone-900 mb-4 italic">Something went wrong</h1>
            <p className="text-stone-500 font-light mb-8 leading-relaxed">
              We encountered an unexpected error. Our team has been notified and we're working to fix it.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
              >
                <RefreshCcw size={16} />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoBack}
                className="w-full py-4 bg-white text-stone-600 border border-stone-200 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <div className="mt-8 p-4 bg-stone-100 rounded-xl text-left overflow-auto max-h-40">
                <p className="text-[10px] font-mono text-stone-500 break-all">
                  {error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
