import { createWorker, PSM } from 'tesseract.js';
import { OcrResult } from '../../types/medicare';

let workerInstance: Tesseract.Worker | null = null;
let workerInitializing = false;
const initializationQueue: Array<() => void> = [];

const initializeWorker = async () => {
  if (workerInstance) return workerInstance;
  
  if (workerInitializing) {
    return new Promise<Tesseract.Worker>(resolve => {
      initializationQueue.push(() => resolve(workerInstance!));
    });
  }

  try {
    workerInitializing = true;
    const worker = await createWorker({
      logger: m => console.debug(m),
      langPath: 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0',
      gzip: true,
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v4.1.1/dist/worker.min.js',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v4.0.4/tesseract-core.wasm.js'
    });

    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ',
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK // Assume uniform text block
      });
      
      workerInstance = worker;
      workerInitializing = false;
      
      initializationQueue.forEach(resolve => resolve());
      initializationQueue.length = 0;
      
      return worker;
    } catch (error) {
      await worker.terminate();
      throw error;
    }
  } catch (error) {
    workerInitializing = false;
    console.error('Failed to initialize OCR worker:', error);
    throw new Error('Failed to initialize OCR system. Please try again or enter details manually.');
  }
};

const preprocessImage = (imageData: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(imageData);
        return;
      }

      // Increase resolution for better OCR
      const scale = 2.0;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Enable image smoothing for upscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw upscaled image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;

      // Calculate average brightness
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        totalBrightness += (r + g + b) / 3;
      }
      const avgBrightness = totalBrightness / (data.length / 4);

      // Dynamic thresholding based on average brightness
      const threshold = avgBrightness < 128 ? 100 : 160;
      const contrast = avgBrightness < 128 ? 2.5 : 2.0;
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      // Enhanced image processing
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Enhanced grayscale conversion with focus on green channel
        const gray = Math.min(255, (0.299 * r + 0.687 * g + 0.114 * b));
        
        // Apply local contrast enhancement
        let enhancedGray = factor * (gray - 128) + 128;
        
        // Apply dynamic thresholding
        if (enhancedGray > threshold) {
          enhancedGray = 255;
        } else if (enhancedGray < threshold - 50) {
          enhancedGray = 0;
        }
        
        data[i] = enhancedGray;
        data[i + 1] = enhancedGray;
        data[i + 2] = enhancedGray;
      }

      // Put the modified image data back
      ctx.putImageData(imageDataObj, 0, 0);

      // Convert to base64 with maximum quality
      resolve(canvas.toDataURL('image/jpeg', 1.0));
    };
    img.src = imageData;
  });
};

const extractMedicareNumber = (text: string): string | undefined => {
  console.debug('Raw OCR text:', text);
  
  // Try multiple patterns for Medicare numbers
  const patterns = [
    /(\d{4})\s*(\d{5})\s*(\d{1})/g,  // Standard format: XXXX XXXXX X
    /(\d{10})/g,                      // Continuous digits
    /(\d[\d\s]{8,}\d)/g              // Digits with any spacing
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      // Clean up and validate the match
      const number = matches[0].replace(/\s/g, '');
      console.debug('Found Medicare number:', number);
      if (number.length === 10) {
        return number;
      }
    }
  }
  
  console.debug('No valid Medicare number found');
  return undefined;
};

const extractIRN = (text: string): string | undefined => {
  // Try multiple patterns for IRN
  const patterns = [
    /(\d{10})\s*(\d{1})/,            // Number followed by IRN
    /IRN\s*[:.]?\s*(\d{1})/i,        // "IRN" label followed by number
    /REF\s*[:.]?\s*(\d{1})/i,        // "REF" label followed by number
    /(\d{1})\s*(?=\d{2}\/\d{2})/     // Single digit before expiry date
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      const irn = matches[1] || matches[2];
      if (irn && /^[1-9]$/.test(irn)) {
        console.debug('Found IRN:', irn);
        return irn;
      }
    }
  }

  console.debug('No valid IRN found');
  return undefined;
};

const extractExpiryDate = (text: string): string | undefined => {
  // Try multiple patterns for expiry dates
  const patterns = [
    /(\d{2})\/(\d{2})/,              // MM/YY
    /VALID TO\s*(\d{2})\/(\d{2})/i,  // "VALID TO" label followed by date
    /EXP\s*(\d{2})\/(\d{2})/i,       // "EXP" label followed by date
    /EXPIRES?\s*(\d{2})\/(\d{2})/i   // "EXPIRES" label followed by date
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      const [, month, year] = matches;
      const monthNum = parseInt(month);
      if (monthNum >= 1 && monthNum <= 12) {
        console.debug('Found expiry date:', `${month}/${year}`);
        return `${month}/${year}`;
      }
    }
  }

  console.debug('No valid expiry date found');
  return undefined;
};

export const processMedicareCard = async (imageData: string): Promise<OcrResult> => {
  try {
    // Preprocess the image
    const processedImage = await preprocessImage(imageData);

    // Initialize or get worker
    const worker = await initializeWorker();

    // Process the image
    const { data: { text, confidence } } = await worker.recognize(processedImage);

    // Extract Medicare details
    const medicareNumber = extractMedicareNumber(text) || '';
    const medicareIRN = extractIRN(text) || '';
    const medicareExpiry = extractExpiryDate(text) || '';

    return {
      medicareNumber,
      medicareIRN,
      medicareExpiry,
      confidence,
      rawText: text
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to process Medicare card');
  }
};

// Cleanup function to terminate worker
export const cleanupOcr = async () => {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
  }
}; 