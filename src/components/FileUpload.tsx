import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { UploadCloud, CheckCircle2, XCircle, FileText, FileImage, File as FileIcon, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FileUploadProps {
  label: string;
  onUploadSuccess: (url: string) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  value?: string;
}

export function FileUpload({ 
  label, 
  onUploadSuccess, 
  onUploadStart,
  onUploadError,
  accept = "image/*,.pdf", 
  maxSizeMB = 5, 
  value 
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      const msg = `File size must be less than ${maxSizeMB}MB`;
      setError(msg);
      toast.error(msg);
      return;
    }

    setError(null);
    setSelectedFile(file);
    setProgress(0);
    
    // Auto-start upload
    startUpload(file);
  };

  const startUpload = async (file: File) => {
    console.log(`[${label}] Starting upload for:`, file.name);
    if (!currentUser) {
      console.error(`[${label}] No current user, cannot upload.`);
      return;
    }

    setIsUploading(true);
    setError(null);
    if (onUploadStart) onUploadStart();

    const fileExtension = file.name.split('.').pop();
    const fileName = `${currentUser.uid}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `applications/${currentUser.uid}/${fileName}`);
    console.log(`[${label}] Storage path:`, `applications/${currentUser.uid}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Set a safety timeout
    const timeoutId = setTimeout(() => {
      if (isUploading && progress === 0) {
        console.warn(`[${label}] Upload seems stuck at 0%, attempting fallback...`);
      }
    }, 15000);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const totalBytes = snapshot.totalBytes || 1;
        const p = (snapshot.bytesTransferred / totalBytes) * 100;
        console.log(`[${label}] Progress: ${Math.round(p)}% (${snapshot.bytesTransferred}/${snapshot.totalBytes})`);
        setProgress(isNaN(p) ? 0 : p);
      },
      async (error: any) => {
        clearTimeout(timeoutId);
        console.error(`[${label}] Resumable upload error:`, error);
        
        // Fallback to simple uploadBytes if resumable fails
        console.log(`[${label}] Attempting fallback uploadBytes...`);
        try {
          // Try to cancel the resumable task if possible
          try { uploadTask.cancel(); } catch (e) {}
          
          const result = await uploadBytes(storageRef, file);
          console.log(`[${label}] Fallback upload successful`);
          const downloadURL = await getDownloadURL(result.ref);
          console.log(`[${label}] Download URL (fallback):`, downloadURL);
          onUploadSuccess(downloadURL);
          toast.success(`${label} uploaded successfully`);
          setIsUploading(false);
          setSelectedFile(null);
        } catch (fallbackError: any) {
          console.error(`[${label}] Fallback upload error:`, fallbackError);
          let errorMsg = `Upload failed (${fallbackError.code || 'unknown'}). Please try again.`;
          if (fallbackError.code === 'storage/unauthorized') {
            errorMsg = "Permission denied. Please check storage rules.";
          } else if (fallbackError.code === 'storage/retry-limit-exceeded') {
            errorMsg = "Connection timed out. Please check your internet or try a smaller file.";
          }
          setError(errorMsg);
          toast.error(errorMsg);
          setIsUploading(false);
          if (onUploadError) onUploadError(errorMsg);
        }
      },
      async () => {
        clearTimeout(timeoutId);
        console.log(`[${label}] Upload completed successfully`);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`[${label}] Download URL:`, downloadURL);
          onUploadSuccess(downloadURL);
          toast.success(`${label} uploaded successfully`);
          setIsUploading(false);
          setSelectedFile(null);
        } catch (err) {
          console.error(`[${label}] Error getting download URL:`, err);
          const msg = "Failed to get file URL.";
          setError(msg);
          if (onUploadError) onUploadError(msg);
          setIsUploading(false);
        }
      }
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) return <FileImage className="w-8 h-8 text-blue-500" />;
      if (selectedFile.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
      return <FileIcon className="w-8 h-8 text-slate-500" />;
    }
    return <UploadCloud className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="space-y-3 border-2 border-dashed p-4 rounded-lg bg-slate-50/50 transition-colors hover:bg-slate-50">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-700">{label}</Label>
        {value && <CheckCircle2 className="w-5 h-5 text-green-500" />}
      </div>
      
      {!value && !selectedFile && (
        <div className="relative">
          <Input 
            type="file" 
            accept={accept} 
            onChange={handleFileChange} 
            disabled={isUploading}
            className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full"
          />
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-white">
            <UploadCloud className="w-8 h-8 text-slate-400" />
            <p className="text-sm text-slate-600 font-medium">Click or drag to select file</p>
            <p className="text-xs text-slate-400">Max size: {maxSizeMB}MB. Formats: {accept}</p>
          </div>
        </div>
      )}

      {(selectedFile || isUploading) && !value && (
        <div className="bg-white border rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden border">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                getFileIcon()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{selectedFile?.name || 'Uploading...'}</p>
              <p className="text-xs text-slate-500">{selectedFile ? formatSize(selectedFile.size) : 'Please wait'}</p>
            </div>
            {!isUploading && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-medium text-slate-500">
              <span>{progress > 0 ? 'Uploading...' : 'Preparing...'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      )}
      
      {value && (
        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800">File uploaded successfully</p>
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-green-600 hover:underline truncate block"
            >
              View uploaded file
            </a>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onUploadSuccess('')} 
            className="text-red-500 hover:text-red-700 hover:bg-red-100 h-8 px-2"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <XCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
