import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}
export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });
  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(null);
  };
  if (selectedFile) {
    return (
      <div className="relative flex items-center justify-between p-4 border-2 border-dashed rounded-lg border-primary/30 bg-primary/5">
        <div className="flex items-center gap-3">
          <FileIcon className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <span className="font-medium text-foreground truncate max-w-xs sm:max-w-sm md:max-w-md">
              {selectedFile.name}
            </span>
            <span className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
        <button
          onClick={handleRemoveFile}
          className="p-1 text-muted-foreground rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
          aria-label="Remove file"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }
  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center">
        <UploadCloud className={cn('w-12 h-12 mb-4', isDragActive ? 'text-primary' : 'text-muted-foreground')} />
        <p className="font-semibold text-foreground">
          {isDragActive ? 'Drop the file here...' : 'Drag & drop a PDF file here, or click to select'}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Only .pdf files are accepted</p>
      </div>
    </div>
  );
}