import React, { Component, ErrorInfo } from 'react';
import { ErrorText, Button } from './MedicareForm.styles';

interface Props {
  children: React.ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MedicareErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Medicare component error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      const isDeviceError = this.state.error?.message.includes('Permission denied') ||
                           this.state.error?.message.includes('NotAllowedError') ||
                           this.state.error?.message.includes('NotFoundError');

      return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <ErrorText style={{ display: 'block', marginBottom: '1rem' }}>
            {isDeviceError ? (
              'Unable to access camera. Please ensure you have granted camera permissions and try again.'
            ) : (
              'Something went wrong with the Medicare card capture. Please try again or enter details manually.'
            )}
          </ErrorText>
          <Button variant="primary" onClick={this.handleReset}>
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
} 