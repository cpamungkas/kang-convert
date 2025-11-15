import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
type ImageFormat = 'image/png' | 'image/jpeg';
interface ConversionResult {
  blob: Blob;
  pageNumber: number;
}
export function usePdfConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedImages, setConvertedImages] = useState<ConversionResult[]>([]);
  const convertPdf = useCallback(async (file: File, format: ImageFormat) => {
    setIsLoading(true);
    setError(null);
    setConvertedImages([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const numPages = pdf.numPages;
      const imageResults: ConversionResult[] = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get canvas context');
        }
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, format, 0.92);
        });
        if (blob) {
          imageResults.push({ blob, pageNumber: i });
        }
      }
      setConvertedImages(imageResults);
    } catch (e) {
      console.error('PDF Conversion Error:', e);
      setError('Failed to convert PDF. The file might be corrupted or unsupported.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setConvertedImages([]);
  }, []);
  return { isLoading, error, convertedImages, convertPdf, reset };
}