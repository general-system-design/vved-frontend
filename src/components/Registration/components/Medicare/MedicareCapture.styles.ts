import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const CaptureOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

export const CaptureContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;

  @media (min-width: 768px) {
    width: 90%;
    max-width: 600px;
    height: auto;
    margin: 2rem;
    border-radius: 12px;
    overflow: hidden;
  }
`;

export const CameraViewport = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
  background: #000;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (min-width: 768px) {
    aspect-ratio: 1.586;
  }
`;

export const GuideOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const CardGuide = styled.div`
  width: 85%;
  height: 53.6%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
`;

export const Instructions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
  font-size: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
`;

export const ControlsContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1a1a;
  gap: 1rem;

  @media (max-width: 767px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.variant === 'primary' ? '#0d6efd' : '#6c757d'};
  color: white;
  flex: 1;
  max-width: 200px;
  min-width: 120px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 767px) {
    padding: 1.25rem;
    width: 100%;
    max-width: none;
    font-size: 1.125rem;
  }
`;

export const PreviewContainer = styled.div`
  padding: 1.5rem;
  background: #fff;
  
  @media (max-width: 767px) {
    padding: 1rem;
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export const ProcessingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(4px);
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0d6efd;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1.5rem;
`;

export const ProcessingStatus = styled.div`
  text-align: center;
  color: #333;
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
  padding: 0 1rem;
`;

export const ConfidenceIndicator = styled.div<{ value: number }>`
  width: 200px;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  margin-top: 0.75rem;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.value}%;
    height: 100%;
    background: ${props => props.value > 70 ? '#28a745' : props.value > 40 ? '#ffc107' : '#dc3545'};
    transition: width 0.3s ease-in-out;
  }
`; 