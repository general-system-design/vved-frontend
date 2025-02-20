import React, { useCallback, useRef, useState, useEffect, memo } from 'react';
import Webcam from 'react-webcam';
import { CameraCaptureProps, OcrResult } from '../../types/medicare';
import { processMedicareCard } from './OcrProcessor';
import { OcrPreview } from './OcrPreview';
import { MedicareErrorBoundary } from './MedicareErrorBoundary';
import {
  CaptureOverlay,
  CaptureContainer,
  CameraViewport,
  GuideOverlay,
  CardGuide,
  Instructions,
  ControlsContainer,
  Button,
  PreviewContainer,
  PreviewImage,
  ProcessingOverlay,
  Spinner,
  ProcessingStatus
} from './MedicareCapture.styles';

const CAPTURE_OPTIONS = {
  width: 1920,
  height: 1080,
  facingMode: 'environment',
  aspectRatio: 1.586, // Medicare card aspect ratio
};

// Memoized camera component for better performance
const Camera = memo(({ onCapture, webcamRef }: { onCapture: () => void; webcamRef: React.RefObject<Webcam | null> }) => (
  <>
    <CameraViewport>
      <Webcam
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={CAPTURE_OPTIONS}
        style={{ width: '100%', height: '100%' }}
        ref={webcamRef}
      />
      <GuideOverlay>
        <CardGuide />
      </GuideOverlay>
      <Instructions>
        Position your Medicare card within the frame
      </Instructions>
    </CameraViewport>
    <ControlsContainer>
      <Button onClick={onCapture}>
        Capture
      </Button>
    </ControlsContainer>
  </>
));

Camera.displayName = 'Camera';

export const MedicareCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  isOpen
}) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Check camera permissions
  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false));
    }
  }, [isOpen]);

  // Cleanup resources when component unmounts or closes
  useEffect(() => {
    return () => {
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error('Failed to capture image');

      setCapturedImage(imageSrc);
      setIsProcessing(true);
      setError(null);

      const result = await processMedicareCard(imageSrc);
      setOcrResult(result);
    } catch (err) {
      setError('Failed to process Medicare card. Please try again or enter details manually.');
      console.error('Medicare capture error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setOcrResult(null);
    setError(null);
  }, [capturedImage]);

  const handleConfirm = useCallback((correctedResult: OcrResult) => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  }, [capturedImage, onCapture, onClose]);

  if (!isOpen) return null;

  if (hasPermission === false) {
    return (
      <CaptureOverlay>
        <CaptureContainer>
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <ProcessingStatus style={{ color: '#dc3545', marginBottom: '1rem' }}>
              Camera access is required to scan your Medicare card.
              Please enable camera access in your browser settings.
            </ProcessingStatus>
            <Button onClick={onClose}>Enter Details Manually</Button>
          </div>
        </CaptureContainer>
      </CaptureOverlay>
    );
  }

  return (
    <CaptureOverlay>
      <CaptureContainer>
        <MedicareErrorBoundary onReset={handleRetry}>
          {!capturedImage ? (
            <Camera onCapture={handleCapture} webcamRef={webcamRef} />
          ) : (
            <>
              <PreviewContainer>
                <PreviewImage src={capturedImage} alt="Captured Medicare card" />
              </PreviewContainer>
              
              {isProcessing && (
                <ProcessingOverlay>
                  <Spinner />
                  <ProcessingStatus>Processing Medicare card...</ProcessingStatus>
                </ProcessingOverlay>
              )}

              {error && (
                <>
                  <ProcessingStatus style={{ color: '#dc3545' }}>
                    {error}
                  </ProcessingStatus>
                  <ControlsContainer>
                    <Button onClick={handleRetry}>Try Again</Button>
                    <Button onClick={onClose}>Enter Manually</Button>
                  </ControlsContainer>
                </>
              )}

              {ocrResult && !error && (
                <OcrPreview
                  ocrResult={ocrResult}
                  onConfirm={handleConfirm}
                  onRetry={handleRetry}
                  onCancel={onClose}
                />
              )}
            </>
          )}
        </MedicareErrorBoundary>
      </CaptureContainer>
    </CaptureOverlay>
  );
}; 