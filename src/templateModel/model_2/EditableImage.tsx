import React, { useState, useRef } from 'react';
import { useWedding } from '@/contexts/WeddingContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Edit, Image, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
// If you get a module not found error, run: npm install browser-image-compression
import imageCompression from 'browser-image-compression';

interface EditableImageProps {
  path: string;
  className?: string;
  alt: string;
  asBackground?: boolean;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

interface FileUploadStatus {
  file: File;
  progress: number;
  status: 'pending' | 'compressing' | 'uploading' | 'success' | 'error';
  error?: string;
  originalSize?: number;
  compressedSize?: number;
}

export const EditableImage: React.FC<EditableImageProps> = ({ 
  path, 
  className = '',
  alt,
  asBackground = false,
  isOpen: isOpenProp,
  setIsOpen: setIsOpenProp
}) => {
  const { globalIsLoading: isLoading, updateWeddingData: updateContent, weddingData: content } = useWedding();
  // You may want to use useWeddingAuth for isAuthenticated
  const isAuthenticated = true; // Replace with actual auth logic
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenProp !== undefined ? isOpenProp : internalOpen;
  const setIsOpen = setIsOpenProp !== undefined ? setIsOpenProp : setInternalOpen;
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<FileUploadStatus | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const getValue = (data: any, path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], data);
  };

  const currentUrl = getValue(content, path);

  const handleEdit = () => {
    setSelectedFile(null);
    setFileStatus(null);
    setIsOpen(true);
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };
    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Compression error:', error);
      throw new Error('Failed to compress image');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} is not an image file`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} is larger than 5MB`);
      return;
    }
    setSelectedFile(file);
    setFileStatus({
      file,
      progress: 0,
      status: 'pending',
      originalSize: file.size
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }
    try {
      setIsUploading(true);
      setFileStatus(prev => prev ? { ...prev, status: 'compressing' } : null);
      const compressedFile = await compressImage(selectedFile);
      setFileStatus(prev => prev ? { 
        ...prev, 
        file: compressedFile,
        compressedSize: compressedFile.size,
        status: 'uploading' 
      } : null);
      const fileExt = 'jpg';
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;
      const { data, error } = await supabase.storage
        .from('gallery')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });
      if (error) {
        throw new Error(error.message);
      }
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);
      setFileStatus(prev => prev ? { ...prev, status: 'success', progress: 100 } : null);
      // Update logic for image path (e.g., 'couple.image' or 'story.image')
      const [section, ...rest] = path.split('.');
      const field = rest.join('.');
      if (section === 'couple' || section === 'story') {
        updateContent({
          [section]: {
            ...content[section],
            [field]: publicUrl,
          },
        });
      } else if (section === 'weddingDetails') {
        // For weddingDetails subfields, e.g., 'weddingDetails.event1.image'
        const [subSection, subField] = rest;
        updateContent({
          weddingDetails: {
            ...content.weddingDetails,
            [subSection]: {
              ...content.weddingDetails[subSection],
              [subField]: publicUrl,
            },
          },
        });
      }
      setIsOpen(false);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      setFileStatus(prev => prev ? { ...prev, status: 'error', error: error.message } : null);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setFileStatus(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setFileStatus(null);
    setIsOpen(false);
  };

  const getStatusIcon = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'uploading':
      case 'compressing':
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-rust-600 border-t-transparent" />;
      default:
        return <Image className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (asBackground) {
    return (
      <div className="relative group">
        <div 
          className={className}
          style={{
            backgroundImage: currentUrl ? `url(${currentUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {isAuthenticated && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-10 w-10 p-0 z-50"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 text-gray-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Update Background Image
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                </div>
                {fileStatus && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 flex items-center justify-between gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getStatusIcon(fileStatus.status)}
                        <span className="truncate max-w-[200px]" title={fileStatus.file.name}>
                          {fileStatus.file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {fileStatus.status === 'uploading' && (
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rust-600 transition-all duration-300"
                              style={{ width: `${fileStatus.progress}%` }}
                            />
                          </div>
                        )}
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatFileSize(fileStatus.compressedSize || fileStatus.file.size)}
                          </span>
                          {fileStatus.compressedSize && fileStatus.originalSize && (
                            <span className="text-xs text-green-600">
                              {Math.round((1 - fileStatus.compressedSize / fileStatus.originalSize) * 100)}% smaller
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={currentUrl || '/lovable-uploads/a432833c-6def-44cd-a636-79fa10402a98.png'} 
        alt={alt}
        className={className}
      />
      {isAuthenticated && (
        <>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-10 w-10 p-0 z-50`}
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 text-gray-600" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Update Image
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                </div>
                {fileStatus && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 flex items-center justify-between gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getStatusIcon(fileStatus.status)}
                        <span className="truncate max-w-[200px]" title={fileStatus.file.name}>
                          {fileStatus.file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {fileStatus.status === 'uploading' && (
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rust-600 transition-all duration-300"
                              style={{ width: `${fileStatus.progress}%` }}
                            />
                          </div>
                        )}
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatFileSize(fileStatus.compressedSize || fileStatus.file.size)}
                          </span>
                          {fileStatus.compressedSize && fileStatus.originalSize && (
                            <span className="text-xs text-green-600">
                              {Math.round((1 - fileStatus.compressedSize / fileStatus.originalSize) * 100)}% smaller
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}; 