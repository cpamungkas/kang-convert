import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { AppLayout } from '@/components/layout/AppLayout';
import { FileUpload } from '@/components/FileUpload';
import { usePdfConverter } from '@/hooks/usePdfConverter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileWarning, Loader2, Image as ImageIcon, Archive } from 'lucide-react';
import { Toaster, toast } from '@/components/ui/sonner';
type ImageFormat = 'image/png' | 'image/jpeg';
export function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageFormat>('image/png');
  const [isZipping, setIsZipping] = useState(false);
  const { isLoading, error, convertedImages, convertPdf, reset } = usePdfConverter();
  const handleConvert = () => {
    if (file) {
      convertPdf(file, format);
    }
  };
  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (!selectedFile) {
      reset();
    }
  };
  const handleDownload = (blob: Blob, pageNumber: number) => {
    const extension = format === 'image/png' ? 'png' : 'jpg';
    const fileName = `${file?.name.replace('.pdf', '') || 'page'}_${pageNumber}.${extension}`;
    saveAs(blob, fileName);
    toast.success(`Page ${pageNumber} downloaded successfully!`);
  };
  const handleDownloadAll = async () => {
    if (convertedImages.length === 0) return;
    setIsZipping(true);
    toast.info('Creating ZIP file, please wait...');
    try {
      const zip = new JSZip();
      const extension = format === 'image/png' ? 'png' : 'jpg';
      const baseFileName = file?.name.replace('.pdf', '') || 'image';
      convertedImages.forEach(({ blob, pageNumber }) => {
        zip.file(`${baseFileName}_${pageNumber}.${extension}`, blob);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${baseFileName}.zip`);
      toast.success('ZIP file downloaded successfully!');
    } catch (err) {
      console.error('Zipping Error:', err);
      toast.error('Failed to create ZIP file.');
    } finally {
      setIsZipping(false);
    }
  };
  return (
    <AppLayout>
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24">
            <header className="text-center mb-12">
              <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Aura Convert
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A sleek, in-memory PDF to image converter that respects user privacy by processing files entirely in your browser.
              </p>
            </header>
            <Card className="shadow-lg animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">PDF to Image Converter</CardTitle>
                <CardDescription>Select a PDF, choose your format, and convert.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <FileUpload onFileSelect={handleFileSelect} />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <RadioGroup
                      defaultValue="image/png"
                      onValueChange={(value: string) => setFormat(value as ImageFormat)}
                      className="flex items-center gap-4"
                      disabled={isLoading}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="image/png" id="png" />
                        <Label htmlFor="png">PNG</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="image/jpeg" id="jpg" />
                        <Label htmlFor="jpg">JPG</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button
                    onClick={handleConvert}
                    disabled={!file || isLoading}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Convert
                      </>
                    )}
                  </Button>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <FileWarning className="h-4 w-4" />
                    <AlertTitle>Conversion Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <AnimatePresence>
                  {(isLoading || convertedImages.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          Results {convertedImages.length > 0 && `(${convertedImages.length} images)`}
                        </h3>
                        {!isLoading && convertedImages.length > 0 && (
                          <Button onClick={handleDownloadAll} disabled={isZipping} variant="outline" size="sm">
                            {isZipping ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Archive className="mr-2 h-4 w-4" />
                            )}
                            Download All (.zip)
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {isLoading &&
                          Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                              <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                              <Skeleton className="h-8 w-full rounded-md" />
                            </div>
                          ))}
                        {!isLoading && convertedImages.map(({ blob, pageNumber }) => (
                          <div key={pageNumber} className="group relative overflow-hidden rounded-lg shadow-md">
                            <img
                              src={URL.createObjectURL(blob)}
                              alt={`Page ${pageNumber}`}
                              className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-300 group-hover:scale-105"
                              onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <Button
                                size="sm"
                                onClick={() => handleDownload(blob, pageNumber)}
                                className="bg-white/90 text-black hover:bg-white"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
            <footer className="text-center mt-12 text-sm text-muted-foreground">
              Built with ❤️ at Cloudflare
            </footer>
          </div>
        </div>
      </div>
      <Toaster richColors closeButton />
    </AppLayout>
  );
}