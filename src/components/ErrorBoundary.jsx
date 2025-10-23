import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.state = { hasError: true, error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-6">
              <h1 className="text-2xl font-bold text-red-400 mb-4">
                Une erreur s'est produite
              </h1>
              <p className="text-zinc-300 mb-4">
                L'application a rencontré un problème inattendu.
              </p>

              {this.state.error && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-zinc-400 mb-2">Message d'erreur :</div>
                  <pre className="bg-zinc-950 p-3 rounded text-xs text-red-300 overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}

              {this.state.errorInfo && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-zinc-400 mb-2">Stack trace :</div>
                  <pre className="bg-zinc-950 p-3 rounded text-xs text-zinc-400 overflow-x-auto max-h-64 overflow-y-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}

              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors font-medium"
              >
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
