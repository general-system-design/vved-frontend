import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MedicareErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    console.error('Medicare capture error:', error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong with the Medicare card capture</h2>
          <p>Please try again or enter the details manually</p>
          <button onClick={() => {
            this.setState({ hasError: false });
            this.props.onReset();
          }}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 